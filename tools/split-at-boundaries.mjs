import { readFile, writeFile } from 'node:fs/promises';

const djb2 = (s) => { let x = 5381; for (let i = 0; i < s.length; i++) x = ((x * 33) ^ s.charCodeAt(i)) >>> 0; return x.toString(16).padStart(8, '0'); };

const raw = await readFile('deploy/cf-bundle.json', 'utf8');
const marks = [];
for (let i = 0; i < raw.length - 3; i++) {
  if (raw[i] === '"' && raw[i + 1] === '}' && (raw[i + 2] === ',' || raw[i + 2] === '}')) marks.push(i);
}
console.log('boundaries_abs:', marks.join(','));

for (let k = 5; k <= 22; k++) {
  const id = String(k).padStart(2, '0');
  const s = await readFile('deploy/chunks/chunk-' + id + '.txt', 'utf8');
  const start = (k - 1) * 2000;
  const inner = marks.filter((m) => m > start && m < start + s.length);
  if (!inner.length) { console.log('c' + id + ' no-boundary len=' + s.length + ' hash=' + djb2(s)); continue; }
  let prev = 0;
  const pieces = [];
  for (const m of inner) { const rel = m - start; pieces.push([prev, rel]); prev = rel; }
  pieces.push([prev, s.length]);
  pieces.forEach((p, j) => {
    const nm = 'c' + id + '_' + String.fromCharCode(65 + j);
    const part = s.slice(p[0], p[1]);
    writeFile('deploy/fix/' + nm + '.txt', part);
    console.log(nm + ' len=' + part.length + ' hash=' + djb2(part));
  });
  console.log('c' + id + ' fullhash=' + djb2(s));
}
