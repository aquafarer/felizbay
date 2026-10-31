import fs from 'node:fs';
import path from 'node:path';
import * as yaml from 'js-yaml';
import { products } from '../src/data/products';
import { productTexts } from '../src/data/product-texts';
import { guides } from '../src/data/guides';
import { POOL_IDEAS } from '../src/data/pool-ideas';

const ROOT = path.resolve(import.meta.dirname, '..');
const PUBLIC = path.join(ROOT, 'public');
const LLMS_FULL_TXT = path.join(PUBLIC, 'llms-full.txt');
const LLMS_TXT = path.join(PUBLIC, 'llms.txt');
const PAGES_DIR = path.join(ROOT, 'src', 'data', 'pages');
const WELL_KNOWN_DIR = path.join(PUBLIC, '.well-known');
const ENTITY_JSON = path.join(WELL_KNOWN_DIR, 'entity.json');

const SITE_URL = 'https://felizbay.com';

const LANGUAGES: Record<string, string> = {
  en: 'English',
  fr: 'Français',
  de: 'Deutsch',
  es: 'Español',
  pt: 'Português',
  ar: 'العربية',
  it: 'Italiano',
  ru: 'Русский',
  pl: 'Polski',
  nl: 'Nederlands',
  sv: 'Svenska',
  no: 'Norsk',
  el: 'Ελληνικά',
  fi: 'Suomi',
  da: 'Dansk',
  cs: 'Čeština',
  th: 'ไทย',
  hr: 'Hrvatski',
  tl: 'Filipino',
  hu: 'Magyar',
  ro: 'Română',
  sk: 'Slovenčina',
  bg: 'Български',
  sl: 'Slovenščina',
  sr: 'Srpski',
  tr: 'Türkçe',
  id: 'Bahasa Indonesia',
  he: 'עברית',
  ms: 'Bahasa Melayu',
  lt: 'Lietuvių',
  lv: 'Latviešu',
  et: 'Eesti',
  kk: 'Қазақша',
  uz: 'Oʻzbekcha',
  uk: 'Українська',
  az: 'Azərbaycanca',
  fa: 'فارسی',
};

const CATEGORY_LABELS: Record<string, string> = {
  POOL: 'Inflatable Swimming Pools',
};

// Only these localized pages are actually routed under /{lang}/ (see
// src/pages/[lang]/*.astro). YAML files like home.yaml / request-quotation.yaml
// describe the root homepage and the root quotation page — emitting them as
// /{lang}/home/ or /{lang}/request-quotation/ would create dead URLs.
const ROUTED_LANG_PAGES = ['about', 'contact'];

// Root (English) YAML-backed pages that exist as real routes.
const ROOT_PAGE_NAMES = ['about', 'contact', 'request-quotation'];

function readSource(file: string): string | null {
  try {
    return fs.readFileSync(path.join(ROOT, 'src', 'data', 'geo', file), 'utf8');
  } catch {
    return null;
  }
}

function extractPageTitle(content: string): string | null {
  const parsed = yaml.load(content) as Record<string, any>;
  if (!parsed || typeof parsed !== 'object') return null;
  for (const key of Object.keys(parsed)) {
    const val = parsed[key];
    if (val && typeof val === 'object' && val.title) {
      return String(val.title)
        .replace(/<[^>]+>/g, ' ')
        .replace(/<br\s*\/?>/gi, ' ')
        .replace(/\s+/g, ' ')
        .trim();
    }
  }
  return null;
}

function pageLine(url: string, title: string | null): string {
  return title ? `- ${url} — ${title}` : `- ${url}`;
}

function getPageUrls(): string[] {
  const urls: string[] = [];

  // Root (English) YAML-backed pages
  for (const name of ROOT_PAGE_NAMES) {
    const yamlPath = path.join(PAGES_DIR, `${name}.yaml`);
    if (!fs.existsSync(yamlPath)) continue;
    const title = extractPageTitle(fs.readFileSync(yamlPath, 'utf8'));
    urls.push(pageLine(`${SITE_URL}/${name}/`, title));
  }

  // EN-only utility and content pages (no per-locale YAML — routes are
  // src/pages/*.astro and src/pages/{guides,pool-ideas}/[slug].astro)
  urls.push(
    `${pageLine(`${SITE_URL}/find-your-pool/`, 'Interactive pool advisor: match a pool to your space, household, and use case')}`
  );
  urls.push(
    `${pageLine(`${SITE_URL}/support/`, 'After-sales support hub: shipping, warranty, care, and troubleshooting')}`
  );
  urls.push(`${pageLine(`${SITE_URL}/returns-and-warranty/`, 'Return policy and warranty coverage')}`);

  // Guides — generated from the guides SSOT so new guides appear automatically
  urls.push(pageLine(`${SITE_URL}/guides/`, 'All procurement and pool owner guides index'));
  for (const g of guides) {
    urls.push(pageLine(`${SITE_URL}/guides/${g.slug}/`, g.title));
  }

  // Pool ideas — generated from the pool-ideas SSOT
  urls.push(pageLine(`${SITE_URL}/pool-ideas/`, 'All pool ideas: browse scenarios by household, space, and use case'));
  for (const idea of POOL_IDEAS) {
    urls.push(pageLine(`${SITE_URL}/pool-ideas/${idea.slug}/`, idea.title));
  }

  // Localized routed pages — only page names that exist under /{lang}/
  const entries = fs.readdirSync(PAGES_DIR);
  const langs = entries
    .filter((entry) => {
      const entryPath = path.join(PAGES_DIR, entry);
      return fs.statSync(entryPath).isDirectory() && LANGUAGES[entry];
    })
    .sort((a, b) => a.localeCompare(b));

  for (const lang of langs) {
    for (const name of ROUTED_LANG_PAGES) {
      const yamlPath = path.join(PAGES_DIR, lang, `${name}.yaml`);
      if (!fs.existsSync(yamlPath)) continue;
      const title = extractPageTitle(fs.readFileSync(yamlPath, 'utf8'));
      urls.push(pageLine(`${SITE_URL}/${lang}/${name}/`, title));
    }
  }

  return urls;
}

