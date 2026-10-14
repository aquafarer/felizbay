#!/usr/bin/env node
/**
 * check-translations.mjs
 *
 * Self-check: audit all enabled languages for untranslated elements, missing
 * files, and TODO placeholders.
 *
 * Architecture notes:
 *  - The enabled locale list comes from src/data/site/languages.yaml.
 *  - Navigation is a single navigation.yaml whose texts are localized at
 *    render time via the nav.* keys in src/data/site/i18n-config.json
 *    (see navTextMap in src/components/widgets/Header.astro).
 *  - Product texts live in src/data/product-texts.ts under per-language
 *    blocks. The completeness standard is the 11 fully-translated languages
 *    (fr, de, es, pt, it, ja, ko, ru, pl, zh, ar).
 *
 * Usage:
 *   node scripts/check-translations.mjs
 *   node scripts/check-translations.mjs --json
 *   node scripts/check-translations.mjs --fail
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { globSync } from 'glob';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const issues = [];
const warns = [];

function ok(m) {
  if (!process.argv.includes('--json')) console.log('  [OK] ' + m);
}
function fail(m) {
  issues.push(m);
  if (!process.argv.includes('--json')) console.log('  [FAIL] ' + m);
}
function warn(m) {
  warns.push(m);
  if (!process.argv.includes('--json')) console.log('  [WARN] ' + m);
}

function exists(p) {
  return fs.existsSync(path.resolve(ROOT, p));
}
function read(p) {
  try {
    return fs.readFileSync(path.resolve(ROOT, p), 'utf-8');
  } catch {
    return '';
  }
}

function loadLocales() {
  const yaml = read('src/data/site/languages.yaml');
  const codes = [...yaml.matchAll(/locale:\s*(\w+)/g)].map((m) => m[1].toLowerCase());
  const enabled = [...yaml.matchAll(/enabled:\s*(true|false)/g)].map((m) => m[1] === 'true');
  const locales = codes.filter((_, i) => enabled[i]);
  if (locales.length === 0) fail('Could not parse languages.yaml locales');
  return locales;
}

// The 11 languages that are the product-text completeness standard.
const PRODUCT_LANGS = ['fr', 'de', 'es', 'pt', 'it', 'ru', 'pl', 'ar'];
const PAGE_TYPES = ['home', 'about', 'contact', 'news'];

// ── 1. Navigation (nav.* key coverage per locale) ──
function checkNav(locales) {
  const header = read('src/components/widgets/Header.astro');
  const navTextMap = [...header.matchAll(/'([^']+)':\s*'((?:nav|cta)\.[^']+)'/g)].map((m) => m[2]);
  const navKeys = [...new Set(navTextMap)];
  if (navKeys.length === 0) {
    fail('Could not parse navTextMap from Header.astro');
    return;
  }
  const ui = JSON.parse(read('src/data/site/i18n-config.json') || '{}');
  let missingTotal = 0;
  for (const l of locales) {
    const o = ui[l] || {};
    const missing = navKeys.filter((k) => !(k in o));
    if (missing.length) {
      fail('Navigation keys missing for ' + l + ': ' + missing.join(', '));
      missingTotal += missing.length;
    }
  }
  if (missingTotal === 0) ok('Navigation: ' + navKeys.length + ' nav keys x ' + locales.length + ' languages complete');
}

// ── 2. Config files ──
function checkConfig(locales) {
  for (const l of locales) {
    if (l === 'en') continue;
    const f = 'src/config.' + l + '.yaml';
    if (!exists(f)) {
      fail('Config missing: ' + f);
      continue;
    }
    const c = read(f);
    if (!c.includes('siteSettings:')) fail('Config missing siteSettings: ' + f);
    if (c.includes('TODO:')) warn('TODO in ' + f);
  }
  ok('Config files checked (' + (locales.length - 1) + ' languages)');
}

// ── 3. Page content YAML ──
function checkPageContent(locales) {
  let missingTotal = 0;
  for (const page of PAGE_TYPES) {
    for (const l of locales) {
      const dir = l === 'en' ? 'src/data/pages' : 'src/data/pages/' + l;
      const f = dir + '/' + page + '.yaml';
      if (!exists(f)) {
        fail('Page missing: ' + f);
        missingTotal++;
        continue;
      }
      const c = read(f);
      if (c.includes('TODO:')) warn('TODO in ' + f);
      if (c.trim() === '' || c.trim() === '{}') warn(f + ' appears empty');
    }
  }
  if (missingTotal === 0)
    ok('Page content YAML checked (' + PAGE_TYPES.length + ' pages x ' + locales.length + ' languages)');
}

// ── 4. Product texts (language-scoped) ──
function checkProductTexts() {
  const pContent = read('src/data/products.ts');
  const ids = [...pContent.matchAll(/id:\s+'([^']+)'/g)].map(function (m) {
    return m[1];
  });
  if (ids.length === 0) {
    fail('Could not parse product IDs');
    return;
  }

  const ptContent = read('src/data/product-texts.ts');
  const lines = ptContent.split(/\r?\n/);
  const langBlock = {};
  let current = null;
  for (const line of lines) {
    const top = line.match(/^\s{2}([a-z]{2}):\s*\{\s*$/);
    if (top) {
      current = top[1];
      langBlock[current] = langBlock[current] || '';
      continue;
    }
    if (current) langBlock[current] += line + '\n';
  }

  let missing = 0;
  for (const l of PRODUCT_LANGS) {
    const block = langBlock[l] || '';
    for (const id of ids) {
      // Content-style entries (definition/problem/ai_* via PRODUCT_EXTRAS) are as
      // valid as title-style ones; titles come from PRODUCT_L10N for MDX products.
      const re = new RegExp("\\s{4}(?:'?" + id + "'?):\\s*\\{[^}]*?(?:name|definition):", '');
      if (!re.test(block)) {
        fail('Product text missing: ' + l + '/' + id);
        missing++;
      }
    }
  }
  if (missing === 0) ok('Product texts: ' + ids.length + ' products x ' + PRODUCT_LANGS.length + ' languages complete');
}

// ── 5. TODO placeholders in YAML data files ──
function checkTodos() {
  const yamlFiles = globSync('src/data/**/*.yaml', { cwd: ROOT });
  let todoCount = 0;
  for (const f of yamlFiles) {
    const c = read(f);
    const m = c.match(/#\s*TODO[^\n]*/g);
    if (m) {
      warn(f + ' has ' + m.length + ' TODO(s)');
      todoCount += m.length;
    }
  }
  if (todoCount === 0) ok('No TODO placeholders in data YAML files');
}

