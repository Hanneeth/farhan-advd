// Refreshes scripts/anim/problems.json from the app's verified question bank (adds any ids passed on the command line).
// Usage: node scripts/anim/dump-problems.mjs pyq-m24-q2 bank-ps2-p3 ...
import { createServer } from 'vite';
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
const here = dirname(fileURLToPath(import.meta.url));
const out = join(here, 'problems.json');
const cur = JSON.parse(readFileSync(out, 'utf8'));
const ids = new Set([...Object.keys(cur), ...process.argv.slice(2)]);
const vite = await createServer({ root: join(here, '..', '..'), server: { middlewareMode: true }, appType: 'custom', logLevel: 'error' });
const mods = ['bank.ts', 'bankChat.ts', 'bankLabs.ts', 'bankM3.ts', 'bankM4.ts', 'bankM5.ts', 'bankM6.ts', 'bankPyq.ts'];
const all = {};
for (const f of mods) {
  const m = await vite.ssrLoadModule('/src/practice/' + f);
  Object.values(m).filter(Array.isArray).flat().forEach((p) => { if (p && p.id) all[p.id] = p; });
}
const res = {};
for (const id of ids) { if (!all[id]) { console.error('missing', id); continue; } res[id] = JSON.parse(JSON.stringify(all[id])); }
writeFileSync(out, JSON.stringify(res));
console.log(Object.keys(res).length, 'problems →', out);
await vite.close();
