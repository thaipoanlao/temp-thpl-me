#!/usr/bin/env node
/**
 * split-bundle.mjs — splits deploy/cf-bundle.json into fixed-size chunks
 * for chunked transport through the Cloudflare connector (staged worker
 * accumulation: each stage reads the previous script back from Cloudflare).
 *
 * Output: deploy/chunks/chunk-NN.txt (raw substrings, concatenation = full JSON)
 *         deploy/chunks/manifest.json (lengths + djb2 hashes for verification)
 *
 * Usage: node tools/split-bundle.mjs
 */
import { readFile, writeFile, mkdir, rm } from 'node:fs/promises';
import path from 'node:path';

const CHUNK = 2000;

const djb2 = (s) => {
  let x = 5381;
  for (let i = 0; i < s.length; i++) x = ((x * 33) ^ s.charCodeAt(i)) >>> 0;
  return x.toString(16).padStart(8, '0');
};

const root = process.cwd();
const raw = await readFile(path.join(root, 'deploy', 'cf-bundle.json'), 'utf8');
const outDir = path.join(root, 'deploy', 'chunks');

const parts = [];
for (let i = 0; i < raw.length; i += CHUNK) parts.push(raw.slice(i, i + CHUNK));

await rm(outDir, { recursive: true, force: true });
await mkdir(outDir, { recursive: true });

const manifest = { total: raw.length, totalHash: djb2(raw), chunkSize: CHUNK, chunks: [] };
let cumul = '';
for (let i = 0; i < parts.length; i++) {
  const name = 'chunk-' + String(i + 1).padStart(2, '0') + '.txt';
  await writeFile(path.join(outDir, name), parts[i], 'utf8');
  cumul += parts[i];
  manifest.chunks.push({
    file: name,
    len: parts[i].length,
    hash: djb2(parts[i]),
    cumLen: cumul.length,
    cumHash: djb2(cumul)
  });
}
await writeFile(path.join(outDir, 'manifest.json'), JSON.stringify(manifest, null, 1), 'utf8');

const rejoined = parts.join('');
console.log('[split] chunks: ' + parts.length + ' | total: ' + raw.length + ' chars | exact-rejoin: ' + (rejoined === raw) + ' | totalHash: ' + manifest.totalHash);
for (const c of manifest.chunks) console.log('  ' + c.file + '  len=' + c.len + '  hash=' + c.hash + '  cumLen=' + c.cumLen + '  cumHash=' + c.cumHash);
