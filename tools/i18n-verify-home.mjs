// dist verification of non-EN homepages: dictionary strings must render + EN leak strings must not.
// Usage (after npm run build): node tools/i18n-verify-home.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dict = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/site/i18n-config.json'), 'utf8'));
const decode = (s) =>
  String(s)
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'");
const langs = ['fr', 'de', 'es', 'pt', 'ar', 'it', 'ru', 'pl', 'nl', 'sv', 'no', 'el', 'fi', 'da', 'cs'];
// EN strings that must NOT leak into non-EN homepages
const enLeaks = [
  'CE certified product models',
  'Beginner Water Sports',
  'Marine-Grade PVC Layer',
  'Standard Tested',
  'Professional Operations',
];
let fail = 0;
for (const lang of langs) {
  const html = fs.readFileSync(path.join(ROOT, 'dist', lang, 'index.html'), 'utf8');
  const dec = decode(html);
  const checks = {
    'badge.iso': dict[lang]['home.badges.iso'],
    'badge.ce': dict[lang]['home.badges.ce'],
    'research.cat': dict[lang]['home.research.cat.technology'],
    'research.desc': dict[lang]['home.research.dropStitch.desc'],
    'social.tagline': dict[lang]['home.social.tagline'],
    'whoWeHelp.tagline': dict[lang]['home.whoWeHelp.tagline'],
    'ai.overview.p2': dict[lang]['ai.overview.p2'],
    'env.lake': dict[lang]['home.env.lake'],
    'skill.beginner': dict[lang]['home.skill.beginner'],
  };
  const missing = [];
  for (const [k, v] of Object.entries(checks)) {
    if (!v || !dec.includes(v)) missing.push(k);
  }
  // product names from product-texts
  const src = fs.readFileSync(path.join(ROOT, 'src/data/product-texts.ts'), 'utf8');
  const startM = src.match(new RegExp(`^  ${lang}: \\{`, 'm'));
  const after = src.slice(startM.index + 3);
  const nextM = after.match(/^ {2}\w+: \{/m);
  const block = src.slice(startM.index, startM.index + 3 + nextM.index);
  for (const pid of ['sib-aluminum-floor', 'high-speed-catamaran']) {
    const m = block.match(new RegExp(`['"]?${pid}['"]?: \\{[\\s\\S]*?name: '([\\s\\S]*?)',`));
    if (!m) {
      missing.push(`product:${pid}(no-l10n)`);
      continue;
    }
    if (!dec.includes(decode(m[1]))) missing.push(`product:${pid}`);
  }
  const leaks = enLeaks.filter((s) => dec.includes(s));
  const status = missing.length === 0 && leaks.length === 0 ? 'OK' : 'FAIL';
  if (status === 'FAIL') fail++;
  console.log(
    `${lang}: ${status}${missing.length ? ' missing=' + missing.join('|') : ''}${leaks.length ? ' EN-leaks=' + leaks.join('|') : ''}`
  );
}
console.log(fail === 0 ? 'ALL HOME PAGES OK' : `${fail} LANGS FAILED`);
