"""Minimal dependency-free language detection for the SEO build gate.

Detects the dominant language of a text sample using Unicode character
blocks plus stop-word statistics. Supports the 17 site locales
(en, de, pt, fr, es, it, ru, pl, cs, ar, nl, sv, no, el, fi, da, ja)
plus a zh fallback for CJK text without kana.

ja is detected via kana (hiragana/katakana occur only in Japanese, so
they win over the zh CJK fallback even in short strings); it has no
Latin stop-words because Japanese prose is kana-dominant.

API: is_mismatch(expected, text, min_conf=0.0) -> (bool, str|None, float)
"""

import re

_ARABIC = "ar"
_GREEK = "el"
_CYRILLIC = "ru"
_JAPANESE = "ja"
_CJK = "zh"

NON_LATIN_BLOCKS = [
    (_ARABIC, re.compile("[\u0600-\u06FF]")),
    (_GREEK, re.compile("[\u0370-\u03FF]")),
    (_CYRILLIC, re.compile("[\u0400-\u04FF]")),
    (_CJK, re.compile("[\u4E00-\u9FFF\u3400-\u4DBF]")),
]

# 假名只出现在日语中：含假名的 CJK 样本归 ja，纯汉字（无假名）才归 zh 兜底
_KANA = re.compile("[\u3040-\u30FF]")

# pl/pt 共享大量停止词（na/do/o，且单字母词被过滤），cs/pl 同属西斯拉夫语支
# （共享 na/do/to/jak/od/po），no/da 共享斯堪的纳维亚词表，短样本极易误判。
# 专属字母按 2 倍加权计入得分（封顶 6），但只收录在 17 个站点语言中「独占」
# 的字母：ą ć ę ł ń ś ź ż 只在波兰语，ě ů ř ť ď ň 只在捷克语，ã õ 只在
# 葡萄牙语，ø æ 同属丹麦/挪威语（组内打平由 av/af 停止词裁决）。
# 反例教训：ä/ö 同属 de/sv/fi、å 同属 sv/no/da，加权会让含 3 个变音符的
# 德语技术文被 sv 抢走 —— 共享字母一律不加分，sv/fi/de 不参与加权
_DIA_EVIDENCE = [
    ("pl", re.compile("[\u0105\u0107\u0119\u0142\u0144\u015B\u017A\u017C]")),  # ą ć ę ł ń ś ź ż
    ("cs", re.compile("[\u011B\u016F\u0159\u0165\u010F\u0148]")),              # ě ů ř ť ď ň
    ("pt", re.compile("[\u00E3\u00F5]")),                                     # ã õ
    ("no", re.compile("[\u00F8\u00E6]")),                                     # ø æ
    ("da", re.compile("[\u00F8\u00E6]")),                                     # ø æ
]


def _dia_count(lang, text):
    for l, pattern in _DIA_EVIDENCE:
        if l == lang:
            return len(pattern.findall(text))
    return 0

STOPWORDS = {
    "en": {"the", "and", "of", "to", "a", "in", "for", "is", "on", "that", "with", "as", "by", "at", "from"},
    "de": {"der", "die", "das", "und", "in", "den", "von", "mit", "for", "ist", "auf", "zu", "ein", "eine", "sich"},
    "pt": {"o", "a", "os", "as", "do", "da", "de", "que", "em", "para", "com", "um", "uma", "no", "na"},
    "fr": {"le", "la", "les", "de", "des", "et", "pour", "avec", "une", "dans", "sur", "est", "un", "en", "au"},
    "es": {"el", "la", "los", "las", "de", "del", "que", "en", "para", "con", "por", "un", "una", "y", "es"},
    "it": {"il", "lo", "la", "le", "di", "del", "che", "e", "per", "con", "in", "un", "una", "non", "è"},
    "ru": {"и", "в", "не", "на", "что", "с", "по", "как", "это", "для", "от", "при", "или", "из", "о"},
    "pl": {"w", "na", "nie", "się", "do", "to", "z", "i", "o", "jak", "od", "po", "przez", "dla", "jest",
           "oraz", "tylko", "bardzo", "są", "można", "więcej", "dzięki", "również", "czyli", "każdy",
           "dlatego", "natomiast", "tego", "tej", "kiedy", "wszystkie"},
    "cs": {"na", "je", "se", "to", "že", "do", "jak", "jsou", "nebo", "při", "od", "po",
           "než", "velmi", "více", "také"},
    "ar": {"و", "في", "لا", "من", "على", "عن", "هذا", "مع", "أن", "إلى", "كل", "ما", "أو", "ثم", "هي"},
    "nl": {"de", "het", "een", "van", "en", "in", "op", "voor", "met", "aan", "die", "dat", "is", "te", "zijn"},
    "sv": {"och", "i", "att", "det", "som", "på", "en", "för", "med", "till", "av", "är", "den", "de", "ett"},
    "no": {"og", "i", "det", "at", "som", "på", "en", "med", "til", "av", "er", "den", "for", "de", "et"},
    "el": {"και", "σε", "το", "η", "ο", "του", "για", "είναι", "με", "από", "να", "τα", "των", "που", "της"},
    "fi": {"ja", "on", "ei", "se", "että", "niin", "kuin", "ovat", "toi", "hän", "minä", "sinä", "tämä", "mitä"},
    "da": {"og", "i", "det", "at", "som", "på", "en", "for", "med", "til", "af", "er", "den", "de", "et"},
}

