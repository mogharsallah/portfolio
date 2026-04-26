#!/usr/bin/env bun
// Compile resume/template.typ to public/cv.pdf, sourcing data from src/data/resume.yaml.

import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { parse as parseYaml } from 'yaml';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const YAML_PATH = join(ROOT, 'src/data/resume.yaml');
const TEMPLATE = join(ROOT, 'resume/template.typ');
const FONTS_DIR = join(ROOT, 'resume/fonts');
const CACHE_JSON = join(ROOT, 'resume/.cache/resume.json');
const OUT_PDF = join(ROOT, 'public/cv.pdf');

const yaml = await readFile(YAML_PATH, 'utf8');
const data = parseYaml(yaml);

await mkdir(dirname(CACHE_JSON), { recursive: true });
await writeFile(CACHE_JSON, JSON.stringify(data));
await mkdir(dirname(OUT_PDF), { recursive: true });

// Typst resolves data paths relative to the template's parent dir,
// so pass the cache path as `.cache/resume.json` (resume/.cache/resume.json).
const args = [
  'compile',
  '--font-path',
  FONTS_DIR,
  '--ignore-system-fonts',
  '--input',
  'data=.cache/resume.json',
  TEMPLATE,
  OUT_PDF,
];

const t0 = Date.now();
const r = spawnSync('typst', args, { stdio: 'inherit' });
if (r.error) {
  console.error('Failed to invoke typst — is it installed and on PATH?');
  console.error(r.error);
  process.exit(1);
}
if (r.status !== 0) process.exit(r.status ?? 1);

console.log(`✓ ${OUT_PDF} (${Date.now() - t0} ms)`);
