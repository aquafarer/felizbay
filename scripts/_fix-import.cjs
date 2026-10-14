const fs = require('fs');
const path = require('path');
const ROOT = process.cwd();
const files = [];
function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const fp = path.join(dir, e.name);
    if (e.isDirectory()) walk(fp);
    else if (e.name.endsWith('.astro')) {
      const c = fs.readFileSync(fp, 'utf8');
      if (/__pageData/.test(c)) files.push(fp);
    }
  }
}
walk(path.join(ROOT, 'src/pages'));
let fixed = 0;
for (const fp of files) {
  let c = fs.readFileSync(fp, 'utf8');
  const before = c;
  // add setPageContentData to the page-content import (single or double quotes)
  c = c.replace(
    /import\s+\{\s*getPageContent\s*\}\s+from\s+(['"])~\/i18n\/page-content\1;?/g,
    "import { getPageContent, setPageContentData } from '~/i18n/page-content';"
  );
  // also handle already-multi import that lacks setPageContentData
  c = c.replace(
    /import\s+\{\s*getPageContent\s*,\s*setPageContentData\s*\}\s+from\s+(['"])~\/i18n\/page-content\1;?/g,
    "import { getPageContent, setPageContentData } from '~/i18n/page-content';"
  );
  if (c !== before) {
    fs.writeFileSync(fp, c);
    fixed++;
  }
}
console.log('files with __pageData:', files.length, 'fixed imports:', fixed);
