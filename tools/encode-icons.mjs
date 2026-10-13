#!/usr/bin/env node
/**
 * encode-icons.mjs — dev helper: turns rendered assets/icon-*.png
 * into base64 text files under tools/icons/ so they can be committed to git
 * (the repo keeps no binary files; decode-icons.mjs restores them at build time).
 *
 * Usage: node tools/encode-icons.mjs   (run from the repo root)
 */
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';

const ICONS = ['icon-192.png', 'icon-512.png'];
await mkdir(path.join(process.cwd(), 'tools', 'icons'), { recursive: true });

for (const name of ICONS) {
  try {
    const buf = await readFile(path.join(process.cwd(), 'assets', name));
    const b64 = buf.toString('base64').replace(/(.{76})/g, '$1\n');
    await writeFile(path.join(process.cwd(), 'tools', 'icons', name + '.b64'), b64 + '\n', 'utf8');
    console.log('[encode]', name, '→', name + '.b64', `(${(buf.length / 1024).toFixed(1)} KB)`);
  } catch (e) {
    console.warn('[encode] skipped', name, '—', e.message);
  }
}