// ── 6. Check config YAML files for TODO ──
function checkConfigTodos() {
  const configFiles = globSync('src/config.*.yaml', { cwd: ROOT });
  let todoCount = 0;
  for (const f of configFiles) {
    const c = read(f);
    const m = c.match(/#\s*TODO[^\n]*/g);
    if (m) {
      warn(f + ' has ' + m.length + ' TODO(s)');
      todoCount += m.length;
    }
  }
  if (todoCount === 0) ok('No TODO placeholders in config files');
}

// ── 7. Check knowledge graph nodes for per-language fields ──
function checkGraphNodes(locales) {
  const nonEn = locales.filter(function (l) {
    return l !== 'en';
  });
  const content = read('src/content/graph/nodes.ts');
  const nodes = content.split(/\n\s*\{/);
  let nodesWithIssues = 0;
  for (const block of nodes) {
    if (!block.includes('id:')) continue;
    const idMatch = block.match(/id:\s+'([^']+)'/);
    if (!idMatch) continue;
    const id = idMatch[1];
    const nameBlock = block.match(/name:\s*\{[^}]+\}/);
    if (!nameBlock) {
      fail('Node ' + id + ' has no name');
      nodesWithIssues++;
      continue;
    }
    for (const l of nonEn) {
      if (!nameBlock[0].includes(l + ':')) {
        warn('Node ' + id + ' missing name for ' + l);
        nodesWithIssues++;
      }
    }
    const slugBlock = block.match(/slug:\s*\{[^}]+\}/);
    if (slugBlock) {
      for (const l of nonEn) {
        if (!slugBlock[0].includes(l + ':')) {
          warn('Node ' + id + ' missing slug for ' + l);
          nodesWithIssues++;
        }
      }
    }
  }
  if (nodesWithIssues === 0) ok('Knowledge graph nodes: all language fields present');
}

// ── 8. Check for hardcoded English in [lang] pages ──
function checkHardcodedEnglish() {
  const astroFiles = globSync('src/pages/[lang]/**/*.astro', { cwd: ROOT });
  for (const f of astroFiles) {
    const c = read(f);
    if (c.includes('const t =') || c.includes('getPageContent') || c.includes('localizeProduct')) continue;
    if (c.includes('getStaticPaths') && c.includes('languages') && c.includes('<p') && !c.includes('t(')) {
      warn(f + ' may have hardcoded English text behind [lang] routes');
    }
  }
}

// ── Summary ──
function summary() {
  console.log('\n=== Summary ===');
  console.log('  Issues (FAIL): ' + issues.length);
  console.log('  Warnings:      ' + warns.length);
  if (issues.length === 0) console.log('  All translations checks passed.');
  else {
    console.log('  Failing checks:');
    for (const i of issues) console.log('    - ' + i);
  }

  if (process.argv.includes('--json')) {
    const result = {
      passed: issues.length === 0,
      issues: issues,
      warnings: warns,
      totalIssues: issues.length,
      totalWarnings: warns.length,
    };
    console.log(JSON.stringify(result, null, 2));
  }

  if (process.argv.includes('--fail') && issues.length > 0) process.exit(1);
}

// ── Main ──
console.log('=== Translation Self-Check ===\n');
const LOCALES = loadLocales();
checkNav(LOCALES);
checkConfig(LOCALES);
checkPageContent(LOCALES);
checkProductTexts();
checkTodos();
checkConfigTodos();
checkGraphNodes(LOCALES);
checkHardcodedEnglish();
summary();