_LETTER_RE = re.compile(r"[a-zA-Zà-ÿÀ-Ý\u0400-\u04FF\u0600-\u06FF\u0370-\u03FF]")

# 非拉丁证据占比低于该阈值视为噪声（如英文正文里混入零星 CJK/希腊字母），
# 不予判定，交给拉丁停止词统计；真实串台页的错误语种占比远高于此
_MIN_NON_LATIN_CONF = 0.15


def _conf(n, total):
    return min(0.99, n / total * 1.3)


def _non_latin_detect(text):
    total = len(_LETTER_RE.findall(text)) or 1
    kana = len(_KANA.findall(text))
    for lang, pattern in NON_LATIN_BLOCKS:
        letters = len(pattern.findall(text))
        if letters >= 6 and _conf(letters, total) >= _MIN_NON_LATIN_CONF:
            # 汉字+假名 ⇒ 日语（中文不用假名；U+30FB「・」在假名区间而中文
            # 顿号 U+3001、间隔号 U+00B7 不在），纯汉字（无假名）才归 zh 兜底
            if lang == _CJK and kana:
                return _JAPANESE, round(_conf(letters + kana, total), 2)
            return lang, round(_conf(letters, total), 2)
    # 无汉字或汉字不足时，假名为主的日文串（如片假名标题）
    if kana and _conf(kana, total) >= _MIN_NON_LATIN_CONF:
        return _JAPANESE, round(_conf(kana, total), 2)
    return None, 0.0


def _latin_detect(text):
    words = re.findall(r"[A-Za-zÀ-ÿ]+", text.lower())
    # 忽略单字母 token（评分标签 A/B/C、列表字母等）——它们会以噪声形式
    # 计入 en/pt 等语言的单字母停止词（如 'a'），导致 fr/es 等文本被误判
    words = [w for w in words if len(w) > 1]
    if not words:
        return None, 0.0
    scores, distinct = {}, {}
    for lang, sw in STOPWORDS.items():
        hits = [w for w in words if w in sw]
        scores[lang] = len(hits)
        distinct[lang] = len(set(hits))
    # 独占字母按 2 倍加权计入得分（封顶 6）：波兰语短样本常被单字母词过滤
    # 摘空（w/z/i/o），只剩共享词 na/do/to，56 个 ł/ą/ę 才是决定性证据
    for lang, _ in _DIA_EVIDENCE:
        n = _dia_count(lang, text)
        if n:
            scores[lang] += min(6, 2 * n)
    # 证据门槛：≥3 个「不同」停止词，或 ≥3 个独占字母。重复命中同一停止词
    # 的噪声（品牌名 "Pro"、共享短词 na/do/en、单字母过滤后挨饿的样本）
    # 不足以支撑判定；门槛不达标的一律不判，宁缺毋滥
    qualified = [lang for lang in scores if distinct[lang] >= 3 or _dia_count(lang, text) >= 3]
    if not qualified:
        return None, 0.0
    best = max(scores[l] for l in qualified)
    top = [l for l in qualified if scores[l] == best]
    if len(top) > 1:
        # 平局（多语言得分相同，如 pl/cs 共享 na/do/to/jak/od/po）时用
        # 专属字母裁决：ł/ą/ż 只在波兰语，ě/ů/ř 只在捷克语；仍平局
        # （如 no/da 的 å/ø/æ 对双方相同）说明证据不足，判 None 不取偏
        dia = {l: _dia_count(l, text) for l in top}
        m = max(dia.values())
        winners = [l for l in top if dia[l] == m] if m > 0 else top
        if len(winners) != 1:
            return None, 0.0
        return winners[0], round(min(0.99, best / 25.0 + 0.3), 2)
    return top[0], round(min(0.99, best / 25.0 + 0.3), 2)


def detect(text):
    text = (text or "")[:4000]
    if not text.strip():
        return None, 0.0
    lang, conf = _non_latin_detect(text)
    if lang:
        return lang, conf
    return _latin_detect(text)


def has_kana(text):
    """True if the sample contains any kana (hiragana/katakana) character."""
    return bool(_KANA.search(text or ""))


def is_mismatch(expected, text, min_conf=0.0):
    """Return (mismatch, detected_lang, confidence).

    Returns mismatch=False when the sample is too short or detection is
    unreliable (confidence below min_conf) to avoid false positives.
    """
    expected = (expected or "").lower()
    det, conf = detect(text)
    if not det:
        return False, None, 0.0
    mism = det != expected
    if conf < min_conf:
        mism = False
    return mism, det, conf