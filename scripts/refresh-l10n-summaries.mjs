import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Refresh PRODUCT_L10N summaries that were injected from English-fallback descs.
// A summary is refreshed only when its current value is identical to the English
// source desc (i.e. it was injected before the desc was translated) and the
// productTexts desc for that language is now actually translated.
// Idempotent: re-runs match nothing once summaries are up to date.

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const PRODUCTS_PATH = path.join(ROOT, 'src/data/products.ts');
const TEXTS_PATH = path.join(ROOT, 'src/data/product-texts.ts');
const L10N_PATH = path.join(ROOT, 'src/lib/product-l10n.ts');

const RIB_SLUGS = [
  'ap330',
  'ap360',
  'ap390',
  'ap420',
  'ap460',
  'ap520',
  'ap560',
  'ap660',
  'ap700',
  'ap760',
  'ap800',
  'ap900',
  'df420',
  'df460',
  'df500',
  'df540',
  'df540-coaster',
  'df600',
  'df700',
  'df760',
  'df860',
  'ex7',
  'ex9',
  'sw240',
  'sw260',
  'sw290',
  'sw310',
  'sw340',
  'vr260',
  'vr290',
  'vr310',
  'vr340',
  'vr360',
  'vr380',
  'vr400',
  'vr420',
  'vr460',
  'airdeck-360',
  'sup-cheetah-surge',
  'sup-dolphin-wave',
  'sup-explorer-11',
  'sup-flowing-lotus',
  'sup-jungle-mandala',
  'sup-leviathan-wake',
  'sup-medusa-glow',
  'sup-ocean-pulse',
  'sup-ocean-voyager',
  'sup-tropical-breeze',
  'zb-mt350',
];

const LANGS = ['ja', 'da', 'fi', 'el', 'no', 'sv', 'nl', 'pl', 'ru', 'it', 'ar', 'pt', 'es', 'fr', 'de', 'cs'];

function findLangBlockEnd(content, lang) {
  const marker = '\n  ' + lang + ': {';
  const start = content.indexOf(marker);
  if (start === -1) return { start: -1, end: -1 };
  let d = 0;
  let began = false;
  for (let i = start + marker.length - 1; i < content.length; i++) {
    if (content[i] === '{') {
      d++;
      began = true;
    } else if (content[i] === '}') {
      d--;
    }
    if (began && d === 0) return { start, end: i };
  }
  return { start: -1, end: -1 };
}

