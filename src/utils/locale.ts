import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as yaml from 'js-yaml';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const yamlPath = path.resolve(__dirname, '../data/site/languages.yaml');
const yamlContent = fs.readFileSync(yamlPath, 'utf-8');

type LangEntry = { code: string; name: string; locale: string; textDirection: string };
const langList = yaml.load(yamlContent) as LangEntry[];

export const AVAILABLE_LOCALES = langList.map((l) => l.locale) as [string, ...string[]];
