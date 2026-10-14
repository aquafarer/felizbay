#!/usr/bin/env node
/**
 * scripts/check-frontmatter.mjs
 *
 * 语法校验 src/pages/[lang]/**.astro 的 frontmatter：剥离 import 行后用
 * esbuild 编译（npx --yes esbuild，无需安装依赖）。翻译脚本注入的
 * META/PAGE_META/PAGE_DESC 块若括号/引号失配会在此报错。
 *
 * 批量模式：所有 frontmatter 一次性交给 esbuild；失败时逐文件重跑定位。
 *
 * 用法：node scripts/check-frontmatter.mjs
 */

import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { execSync } from 'node:child_process';

const ROOT = path.resolve(import.meta.dirname, '..');
const PAGES_DIR = path.join(ROOT, 'src/pages/[lang]');
const TMP = fs.mkdtempSync(path.join(os.tmpdir(), 'fm-check-'));
const OUT = path.join(TMP, 'out');

function stripImports(fm) {
  const lines = fm.split('\n');
  const out = [];
  let i = 0;
  while (i < lines.length) {
    if (/^import\s/.test(lines[i])) {
      // 多行 import：直到 from '...' 且括号平衡为止
      let depth = 0;
      let done = false;
      while (i < lines.length && !done) {
        for (const ch of lines[i]) {
          if (ch === '{') depth++;
          else if (ch === '}') depth--;
        }
        done = /from\s+['"].*['"]/.test(lines[i]) && depth <= 0;
        i++;
      }
      continue;
    }
    out.push(lines[i]);
    i++;
  }
  return out.join('\n');
}

function walk(dir) {
  const out = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...walk(p));
    else if (e.name.endsWith('.astro')) out.push(p);
  }
  return out;
}

const checked = [];
for (const f of walk(PAGES_DIR)) {
  const src = fs.readFileSync(f, 'utf8');
  // 本地 autocrlf 检出为 CRLF（CI blob 是 LF）；\r?\n 兼容两者，
  // 否则 CRLF 文件会被静默跳过（131 → 98 的缺检就是这么来的）。
  const m = src.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!m) continue;
  const fm = stripImports(m[1]).replace(/^export const prerender.*$/gm, '');
  const t = path.join(TMP, path.basename(f) + '.ts');
  fs.writeFileSync(t, fm, 'utf8');
  checked.push({ astro: f, ts: t });
}

function runEsbuild(files) {
  const args = files.map((f) => `"${f}"`).join(' ');
  const errFile = path.join(TMP, 'stderr.txt');
  try {
    execSync(`npx --yes esbuild ${args} --loader:.ts=ts --format=esm --outdir="${OUT}" 2> "${errFile}"`, {
      stdio: 'pipe',
      shell: true,
    });
    // esbuild 退出码 0 时仍可能输出警告（stderr）——只关心 Duplicate key
    const stderr = fs.readFileSync(errFile, 'utf8');
    if (/duplicate key/i.test(stderr)) return stderr;
    return null;
  } catch (e) {
    return String(e.stderr || e.message);
  }
}

// 翻译脚本重复注入会产生对象字面量重复键 —— esbuild 仅作警告（退出码 0），
// 但 CI 的 eslint no-dupe-keys 会将其报为错误。此处显式扫描 stderr，
// 让 check-frontmatter 在 CI 注入后立即失败，而不是等到 Build & Deploy。
function hasDuplicateKeys(errText) {
  return /duplicate key/i.test(errText || '');
}

console.log(`[check-frontmatter] checking ${checked.length} files...`);
const err = runEsbuild(checked.map((c) => c.ts));
if (!err) {
  console.log('[check-frontmatter] all frontmatter OK');
  process.exit(0);
}

if (hasDuplicateKeys(err)) {
  console.log('[check-frontmatter] DUPLICATE KEYS detected:');
  console.log(
    err
      .split('\n')
      .filter((l) => /duplicate key/i.test(l))
      .join('\n')
  );
  process.exit(1);
}

// 定位具体失败文件
let bad = 0;
for (const c of checked) {
  const e = runEsbuild([c.ts]);
  if (e) {
    bad++;
    console.log('SYNTAX FAIL:', path.relative(ROOT, c.astro));
    console.log(e.split('\n').slice(0, 6).join('\n'));
  }
}
console.log(`[check-frontmatter] ${bad} file(s) failed`);
process.exit(bad > 0 ? 1 : 0);
