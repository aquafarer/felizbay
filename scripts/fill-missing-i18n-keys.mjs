#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const CONFIG_PATH = path.join(ROOT, 'src/data/site/i18n-config.json');

function main() {
  const config = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));
  const enKeys = Object.keys(config.en);
  const langs = Object.keys(config).filter((l) => l !== 'en');

  let added = 0;
  let already = 0;

  for (const lang of langs) {
    if (!config[lang]) config[lang] = {};
    for (const key of enKeys) {
      if (!(key in config[lang])) {
        config[lang][key] = config.en[key];
        added++;
      } else {
        already++;
      }
    }
  }

  fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2), 'utf8');
  console.log(`Added ${added} missing keys (copied from EN)`);
  console.log(`Already present: ${already}`);
  console.log(`Total EN keys: ${enKeys.length}`);
  console.log(`Languages: ${langs.length}`);
}

main();
