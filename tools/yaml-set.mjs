// Generic batch editor for multilingual page yamls (src/data/pages/[lang]/<base>.yaml).
// Usage: node tools/yaml-set.mjs <spec.json> [--dry]
//
// spec.json:
// {
//   "base": "solutions-watersports",
//   "langs": ["sv", "no"],                  // or "*" (default: all 14 non-EN langs)
//   "set": { "hero.tagline": "value" },     // same value applied to every lang in langs
//   "setPerLang": { "fr": { "hero.title": "Titre" } },
//   "delete": ["content_segments.items[2]"],
//   "deletePerLang": { "da": ["stats.note"] },
//   "includeEn": true                       // also apply set/delete (NOT setPerLang) to the EN source yaml
// }
//
// Limits (by design, verified before every write):
// - set: old value must be a UNIQUE string leaf in the file; adding new paths is not supported
// - delete: scalar leaves only (whole line removed); flow-style lines abort safely
// - structural block add/remove: copy the engine below into a one-off script (see TECH.md §15.5)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(path.join(ROOT, 'package.json'));
const YAML = require('yaml');
const PAGES = path.join(ROOT, 'src/data/pages');
const LANGS = ['fr', 'de', 'es', 'pt', 'ar', 'it', 'ru', 'pl', 'nl', 'sv', 'no', 'el', 'fi', 'da'];
const DRY = process.argv.includes('--dry');

const specPath = process.argv[2];
if (!specPath || specPath.startsWith('--')) {
  console.error('Usage: node tools/yaml-set.mjs <spec.json> [--dry]');
  process.exit(1);
}
const spec = JSON.parse(fs.readFileSync(specPath, 'utf8'));
if (!spec.base) {
  console.error('spec.base is required');
  process.exit(1);
}

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
const replaceOccurrence = (raw, at, end, replacement) => {
  const prevChar = raw[at - 1];
  if (prevChar === "'") {
    if (raw[end] !== "'") throw new Error('single-quote context mismatch');
    return raw.slice(0, at) + quoteSingle(replacement).slice(1, -1) + raw.slice(end);
  }
  if (prevChar === '"') {
    if (raw[end] !== '"') throw new Error('double-quote context mismatch');
    return raw.slice(0, at) + quoteDouble(replacement).slice(1, -1) + raw.slice(end);
  }
  return raw.slice(0, at) + yamlScalar(replacement) + raw.slice(end);
};

const getPath = (obj, p) => {
  let cur = obj;
  for (const part of p.replace(/\]/g, '').split(/[.[]/).filter(Boolean)) cur = cur == null ? undefined : cur[part];
  return cur;
};
const partsOf = (p) => p.replace(/\]/g, '').split(/[.[]/).filter(Boolean);
const setPath = (obj, p, v) => {
  const parts = partsOf(p);
  let cur = obj;
  for (let i = 0; i < parts.length - 1; i++) cur = cur[parts[i]];
  cur[parts[parts.length - 1]] = v;
};
const deletePath = (obj, p) => {
  const parts = partsOf(p);
  let cur = obj;
  for (let i = 0; i < parts.length - 1; i++) cur = cur[parts[i]];
  const last = parts[parts.length - 1];
  if (Array.isArray(cur)) cur.splice(Number(last), 1);
  else delete cur[last];
};
const leaves = (o, p, out) => {
  if (typeof o === 'string') {
    out.push({ path: p, v: o });
    return out;
  }
  if (Array.isArray(o)) {
    o.forEach((x, i) => leaves(x, `${p}[${i}]`, out));
    return out;
  }
  if (o && typeof o === 'object') {
    for (const [k, v] of Object.entries(o)) leaves(v, p ? `${p}.${k}` : k, out);
  }
  return out;
};

const langs = !spec.langs || spec.langs === '*' ? LANGS : spec.langs;
const files = new Map();
const push = (id, op) => {
  if (!files.has(id)) files.set(id, []);
  files.get(id).push(op);
};
for (const [p, v] of Object.entries(spec.set || {}))
  for (const lang of langs) push(lang, { type: 'set', path: p, value: v });
for (const [lang, m] of Object.entries(spec.setPerLang || {}))
  for (const [p, v] of Object.entries(m)) push(lang, { type: 'set', path: p, value: v });
for (const p of spec.delete || []) for (const lang of langs) push(lang, { type: 'delete', path: p });
for (const [lang, list] of Object.entries(spec.deletePerLang || {}))
  for (const p of list) push(lang, { type: 'delete', path: p });

const fileList = [];
for (const [id, ops] of files) fileList.push({ id, file: path.join(PAGES, id, `${spec.base}.yaml`), ops });
if (spec.includeEn === true) {
  const enOps = [
    ...Object.entries(spec.set || {}).map(([p, v]) => ({ type: 'set', path: p, value: v })),
    ...(spec.delete || []).map((p) => ({ type: 'delete', path: p })),
  ];
  if (enOps.length) fileList.push({ id: 'en', file: path.join(PAGES, `${spec.base}.yaml`), ops: enOps });
}

let okFiles = 0;
for (const { id, file, ops } of fileList) {
  if (!fs.existsSync(file)) {
    console.log(`  ${id}: file missing — skip`);
    continue;
  }
  let raw = fs.readFileSync(file, 'utf8');
  const expected = YAML.parse(raw);
  let applied = 0;
  let error = null;

  for (const op of ops) {
    try {
      const cur = getPath(expected, op.path);
      if (typeof cur !== 'string')
        throw new Error(
          `path missing or not a string leaf: ${op.path} (adding new keys is not supported — use a one-off script, TECH.md §15.5)`
        );
      const dup = leaves(expected, '', []).filter((l) => l.v === cur);
      if (dup.length !== 1)
        throw new Error(
          `old value not unique (${dup.length} leaves share it) — set each path explicitly via setPerLang`
        );
      const at = raw.indexOf(cur);
      if (at === -1 || raw.indexOf(cur, at + 1) !== -1) throw new Error('raw occurrence count != 1');
      if (op.type === 'set') {
        if (cur === op.value) continue; // no-op
        raw = replaceOccurrence(raw, at, at + cur.length, op.value);
        setPath(expected, op.path, op.value);
      } else {
        const ls = raw.lastIndexOf('\n', at) + 1;
        const nl = raw.indexOf('\n', at);
        const end = nl === -1 ? raw.length : nl;
        raw = raw.slice(0, ls) + raw.slice(Math.min(end + 1, raw.length));
        deletePath(expected, op.path);
      }
      applied++;
    } catch (e) {
      error = `${op.type} ${op.path}: ${e.message}`;
      break;
    }
  }

  if (error) {
    console.log(`  ${id}: ABORT — ${error}`);
    continue;
  }
  if (!applied) {
    console.log(`  ${id}: no-op`);
    continue;
  }
  let after;
  try {
    after = YAML.parse(raw);
  } catch (e) {
    console.log(`  ${id}: ABORT — reparse failed: ${e.message.split('\n')[0]}`);
    continue;
  }
  if (JSON.stringify(after) !== JSON.stringify(expected)) {
    console.log(`  ${id}: ABORT — verify mismatch (flow-style line or unsupported layout — use a one-off script)`);
    continue;
  }
  if (DRY) {
    console.log(`  ${id}: would apply ${applied} ops`);
    continue;
  }
  fs.writeFileSync(file, raw, 'utf8');
  okFiles++;
  console.log(`  ${id}: ${applied} ops applied, verified`);
}
console.log(`\nyaml-set ${spec.base}: ${okFiles}/${fileList.length} files updated${DRY ? ' (dry run)' : ''}`);
