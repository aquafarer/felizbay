// Copy EN page yamls into a language dir (gate files / pre-translation seeds).
// Usage: node tools/page-seed.mjs <lang> <page> [<page>...]
// Source: src/data/pages/<page>.yaml -> src/data/pages/<lang>/<page>.yaml
// EN copies are intentional for about/contact/news (EN-fallback gate files);
// for home.yaml the copy is the pre-translation starting point for i18n-audit.
// Skip-if-exists (never clobbers manual work). UTF-8 safe via Node fs.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PAGES = path.join(ROOT, 'src/data/pages');

const lang = process.argv[2];
const pages = process.argv.slice(3).filter((a) => !a.startsWith('--'));
if (!lang || lang.startsWith('--') || pages.length === 0) {
  console.error('Usage: node tools/page-seed.mjs <lang> <page> [<page>...]');
  process.exit(1);
}

const langDir = path.join(PAGES, lang);
fs.mkdirSync(langDir, { recursive: true });

let created = 0;
let skipped = 0;
for (const page of pages) {
  const src = path.join(PAGES, `${page}.yaml`);
  const dest = path.join(langDir, `${page}.yaml`);
  if (!fs.existsSync(src)) {
    console.error(`  !! EN source missing: src/data/pages/${page}.yaml`);
    process.exit(1);
  }
  if (fs.existsSync(dest)) {
    console.log(`  ${lang}/${page}.yaml: exists — skipped`);
    skipped++;
    continue;
  }
  fs.writeFileSync(dest, fs.readFileSync(src, 'utf8'), 'utf8');
  console.log(`  ${lang}/${page}.yaml: seeded (EN copy)`);
  created++;
}
console.log(`page-seed ${lang}: ${created} created, ${skipped} skipped (pages: ${pages.join(', ')})`);
