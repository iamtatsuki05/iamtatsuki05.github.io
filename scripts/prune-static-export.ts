#!/usr/bin/env bun
import { readdir, rm } from 'node:fs/promises';
import path from 'node:path';

const HOBBY_SOURCE_BITMAPS = [
  'images/hobbies/camera.jpg',
  'images/hobbies/cute-characters.jpeg',
  'images/hobbies/gadgets.jpg',
  'images/hobbies/tomoo.jpg',
];

async function main() {
  const outDir = path.join(process.cwd(), 'out');
  const optimizerDir = path.join(outDir, 'images/hobbies/nextImageExportOptimizer');
  const optimizerFiles = await readdir(optimizerDir).catch(() => []);
  const oversizedGeneratedImages = optimizerFiles.filter((file) => /-opt-(2048|3840)\.(WEBP|AVIF|webp|avif)$/.test(file));
  await Promise.all([
    ...HOBBY_SOURCE_BITMAPS.map((relativePath) =>
      rm(path.join(outDir, relativePath), { force: true }),
    ),
    ...oversizedGeneratedImages.map((file) => rm(path.join(optimizerDir, file), { force: true })),
  ]);
  console.log('pruned unused hobby bitmap assets from static export');
}

main().catch((error) => {
  console.error('[prune-static-export] failed', error);
  process.exitCode = 1;
});
