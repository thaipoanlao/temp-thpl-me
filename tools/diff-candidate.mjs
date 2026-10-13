#!/usr/bin/env node
/** diff-candidate.mjs <original> <candidate> — locate first divergence + lengths. */
import { readFile } from 'node:fs/promises';
const a = await readFile(process.argv[2], 'utf8');
const b = await readFile(process.argv[3], 'utf8');
const n = Math.min(a.length, b.length);
let i = 0;
while (i < n && a[i] === b[i]) i++;
console.log('origLen=' + a.length + ' candLen=' + b.length + ' firstDiff=' + i);
console.log('ORIG@' + i + ': ' + JSON.stringify(a.slice(Math.max(0, i - 30), Math.min(a.length, i + 60))));
console.log('CAND@' + i + ': ' + JSON.stringify(b.slice(Math.max(0, i - 30), Math.min(b.length, i + 60))));
