#!/usr/bin/env node
/**
 * decode-icons.mjs — decodes tools/icons/*.b64 (text, safe for git)
 * into real PNG files inside the site assets folder.
 * Used by the Cloudflare Pages build and can be run locally.
 *
 * Usage: node tools/decode-icons.mjs [siteDir=.] [outSubdir=assets]
 */
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';

const siteDir = process.argv[2] || '.';
const outDir = path.join(siteDir, process.argv[3] || 'assets');
const ICONS = ['icon-192.png', 'icon-512.png'];

await mkdir(outDir, { recursive: true });

for (const name of ICONS) {
  const src = path.join(process.cwd(), 'tools', 'icons', name + '.b64');
  try {
    const b64 = (await readFile(src, 'utf8')).replace(/\s+/g, '');
    await writeFile(path.join(outDir, name), Buffer.from(b64, 'base64'));
    console.log('[icons] wrote', name);
  } catch (e) {
    console.warn('[icons] skipped', name, '—', e.message);
  }
}
