import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const L10N_PATH = path.join(ROOT, 'src/lib/product-l10n.ts');

// 49 generic spec labels for the two graduated languages that were missed
// by the original 14-language add-missing-labels.mjs run.
const LABELS_CS = {
  'Air Chambers': 'Vzduchové komory',
  Artwork: 'Grafika',
  Backup: 'Záloha',
  Beam: 'Šířka',
  'Boat Weight': 'Hmotnost lodi',
  Bottom: 'Dno',
  Buoyancy: 'Vztlak',
  Capacity: 'Kapacita',
  Certification: 'Certifikace',
  Chambers: 'Komory',
  Closure: 'Uzavření',
  Compatibility: 'Kompatibilita',
  Deadrise: 'Deadrise',
  Deck: 'Paluba',
  Deployment: 'Nasazení',
  'Design Category': 'Kategorie konstrukce',
  'Engine Shaft': 'Hřídel motoru',
  Features: 'Funkce',
  Floor: 'Podlaha',
  Frame: 'Rám',
  'Fuel Tank': 'Nádrž na palivo',
  Height: 'Výška',
  Included: 'Součást balení',
  Inflation: 'Nafouknutí',
  'Internal Beam': 'Vnitřní šířka',
  'Internal Length': 'Vnitřní délka',
  Length: 'Délka',
  Material: 'Materiál',
  'Max Engine Weight': 'Max. hmotnost motoru',
  'Max Load': 'Max. zátěž',
  'Max Persons': 'Max. osob',
  'Max Power': 'Max. výkon',
  Models: 'Modely',
  Mounting: 'Montáž',
  'Overall Length': 'Celková délka',
  Pontoons: 'Ponta',
  Pressure: 'Tlak',
  'Recommended Power': 'Doporučený výkon',
  Seams: 'Švy',
  Seats: 'Sedadla',
  'Shipping Dimensions': 'Rozměry při dopravě',
  Sizes: 'Velikosti',
  Thickness: 'Tloušťka',
  'Tube Diameter': 'Průměr trubice',
  Type: 'Typ',
  Valves: 'Ventily',
  Warranty: 'Záruka',
  Weight: 'Hmotnost',
  Width: 'Šířka',
};

const LABELS_JA = {
  'Air Chambers': 'エアチャンバー',
  Artwork: 'アートワーク',
  Backup: 'バックアップ',
  Beam: '全幅',
  'Boat Weight': 'ボート重量',
  Bottom: '底部',
  Buoyancy: '浮力',
  Capacity: '積載容量',
  Certification: '認証',
  Chambers: 'チャンバー',
  Closure: '留め具',
  Compatibility: '互換性',
  Deadrise: 'デッドライズ',
  Deck: 'デッキ',
  Deployment: '展開',
  'Design Category': '設計カテゴリー',
  'Engine Shaft': 'エンジンシャフト',
  Features: '特徴',
  Floor: 'フロア',
  Frame: 'フレーム',
  'Fuel Tank': '燃料タンク',
  Height: '高さ',
  Included: '付属品',
  Inflation: '空気注入',
  'Internal Beam': '内幅',
  'Internal Length': '内寸長',
  Length: '長さ',
  Material: '素材',
  'Max Engine Weight': '最大エンジン重量',
  'Max Load': '最大積載量',
  'Max Persons': '最大定員',
  'Max Power': '最大出力',
  Models: 'モデル',
  Mounting: '取り付け',
  'Overall Length': '全長',
  Pontoons: 'ポンツーン',
  Pressure: '圧力',
  'Recommended Power': '推奨出力',
  Seams: '縫い目',
  Seats: 'シート',
  'Shipping Dimensions': '配送時寸法',
  Sizes: 'サイズ',
  Thickness: '厚さ',
  'Tube Diameter': 'チューブ直径',
  Type: 'タイプ',
  Valves: 'バルブ',
  Warranty: '保証',
  Weight: '重量',
  Width: '幅',
};

function findSectionEnd(content, lang, section) {
  const langMarker = '\n  ' + lang + ': {';
  const langStart = content.indexOf(langMarker);
  if (langStart === -1) return -1;
  let d = 0;
  let b = false;
  let langEnd = langStart;
  for (let i = langStart; i < content.length; i++) {
    if (content[i] === '{') {
      d++;
      b = true;
    }
    if (content[i] === '}') d--;
    if (b && d === 0) {
      langEnd = i;
      break;
    }
  }
  const sectionMarker = section + ': {';
  const sectionStart = content.indexOf(sectionMarker, langStart);
  if (sectionStart === -1 || sectionStart > langEnd) return -1;
  let sd = 0;
  let sb = false;
  let sectionEnd;
  for (let i = sectionStart + sectionMarker.length - 1; i <= langEnd; i++) {
    if (content[i] === '{') {
      sd++;
      sb = true;
    }
    if (content[i] === '}') sd--;
    if (sb && sd === 0) {
      sectionEnd = i;
      break;
    }
  }
  return sectionEnd;
}

function escapeSq(str) {
  return str.replace(/'/g, "\\'");
}

function main() {
  let content = fs.readFileSync(L10N_PATH, 'utf8');
  const plan = [
    ['ja', LABELS_JA],
    ['cs', LABELS_CS],
  ];

  for (const [lang, labels] of plan) {
    const labelsEnd = findSectionEnd(content, lang, 'labels');
    if (labelsEnd === -1) {
      console.log(`No labels section for ${lang}`);
      continue;
    }
    const sectionStart = content.indexOf('labels: {', content.indexOf('\n  ' + lang + ': {'));
    const existing = content.slice(sectionStart, labelsEnd);

    const entries = [];
    let skipped = 0;
    for (const [label, translation] of Object.entries(labels)) {
      const keyRe = new RegExp(`('${label.replace(/'/g, "\\'")}'|${label.replace(/'/g, "\\'")}):`);
      if (keyRe.test(existing)) {
        skipped++;
        continue;
      }
      entries.push(`      '${label}': '${escapeSq(translation)}',`);
    }

    if (entries.length > 0) {
      const insert = '\n' + entries.join('\n');
      content = content.slice(0, labelsEnd) + insert + content.slice(labelsEnd);
      console.log(`${lang}: added ${entries.length} labels (${skipped} already present)`);
    } else {
      console.log(`${lang}: nothing to add (${skipped} already present)`);
    }
  }

  fs.writeFileSync(L10N_PATH, content, 'utf8');
  console.log('\nDone!');
}

main();
