// Quote-style-aware surgical replacement of leaked EN strings with translations.
// Usage: node tools/i18n-apply.mjs <yaml-base-name> [--dry]
// Requires: run tools/i18n-audit.mjs first (reads tools/_work/audit.json).
// Translation tables: tools/l10n/<base>.<lang>.json with keys "1".."N" matching the
// audit EN leak order (canonical order = the longest per-lang leak list; fr is usually
// the full set for shared files, but fall back to the longest list when it is not).
// A table value equal to the EN string means "keep EN" (technical terms) and is skipped.
// Multi-line literal-block (|) values are matched with indentation-aware patterns.
// Safety: every file is reparsed and every leak path asserted before writing.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(path.join(ROOT, 'package.json'));
const YAML = require('yaml');

const base = process.argv[2];
const dry = process.argv.includes('--dry');
if (!base || base.startsWith('--')) {
  console.error('Usage: node tools/i18n-apply.mjs <yaml-base-name> [--dry]');
  process.exit(1);
}
const PAGES = path.join(ROOT, 'src/data/pages');
const L10N = path.join(ROOT, 'tools', 'l10n');
const AUDIT = path.join(ROOT, 'tools', '_work', 'audit.json');
if (!fs.existsSync(AUDIT)) {
  console.error('tools/_work/audit.json not found — run `node tools/i18n-audit.mjs` first');
  process.exit(1);
}
const audit = JSON.parse(fs.readFileSync(AUDIT, 'utf8'));

const leaks = audit.perFile[`${base}.yaml`];
if (!leaks) {
  console.error(`no audit entry for ${base}.yaml (0 leaks — nothing to do)`);
  process.exit(1);
}

const enIndex = Object.entries(leaks).reduce((a, b) => (b[1].length > a[1].length ? b : a))[1]; // canonical EN order (longest leak list)

const getPath = (obj, path) => {
  let cur = obj;
  for (const part of path.replace(/\]/g, '').split(/[.[]/).filter(Boolean)) cur = cur == null ? undefined : cur[part];
  return cur;
};

const plainSafe = (s) =>
  /^[A-Za-z0-9À-ÖØ-öø-ÿĀ-žΑ-ωА-я\u0400-\u04FF\u0370-\u03FF\u0600-\u06FF]/.test(s) &&
  !/:(\s|$)/.test(s) &&
  !/\s#/.test(s) &&
  !/\n/.test(s) &&
  !/\r/.test(s) &&
  s === s.trim() &&
  !/[ \t]$/.test(s) &&
  !/[\\]/.test(s) &&
  !s.endsWith(':');

const quoteDouble = (s) => `"${s.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`;
const quoteSingle = (s) => `'${s.replace(/'/g, "''")}'`;

const yamlScalar = (s) => (plainSafe(s) ? s : quoteDouble(s));

const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// literal-block (|) scalars: each parsed "\n" maps to "\n<indent>" in raw text
const findBlockMatches = (raw, v) => {
  if (!v.includes('\n')) return null;
  const core = v.endsWith('\n') ? v.slice(0, -1) : v;
  const parts = core.split('\n').map(escapeRe);
  const re = new RegExp(parts.join('\\n([ \\t]+)'), 'g');
  const out = [];
  let m;
  while ((m = re.exec(raw)) !== null) {
    const at = m.index;
    const nl = raw.lastIndexOf('\n', at - 1);
    out.push({ at, end: at + m[0].length, indent: m[1] || raw.slice(nl + 1, at) });
  }
  return out;
};

const toBlockCore = (translation, indent) => {
  const t = translation.endsWith('\n') ? translation.slice(0, -1) : translation;
  return t.split('\n').join('\n' + indent);
};