function extractProductField(content, slug, field, langBlockStart, langBlockEnd) {
  const marker = "'" + slug + "': {";
  let searchFrom = langBlockStart;
  while (searchFrom < langBlockEnd) {
    const idx = content.indexOf(marker, searchFrom);
    if (idx === -1 || idx > langBlockEnd) return undefined;
    let d = 0;
    let objStart = -1;
    let objEnd = -1;
    for (let i = idx; i < content.length && i <= langBlockEnd; i++) {
      if (content[i] === '{') {
        if (objStart === -1) objStart = i;
        d++;
      } else if (content[i] === '}') {
        d--;
        if (d === 0) {
          objEnd = i;
          break;
        }
      }
    }
    if (objStart === -1 || objEnd === -1) {
      searchFrom = idx + 1;
      continue;
    }
    const objStr = content.substring(objStart, objEnd + 1);
    const fieldPattern = new RegExp(field + ":\\s*'((?:[^'\\\\]|\\\\.)*)'", 's');
    const m = objStr.match(fieldPattern);
    if (m) return m[1].replace(/\\'/g, "'");
    searchFrom = objEnd + 1;
  }
  return undefined;
}

function findSectionEnd(content, lang, section) {
  const langInfo = findLangBlockEnd(content, lang);
  if (langInfo.start === -1) return -1;
  const sectionMarker = section + ': {';
  const sectionStart = content.indexOf(sectionMarker, langInfo.start);
  if (sectionStart === -1 || sectionStart > langInfo.end) return -1;
  let d = 0;
  let began = false;
  for (let i = sectionStart + sectionMarker.length - 1; i <= langInfo.end; i++) {
    if (content[i] === '{') {
      d++;
      began = true;
    } else if (content[i] === '}') {
      d--;
    }
    if (began && d === 0) return i;
  }
  return -1;
}

function content2SectionStart(content, lang, section) {
  const langInfo = findLangBlockEnd(content, lang);
  if (langInfo.start === -1) return -1;
  const sectionMarker = section + ': {';
  const sectionStart = content.indexOf(sectionMarker, langInfo.start);
  if (sectionStart === -1 || sectionStart > langInfo.end) return -1;
  return sectionStart;
}

// English descs from products.ts (id-anchored object extraction)
function extractEnglishDescs(tsContent) {
  const descs = {};
  for (const slug of RIB_SLUGS) {
    const idPattern = new RegExp(`id:\\s*'${slug.replace('-', '\\-')}'`);
    const match = tsContent.match(idPattern);
    if (!match) continue;
    let braceCount = 0;
    let objStart = -1;
    let objEnd = -1;
    for (let i = match.index; i >= 0; i--) {
      if (tsContent[i] === '{') {
        objStart = i;
        break;
      }
    }
    if (objStart === -1) continue;
    for (let i = objStart; i < tsContent.length; i++) {
      if (tsContent[i] === '{') braceCount++;
      else if (tsContent[i] === '}') {
        braceCount--;
        if (braceCount === 0) {
          objEnd = i + 1;
          break;
        }
      }
    }
    if (objEnd === -1) continue;
    const objStr = tsContent.slice(objStart, objEnd);
    const m = objStr.match(/desc:\s*'((?:[^'\\]|\\.)*)'/s);
    if (m) descs[slug] = m[1].replace(/\\'/g, "'");
  }
  return descs;
}

function escapeSingleQuote(str) {
  return str.replace(/'/g, "\\'");
}

function main() {
  const productsContent = fs.readFileSync(PRODUCTS_PATH, 'utf8');
  const textsContent = fs.readFileSync(TEXTS_PATH, 'utf8');
  let l10nContent = fs.readFileSync(L10N_PATH, 'utf8');

  const englishDescs = extractEnglishDescs(productsContent);
  console.log(`English descs loaded: ${Object.keys(englishDescs).length}`);

  let totalRefreshed = 0;

  for (const lang of LANGS) {
    const textsLang = findLangBlockEnd(textsContent, lang);
    if (textsLang.start === -1) continue;

    const summariesStart = content2SectionStart(l10nContent, lang, 'summaries');
    const summariesEnd = findSectionEnd(l10nContent, lang, 'summaries');
    if (summariesStart === -1 || summariesEnd === -1) continue;

    let section = l10nContent.slice(summariesStart, summariesEnd);
    let refreshed = 0;

    for (const slug of RIB_SLUGS) {
      const englishDesc = englishDescs[slug];
      if (!englishDesc) continue;
      const keyRe = new RegExp(`('${slug}'|${slug}):\\s*'((?:[^'\\\\]|\\\\.)*)'`);
      const km = section.match(keyRe);
      if (!km) continue;
      const current = km[2].replace(/\\'/g, "'");
      if (current !== englishDesc) continue; // already localized (or different source)
      const translated = extractProductField(textsContent, slug, 'desc', textsLang.start, textsLang.end);
      if (!translated || translated === englishDesc) continue; // still untranslated
      const replacement = `${slug}: '${escapeSingleQuote(translated)}'`;
      section = section.replace(keyRe, (full) => full.replace(km[0], replacement));
      refreshed++;
    }

    if (refreshed > 0) {
      l10nContent = l10nContent.slice(0, summariesStart) + section + l10nContent.slice(summariesEnd);
      console.log(`  ${lang}: refreshed ${refreshed} summary(ies)`);
      totalRefreshed += refreshed;
    }
  }

  if (totalRefreshed > 0) {
    fs.writeFileSync(L10N_PATH, l10nContent, 'utf8');
  }
  console.log(`\nDone! Refreshed ${totalRefreshed} summaries in product-l10n.ts`);
}

main();
