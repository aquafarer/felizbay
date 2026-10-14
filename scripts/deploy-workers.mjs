import { spawn } from 'node:child_process';

// Deploy all 5 workers in parallel instead of sequentially (each deploy
// independently uploads a different worker; ~5x faster wall-clock).
const WORKERS = ['contact-worker', 'ai-worker', 'admin-worker', 'news-worker', 'automation-worker'];
const NPX = process.platform === 'win32' ? 'npx.cmd' : 'npx';

async function deploy(name) {
  return new Promise((resolve) => {
    // .cmd shims on Windows must run via the shell (direct spawn yields EINVAL).
    const child = spawn(NPX, ['wrangler', 'deploy', '-c', `workers/${name}/wrangler.toml`], {
      shell: process.platform === 'win32',
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    let output = '';
    child.stdout.on('data', (d) => (output += d));
    child.stderr.on('data', (d) => (output += d));
    child.on('close', (code) => {
      if (code !== 0) {
        console.error(`== ${name} FAILED (exit ${code})\n${output}`);
      }
      resolve(code);
    });
  });
}

const results = await Promise.all(WORKERS.map(deploy));
const failures = results.filter((code) => code !== 0).length;
if (failures > 0) {
  console.error(`Deploy failed for ${failures}/${WORKERS.length} workers`);
  process.exit(1);
}
console.log('All workers deployed');