function getProductLines(): string[] {
  const lines: string[] = [];

  const allLangs = Object.keys(LANGUAGES);
  // English first, then alphabetical
  const sortedLangs = ['en', ...allLangs.filter((l) => l !== 'en').sort()];

  for (const lang of sortedLangs) {
    const langName = LANGUAGES[lang];
    const prefix = lang === 'en' ? '' : ` (${lang})`;
    const heading = lang === 'en' ? 'English' : `${langName}${prefix}`;
    lines.push(`\n### ${heading}\n`);

    const categories = ['POOL'];
    for (const cat of categories) {
      const catProducts = products.filter((p) => p.category === cat);
      if (catProducts.length === 0) continue;

      lines.push(`#### ${CATEGORY_LABELS[cat]}\n`);

      for (const p of catProducts) {
        const localizedName = productTexts[lang]?.[p.id]?.name || p.name;
        const url = `${SITE_URL}/products/${p.id}/`;
        lines.push(`- ${url} — ${localizedName}`);
      }
      lines.push('');
    }
  }

  return lines;
}

function main(): void {
  fs.mkdirSync(WELL_KNOWN_DIR, { recursive: true });

  // Ensure llms.txt exists
  if (!fs.existsSync(LLMS_TXT)) {
    fs.writeFileSync(
      LLMS_TXT,
      `# Felizbay\n\nFelizbay designs and supplies premium drop stitch inflatable swimming pools.\n`
    );
    console.log('[geo] Created default llms.txt');
  }

  // Build llms-full.txt from scratch (idempotent)
  const baseParts: string[] = [];

  // Static base content — read existing file up to the auto-generated sections
  if (fs.existsSync(LLMS_FULL_TXT)) {
    const existing = fs.readFileSync(LLMS_FULL_TXT, 'utf8');
    // Cut at the first auto-generated section (## Site Pages) so repeated
    // runs stay idempotent; older runs' appended sections are discarded here
    const autoIdx = existing.indexOf('\n## Site Pages');
    if (autoIdx !== -1) {
      baseParts.push(existing.slice(0, autoIdx).trim());
    } else {
      baseParts.push(existing.trim());
    }
  } else {
    // Default base
    baseParts.push(
      `# Felizbay Knowledge Base\n\nFelizbay designs and supplies premium drop stitch inflatable swimming pools.`
    );
  }

  // Generate site pages
  console.log('[geo] Gathering site pages...');
  const pageUrls = getPageUrls();
  if (pageUrls.length > 0) {
    baseParts.push('\n\n## Site Pages\n');
    baseParts.push(pageUrls.join('\n'));
  }
  console.log(`[geo]   ${pageUrls.length} pages found`);

  // Generate product catalog — all LANGUAGES, all products
  console.log('[geo] Generating product catalog...');
  const productLines = getProductLines();
  if (productLines.length > 0) {
    baseParts.push('\n\n## Product Catalog\n');
    baseParts.push(productLines.join('\n'));
  }

  const productCount = products.length;
  const langCount = Object.keys(LANGUAGES).length;
  console.log(`[geo]   ${productCount} products x ${langCount} LANGUAGES`);

  const output =
    baseParts
      .join('')
      .replace(/\n{3,}/g, '\n\n')
      .trim() + '\n';
  fs.writeFileSync(LLMS_FULL_TXT, output);
  console.log('[geo] Wrote llms-full.txt');

  // Generate entity.json
  const entitySource = readSource('entity.json');
  if (entitySource) {
    try {
      JSON.parse(entitySource);
      fs.writeFileSync(ENTITY_JSON, entitySource);
      console.log('[geo] Wrote .well-known/entity.json from source data');
    } catch {
      console.warn('[geo] Invalid entity.json source, keeping existing');
    }
  }

  console.log('[generate-geo-files] Done');
}

main();
