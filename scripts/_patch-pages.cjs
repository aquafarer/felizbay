const fs = require('fs');
const path = require('path');
const ROOT = process.cwd();
const pc = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/i18n/generated/page-content.json'), 'utf8'));
const pages = new Set();
for (const k of Object.keys(pc)) {
  const i = k.indexOf('/');
  pages.add(k.slice(i + 1));
}
console.log('available page modules:', pages.size);

const callers = [];
function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const fp = path.join(dir, e.name);
    if (e.isDirectory()) walk(fp);
    else if (e.name.endsWith('.astro')) {
      const c = fs.readFileSync(fp, 'utf8');
      if (/getPageContent\(/.test(c) && !/export function getPageContent/.test(c)) callers.push(fp);
    }
  }
}
walk(path.join(ROOT, 'src/pages'));
console.log('caller files:', callers.length);

let done = 0,
  skip = 0;
for (const fp of callers) {
  let c = fs.readFileSync(fp, 'utf8');
  if (/__pageData/.test(c)) {
    skip++;
    continue;
  }
  let m = c.match(/getPageContent\([^,)]*,\s*'([^']+)'\s*\)/);
  let pageName = m ? m[1] : null;
  if (!pageName && /getPageContent\(\s*\w+\s*\)/.test(c)) pageName = 'home';
  if (!pageName || !pages.has(pageName)) {
    console.log('  SKIP (no page match):', fp.replace(ROOT, ''), '->', pageName);
    skip++;
    continue;
  }
  const importLine = "import __pageData from '~/i18n/generated/pages/" + pageName + ".ts';";
  const setterLine = 'setPageContentData(__pageData);';
  const importRe = /import\s+\{[^}]*getPageContent[^}]*\}\s+from\s+['"]~\/i18n\/page-content['"];?/;
  if (!importRe.test(c)) {
    console.log('  SKIP (no import line):', fp.replace(ROOT, ''));
    skip++;
    continue;
  }
  c = c.replace(importRe, (mm) => mm + '\n' + importLine);
  const callRe = /.*getPageContent\([^)]*\)[^\n]*\n/;
  c = c.replace(callRe, (mm) => setterLine + '\n' + mm);
  fs.writeFileSync(fp, c);
  done++;
}
console.log('done:', done, 'skip:', skip);