// replace ONE occurrence at index `at`, respecting quote context
const replaceOccurrence = (raw, at, end, replacement) => {
  const prevChar = raw[at - 1];
  if (prevChar === "'") {
    // inside single-quoted scalar: keep surrounding quotes, escape content
    if (raw[end] !== "'") throw new Error(`single-quote context mismatch`);
    return raw.slice(0, at) + quoteSingle(replacement).slice(1, -1) + raw.slice(end);
  }
  if (prevChar === '"') {
    if (raw[end] !== '"') throw new Error(`double-quote context mismatch`);
    return raw.slice(0, at) + quoteDouble(replacement).slice(1, -1) + raw.slice(end);
  }
  // plain scalar
  return raw.slice(0, at) + yamlScalar(replacement) + raw.slice(end);
};

let okLangs = 0;
for (const [lang, arr] of Object.entries(leaks)) {
  const tFile = path.join(L10N, `${base}.${lang}.json`);
  if (!fs.existsSync(tFile)) {
    console.log(`MISSING translations: tools/l10n/${base}.${lang}.json`);
    continue;
  }
  const table = JSON.parse(fs.readFileSync(tFile, 'utf8'));
  const p = path.join(PAGES, lang, `${base}.yaml`);
  let raw = fs.readFileSync(p, 'utf8');
  const ydoc = YAML.parse(raw);
  const missing = [];
  let replacedCount = 0;

  for (let i = 0; i < enIndex.length; i++) {
    const { path, v } = enIndex[i];
    const translation = table[String(i + 1)];
    if (!translation) {
      missing.push(i + 1);
      continue;
    }
    if (translation === v) continue; // intentionally kept EN (technical terms)
    if (!arr.some((l) => l.path === path)) continue; // this lang doesn't leak here
    const cur = getPath(ydoc, path);
    if (cur !== v) {
      console.log(`  !! ${lang} ${path}: current != EN — skip`);
      continue;
    }

    // replace every raw occurrence of v (each maps to a leak path with same value)
    const pathsWithV = arr.filter((l) => l.v === v).length;
    const blockMatches = findBlockMatches(raw, v);
    const isBlock = blockMatches !== null;
    const rawCount = isBlock ? blockMatches.length : raw.split(v).length - 1;
    if (rawCount !== pathsWithV) {
      console.log(`  !! ${lang} #${i + 1}: raw occurrence count ${rawCount} != ${pathsWithV} — skip`);
      continue;
    }
    for (let n = 0; n < pathsWithV; n++) {
      if (isBlock) {
        const m = findBlockMatches(raw, v)[0];
        raw = raw.slice(0, m.at) + toBlockCore(translation, m.indent) + raw.slice(m.end);
      } else {
        const at = raw.indexOf(v);
        raw = replaceOccurrence(raw, at, at + v.length, translation);
      }
      replacedCount++;
    }
  }
  if (missing.length) {
    console.log(`  ${lang}: MISSING table entries [${missing.join(',')}] — NOT WRITTEN`);
    continue;
  }
  if (dry) {
    console.log(`  ${lang}: would replace ${replacedCount} strings`);
    continue;
  }

  // verify: reparse + every leak path now has the translation
  let bad = 0;
  let newY;
  try {
    newY = YAML.parse(raw);
  } catch (e) {
    console.log(`  !! ${lang}: YAML parse after replace: ${e.message.split('\n')[0]} — NOT WRITTEN`);
    continue;
  }
  for (let i = 0; i < enIndex.length; i++) {
    const { path } = enIndex[i];
    const translation = table[String(i + 1)];
    if (!arr.some((l) => l.path === path)) continue;
    const now = getPath(newY, path);
    if (now !== translation) {
      console.log(`  !! ${lang} verify fail #${i + 1} ${path}: got ${JSON.stringify(now)?.slice(0, 50)}`);
      bad++;
    }
  }
  if (bad) {
    console.log(`  ${lang}: ${bad} verify failures — NOT WRITTEN`);
    continue;
  }
  fs.writeFileSync(p, raw, 'utf8');
  okLangs++;
  console.log(`  ${lang}: ${replacedCount} replaced, verified`);
}
console.log(`\n${base}: ${okLangs}/${Object.keys(leaks).length} langs updated${dry ? ' (dry run)' : ''}`);
