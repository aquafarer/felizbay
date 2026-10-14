const fs = require('fs');
const path = require('path');
const ROOT = process.cwd();
const GENERATED_DIR = path.join(ROOT, 'src/i18n/generated');
const PAGES_DIR = path.join(GENERATED_DIR, 'pages');

const pc = JSON.parse(fs.readFileSync(path.join(GENERATED_DIR, 'page-content.json'), 'utf8'));

const pageNames = new Set();
for (const k of Object.keys(pc)) {
  const slash = k.indexOf('/');
  if (slash !== -1) pageNames.add(k.slice(slash + 1));
}

fs.mkdirSync(PAGES_DIR, { recursive: true });

let count = 0;
for (const pname of pageNames) {
  const entry = {};
  for (const k of Object.keys(pc)) {
    if (k.endsWith('/' + pname)) entry[k] = pc[k];
  }
  const content = '// AUTO-GENERATED\n// @ts-nocheck\nexport default ' + JSON.stringify(entry) + ';\n';
  fs.writeFileSync(path.join(PAGES_DIR, pname + '.ts'), content);
  count++;
}

console.log('wrote pages/*.ts for', count, 'pages');
