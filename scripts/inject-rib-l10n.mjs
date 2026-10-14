import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

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

function escapeSingleQuote(str) {
  return str.replace(/'/g, "\\'");
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

function main() {
  const textsContent = fs.readFileSync(TEXTS_PATH, 'utf8');
  let l10nContent = fs.readFileSync(L10N_PATH, 'utf8');

  let totalTitles = 0;
  let totalSummaries = 0;

  for (const lang of LANGS) {
    console.log(`Processing ${lang}...`);

    const langInfo = findLangBlockEnd(textsContent, lang);
    if (langInfo.start === -1) {
      console.log(`  No ${lang} block in product-texts.ts, skipping`);
      continue;
    }

    const titlesToAdd = [];
    const summariesToAdd = [];

    // Skip slugs that already exist in this language's sections (idempotent
    // re-runs must not duplicate entries from earlier injections).
    const titlesStart = content2SectionStart(l10nContent, lang, 'titles');
    const summariesStart = content2SectionStart(l10nContent, lang, 'summaries');
    const titlesExisting =
      titlesStart !== -1 ? l10nContent.slice(titlesStart, findSectionEnd(l10nContent, lang, 'titles')) : '';
    const summariesExisting =
      summariesStart !== -1 ? l10nContent.slice(summariesStart, findSectionEnd(l10nContent, lang, 'summaries')) : '';

    for (const slug of RIB_SLUGS) {
      const name = extractProductField(textsContent, slug, 'name', langInfo.start, langInfo.end);
      const desc = extractProductField(textsContent, slug, 'desc', langInfo.start, langInfo.end);

      const keyRe = new RegExp(`('${slug}'|${slug}):`);
      if (name && !keyRe.test(titlesExisting)) {
        titlesToAdd.push(`      '${slug}': '${escapeSingleQuote(name)}',`);
      }
      if (desc && !keyRe.test(summariesExisting)) {
        summariesToAdd.push(`      '${slug}': '${escapeSingleQuote(desc)}',`);
      }
    }

    if (titlesToAdd.length === 0 && summariesToAdd.length === 0) {
      console.log(`  No data for ${lang}, skipping`);
      continue;
    }

    const titlesEnd = findSectionEnd(l10nContent, lang, 'titles');
    if (titlesEnd === -1) {
      console.log(`  Could not find titles section for ${lang}, skipping`);
      continue;
    }

    const titleInsert = '\n' + titlesToAdd.join('\n');
    l10nContent = l10nContent.slice(0, titlesEnd) + titleInsert + l10nContent.slice(titlesEnd);

    const summariesEnd = findSectionEnd(l10nContent, lang, 'summaries');
    if (summariesEnd === -1) {
      console.log(`  Could not find summaries section for ${lang}, skipping`);
      continue;
    }

    const summaryInsert = '\n' + summariesToAdd.join('\n');
    l10nContent = l10nContent.slice(0, summariesEnd) + summaryInsert + l10nContent.slice(summariesEnd);

    console.log(`  Added ${titlesToAdd.length} titles, ${summariesToAdd.length} summaries for ${lang}`);
    totalTitles += titlesToAdd.length;
    totalSummaries += summariesToAdd.length;
  }

  fs.writeFileSync(L10N_PATH, l10nContent, 'utf8');
  console.log(`\nDone! Total: ${totalTitles} titles, ${totalSummaries} summaries added to product-l10n.ts`);
}

main();
