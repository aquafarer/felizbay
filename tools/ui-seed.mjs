// Seed a new language's nav/cta UI keys into src/data/site/i18n-config.json.
// Usage: node tools/ui-seed.mjs <lang>
// Table: tools/l10n/ui.<lang>.json (flat key -> translated string).
// Required keys = unique navTextMap keys parsed from Header.astro (same regex
// as check-translations.mjs checkNav) + header.language + search.* extras.
// Safety: aborts unless the table covers 100% of required keys, every table
// key exists in the EN dict (typo guard), and values are non-empty strings.
// Verifies by reparse + deep-check after writing. Regen chain (generate-data-json
// -> _gen-uiall -> _gen-pages) propagates to public/ + src/i18n/generated/.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DICT = path.join(ROOT, 'src/data/site/i18n-config.json');
const L10N = path.join(ROOT, 'tools', 'l10n');
const HEADER = path.join(ROOT, 'src/components/widgets/Header.astro');

const lang = process.argv[2];
if (!lang || lang.startsWith('--')) {
  console.error('Usage: node tools/ui-seed.mjs <lang>');
  process.exit(1);
}

const header = fs.readFileSync(HEADER, 'utf8');
const navTextMap = [...header.matchAll(/'([^']+)':\s*'((?:nav|cta)\.[^']+)'/g)].map((m) => m[2]);
const navKeys = [...new Set(navTextMap)];
if (navKeys.length === 0) {
  console.error('Could not parse navTextMap from Header.astro');
  process.exit(1);
}
const EXTRA_KEYS = ['header.language', 'search.placeholder', 'search.prompt', 'search.noResults'];
const required = [...new Set([...navKeys, ...EXTRA_KEYS])];

const tFile = path.join(L10N, `ui.${lang}.json`);
if (!fs.existsSync(tFile)) {
  console.error(`Table not found: tools/l10n/ui.${lang}.json`);
  process.exit(1);
}
const table = JSON.parse(fs.readFileSync(tFile, 'utf8'));

const badType = Object.entries(table).filter(([, v]) => typeof v !== 'string' || !v.trim());
if (badType.length) {
  console.error(`Table has non-string/empty values: ${badType.map(([k]) => k).join(', ')}`);
  process.exit(1);
}

const ui = JSON.parse(fs.readFileSync(DICT, 'utf8'));
const enKeys = new Set(Object.keys(ui.en || {}));
if (enKeys.size === 0) {
  console.error('EN dict missing in i18n-config.json');
  process.exit(1);
}

const unknown = Object.keys(table).filter((k) => !enKeys.has(k));
if (unknown.length) {
  console.error(`Table keys not in EN dict (typos?): ${unknown.join(', ')}`);
  process.exit(1);
}

const missing = required.filter((k) => !(k in table));
if (missing.length) {
  console.error(`Table missing required keys (${missing.length}/${required.length}): ${missing.join(', ')}`);
  process.exit(1);
}

const existed = Boolean(ui[lang]);
ui[lang] = { ...(ui[lang] || {}), ...table };

fs.writeFileSync(DICT, JSON.stringify(ui, null, 2) + '\n', 'utf8');

// verify: reparse + every table key landed
const check = JSON.parse(fs.readFileSync(DICT, 'utf8'));
let bad = 0;
for (const [k, v] of Object.entries(table)) {
  if (check[lang][k] !== v) {
    console.error(`  !! verify fail: ${lang} ${k}`);
    bad++;
  }
}
if (bad) {
  console.error(`${lang}: ${bad} verify failures — RESTORE the dict from git and retry`);
  process.exit(1);
}

const covered = required.filter((k) => check[lang][k]).length;
console.log(
  `ui-seed ${lang}: ${existed ? 'updated existing section' : 'created section'} — ${Object.keys(table).length} keys merged, required coverage ${covered}/${required.length}`
);
