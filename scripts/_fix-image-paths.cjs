const fs = require('fs');
const path = require('path');
const glob = require('glob');
const ROOT = process.cwd();

const REPLACEMENTS = {
  'https://assets.felizbay.com/images/Felizbay/factory/Felizbay factory.webp':
    'https://assets.felizbay.com/images/Felizbay/factory/Felizbay-factory-building.webp',
  'https://assets.felizbay.com/images/Felizbay/factory/design discuss2.jpeg':
    'https://assets.felizbay.com/images/Felizbay/factory/Felizbay-design-discussion-2.webp',
  'https://assets.felizbay.com/images/Felizbay/factory/design discuss original.jpeg':
    'https://assets.felizbay.com/images/Felizbay/factory/Felizbay-design-discussion-original.webp',
  'https://assets.felizbay.com/images/Felizbay/factory/PVC material.jpeg':
    'https://assets.felizbay.com/images/Felizbay/factory/Felizbay-pvc-material-testing.webp',
  'https://assets.felizbay.com/images/Felizbay/factory/Pressure Testing.jpeg':
    'https://assets.felizbay.com/images/Felizbay/factory/Felizbay-pressure-testing.webp',
  'https://assets.felizbay.com/images/Felizbay/factory/Stock Boat.webp':
    'https://assets.felizbay.com/images/Felizbay/factory/Felizbay-stock-boat-inventory.webp',
  'https://assets.felizbay.com/images/Felizbay/factory/UV Resistance Testing.jpeg':
    'https://assets.felizbay.com/images/Felizbay/factory/Felizbay-uv-resistance-testing.webp',
  'https://assets.felizbay.com/images/Felizbay/factory/sup making.jpeg':
    'https://assets.felizbay.com/images/Felizbay/factory/Felizbay-sup-manufacturing.webp',
  'https://assets.felizbay.com/images/Felizbay/factory/sup making3.jpeg':
    'https://assets.felizbay.com/images/Felizbay/factory/Felizbay-sup-manufacturing-3.webp',
  'https://assets.felizbay.com/images/Felizbay/factory/producing department.jpeg':
    'https://assets.felizbay.com/images/Felizbay/factory/Felizbay-production-department.webp',
  'https://assets.felizbay.com/images/Felizbay/factory/producing department2.jpeg':
    'https://assets.felizbay.com/images/Felizbay/factory/Felizbay-production-department-2.webp',
  'https://assets.felizbay.com/images/Felizbay/hero/about-banner.webp':
    'https://assets.felizbay.com/images/Felizbay/hero/production-dept.webp',
  'https://assets.felizbay.com/images/Felizbay/hero/academy-banner.webp':
    'https://assets.felizbay.com/images/Felizbay/hero/tech-meeting-small.webp',
  'https://assets.felizbay.com/images/Felizbay/hero/contact-banner.webp':
    'https://assets.felizbay.com/images/Felizbay/hero/factory-gate.webp',
  'https://assets.felizbay.com/images/Felizbay/hero/custom-banner.webp':
    'https://assets.felizbay.com/images/Felizbay/hero/Felizbay-hero-design-concept.webp',
  'https://assets.felizbay.com/images/Felizbay/products/fishing-banner.webp':
    'https://assets.felizbay.com/images/Felizbay/hero/production-dept.webp',
  'https://assets.felizbay.com/images/Felizbay/factory/factory-banner.webp':
    'https://assets.felizbay.com/images/Felizbay/hero/factory-gate.webp',
  'https://assets.felizbay.com/images/Felizbay/factory/process-banner.webp':
    'https://assets.felizbay.com/images/Felizbay/hero/production-dept.webp',
  'https://assets.felizbay.com/images/Felizbay/factory/production-workshop.webp':
    'https://assets.felizbay.com/images/Felizbay/factory/Felizbay-production-department.webp',
  'https://assets.felizbay.com/images/Felizbay/factory/quality-workshop.webp':
    'https://assets.felizbay.com/images/Felizbay/factory/Felizbay-pvc-material-testing.webp',
  'https://assets.felizbay.com/images/Felizbay/factory/rib-workshop.webp':
    'https://assets.felizbay.com/images/Felizbay/products/rib/Felizbay-rib-330-boat.webp',
  'https://assets.felizbay.com/images/Felizbay/factory/welding-workshop.webp':
    'https://assets.felizbay.com/images/Felizbay/factory/producting department3.webp',
  'https://assets.felizbay.com/images/Felizbay/hero/hero-5.webp':
    'https://assets.felizbay.com/images/Felizbay/hero/factory-gate.webp',
  'https://assets.felizbay.com/images/Felizbay/hero/hero-image.webp':
    'https://assets.felizbay.com/images/Felizbay/hero/Felizbay-hero-design-concept.webp',
  'https://assets.felizbay.com/images/Felizbay/hero/hero-scenic.webp':
    'https://assets.felizbay.com/images/Felizbay/hero/tech-meeting-small.webp',
  'https://assets.felizbay.com/images/Felizbay/hero/boat man Felizbay-min.jpeg':
    'https://assets.felizbay.com/images/Felizbay/hero/Felizbay-hero-design-concept.webp',
  'https://assets.felizbay.com/images/Felizbay/hero/production-workshop.webp':
    'https://assets.felizbay.com/images/Felizbay/factory/Felizbay-production-department.webp',
  'https://assets.felizbay.com/images/Felizbay/hero/trust-hero.webp':
    'https://assets.felizbay.com/images/Felizbay/hero/tech-meeting-small.webp',
  'https://assets.felizbay.com/images/Felizbay/products/rib-330.webp':
    'https://assets.felizbay.com/images/Felizbay/products/rib/Felizbay-rib-330-boat.webp',
};

const yamlFiles = glob.sync('src/data/pages/**/*.yaml').map((f) => path.join(ROOT, f));
let totalReplaced = 0;
let totalFiles = 0;

for (const filePath of yamlFiles) {
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;
  for (const [oldUrl, newUrl] of Object.entries(REPLACEMENTS)) {
    const re = new RegExp(oldUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
    const count = (content.match(re) || []).length;
    if (count > 0) {
      content = content.split(oldUrl).join(newUrl);
      totalReplaced += count;
      changed = true;
    }
  }
  if (changed) {
    fs.writeFileSync(filePath, content);
    totalFiles++;
  }
}

// Summary per replacement
console.log('Replacement summary:');
for (const [oldUrl, newUrl] of Object.entries(REPLACEMENTS)) {
  const oldName = oldUrl.split('/').pop();
  const newName = newUrl.split('/').pop();
  // Count by scanning files
  let c = 0;
  for (const filePath of yamlFiles) {
    const content = fs.readFileSync(filePath, 'utf8');
    if (content.includes(newUrl)) c++;
  }
  if (c > 0) console.log('  ' + oldName + ' -> ' + newName + ' (' + c + ' files)');
}

console.log('---');
console.log('Total replacements: ' + totalReplaced);
console.log('Total files changed: ' + totalFiles);

// Verify
let missingCount = 0;
for (const f of yamlFiles) {
  const content = fs.readFileSync(f, 'utf8');
  for (const oldUrl of Object.keys(REPLACEMENTS)) {
    if (content.includes(oldUrl)) {
      console.error('STILL MISSING in ' + f.replace(ROOT + path.sep, '').replace(/\\/g, '/'));
      missingCount++;
    }
  }
}
if (missingCount === 0) console.log('All references updated successfully!');
