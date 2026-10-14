/**
 * src/utils/seo-suppress.ts
 *
 * 单一判定入口：这个页面该不该被索引 / 该不该进 sitemap。
 * 布局层（BaseHead.astro）和 sitemap 生成器共用同一份逻辑，避免两边判断不一致
 * —— 线上目前就有「noindex 却在 sitemap 里」和「canonical 指向他页却在 sitemap 里」两类矛盾。
 *
 * 数据源：src/config/seo-suppress.json（由 scripts/03_apply_noindex.py 生成）
 */

import suppress from '../config/seo-suppress.json';

export const MIN_WORDS_TO_INDEX = suppress.minWordsToIndex ?? 400;

/** 有真实搜索需求的对比组合白名单，其余程序化组合一律 noindex（P0-1） */
export const COMPARE_ALLOWLIST = new Set<string>(suppress.compareAllowlist);

const SUPPRESS_PATHS = new Set<string>(suppress.paths.map(normalizePath));
const SUPPRESS_REGEX = suppress.regex.map((r: string) => new RegExp(r));
const COMPARE_REGEX = new RegExp(suppress.compareRegex);

export function normalizePath(p: string): string {
  if (!p) return '/';
  const clean = p.split('?')[0].split('#')[0];
  const trimmed = '/' + clean.replace(/^\/+|\/+$/g, '');
  return trimmed === '/' ? '/' : trimmed + '/';
}

/** 粗略词数统计：用于运行期兜底，防止新生成的空壳页漏网 */
export function countWords(html: string): number {
  const text = html
    .replace(/<(script|style|nav|header|footer|svg)\b[^>]*>[\s\S]*?<\/\1>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&[a-z#0-9]+;/gi, ' ');
  return text.split(/\s+/).filter(Boolean).length;
}

export interface IndexDecision {
  noindex: boolean;
  inSitemap: boolean;
  reason: string;
}

/**
 * 唯一判定函数。
 * @param path      页面路径（可带或不带尾斜杠）
 * @param opts.wordCount   正文词数（能拿到就传，作为兜底）
 * @param opts.canonical   页面的 canonical 路径（若指向他页则不进 sitemap）
 * @param opts.explicitNoindex  frontmatter 里显式声明的 noindex
 */
export function decideIndexing(
  path: string,
  opts: { wordCount?: number; canonical?: string; explicitNoindex?: boolean } = {}
): IndexDecision {
  const p = normalizePath(path);

  if (opts.explicitNoindex) {
    return { noindex: true, inSitemap: false, reason: 'frontmatter 显式 noindex' };
  }

  // 内部页 / 登录页 / CMS（P0-6）
  for (const re of SUPPRESS_REGEX) {
    if (re.test(p)) {
      return { noindex: true, inSitemap: false, reason: `内部路径匹配 ${re}` };
    }
  }

  // 程序化对比页白名单（P0-1）
  const m = COMPARE_REGEX.exec(p);
  if (m && !COMPARE_ALLOWLIST.has(m[1])) {
    return {
      noindex: true,
      inSitemap: false,
      reason: `对比组合 "${m[1]}" 不在白名单内（无搜索需求且无正文）`,
    };
  }

  // 审计脚本产出的具体路径清单
  if (SUPPRESS_PATHS.has(p)) {
    return { noindex: true, inSitemap: false, reason: '在 seo-suppress.json 清单中' };
  }

  // 词数兜底：新生成的空壳页也会被拦住
  if (typeof opts.wordCount === 'number' && opts.wordCount < MIN_WORDS_TO_INDEX) {
    return {
      noindex: true,
      inSitemap: false,
      reason: `正文仅 ${opts.wordCount} 词 < ${MIN_WORDS_TO_INDEX}`,
    };
  }

  // canonical 指向他页 → 可索引但不进 sitemap
  if (opts.canonical) {
    const cp = normalizePath(opts.canonical.replace(/^https?:\/\/[^/]+/, ''));
    if (cp !== p) {
      return { noindex: false, inSitemap: false, reason: `canonical 指向 ${cp}` };
    }
  }

  return { noindex: false, inSitemap: true, reason: 'ok' };
}
