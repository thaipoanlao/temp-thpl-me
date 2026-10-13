#!/usr/bin/env node
/**
 * build.mjs — builds the static site into dist/.
 * Used by Cloudflare Pages (Build command: `node tools/build.mjs`, output: dist).
 * Safe to run locally to preview exactly what gets deployed.
 */
import { readFile, writeFile, mkdir, rm, readdir, stat } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import path from 'node:path';

const root = process.cwd();
const dist = path.join(root, 'dist');

const ROOT_FILES = ['index.html', 'manifest.webmanifest', 'sw.js'];
const ASSET_FILES = ['styles.css', 'app.js', 'i18n.js', 'icon.svg'];

const copyFile = async (from, to) => {
  await writeFile(to, await readFile(from));
};

const log = (...a) => console.log('[build]', ...a);

await rm(dist, { recursive: true, force: true });
await mkdir(path.join(dist, 'assets'), { recursive: true });

for (const f of ROOT_FILES) await copyFile(path.join(root, f), path.join(dist, f));
for (const f of ASSET_FILES) await copyFile(path.join(root, 'assets', f), path.join(dist, 'assets', f));
log('copied site files');

const run = (script, args) => {
  const r = spawnSync(process.execPath, [path.join(root, 'tools', script), ...args], { stdio: 'inherit' });
  if (r.status !== 0) console.warn(`[build] ${script} exited with ${r.status} (continuing)`);
};
run('fetch-fonts.mjs', [dist, 'assets']);
run('decode-icons.mjs', [dist, 'assets']);

async function walk(dir) {
  let files = 0, bytes = 0;
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) { const s = await walk(p); files += s.files; bytes += s.bytes; }
    else { files++; bytes += (await stat(p)).size; }
  }
  return { files, bytes };
}
const { files, bytes } = await walk(dist);
log(`done → dist/ (${files} files, ${(bytes / 1024).toFixed(1)} KB)`);
if (!(await stat(path.join(dist, 'index.html')).catch(() => null))) {
  console.error('[build] missing dist/index.html');
  process.exit(1);
}
