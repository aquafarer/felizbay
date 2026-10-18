#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const PAGES = [
  'authority',
  'business-packages',
  'ce-compliance',
  'dealers-distributors',
  'engineering-capability',
  'engineering-whitepaper',
  'factory-audit',
  'guides',
  'industries-distributors',
  'industries-schools',
  'oem-odm-rib-boats',
  'solutions-aquaculture',
  'solutions-clubs',
  'solutions-entrepreneurs',
  'solutions-marine-research',
  'solutions-matrix',
  'solutions-offshore-energy',
  'solutions-rental-business',
  'solutions-resorts',
  'solutions-watersports',
  'success-stories',
  'technical-drawings',
  'testimonials',
];

const LANGS = ['ar', 'da', 'de', 'el', 'es', 'fi', 'fr', 'it', 'nl', 'no', 'pl', 'pt', 'ru', 'sv', 'zh'];

function main() {
  let created = 0;
  let skipped = 0;

  for (const page of PAGES) {
    const enPath = path.join(ROOT, 'src/data/pages', `${page}.yaml`);
    if (!fs.existsSync(enPath)) {
      console.log(`SKIP ${page}: EN source not found`);
      continue;
    }
    const enContent = fs.readFileSync(enPath, 'utf8');

    for (const lang of LANGS) {
      const outDir = path.join(ROOT, 'src/data/pages', lang);
      const outPath = path.join(outDir, `${page}.yaml`);
      if (fs.existsSync(outPath)) {
        skipped++;
        continue;
      }
      fs.mkdirSync(outDir, { recursive: true });
      fs.writeFileSync(outPath, enContent, 'utf8');
      created++;
    }
  }

  console.log(`Created: ${created}, Skipped (exists): ${skipped}`);
}

main();
