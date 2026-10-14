import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = import.meta.dirname ?? path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const tsxBin = path.resolve(root, 'node_modules', '.bin', 'tsx');

const scripts = [];

if (scripts.length === 0) {
  console.log('=== GEO v4 Build Pipeline ===');
  console.log('(skipped — no GEO v4 scripts configured for the pool site)');
} else {
  console.log('=== GEO v4 Build Pipeline ===');
  for (const script of scripts) {
    console.log(`\nRunning ${script}...`);
    const cmd = '"' + tsxBin + '" "' + path.join(__dirname, script) + '"';
    execSync(cmd, { stdio: 'inherit', cwd: root, shell: true });
  }
  console.log('\n=== GEO v4 Build Complete ===');
}
