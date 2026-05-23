#!/usr/bin/env bun
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

export const HOBBY_OPTIMIZED_IMAGE_WIDTHS = [16, 32, 48, 64, 96, 128, 256, 384, 640, 750, 828, 1080, 1200, 1920] as const;

const HOBBY_BITMAP_SOURCES = [
  { source: 'images/hobbies/gadgets.jpg', outputName: 'gadgets' },
  { source: 'images/hobbies/camera.jpg', outputName: 'camera' },
  { source: 'images/hobbies/tomoo.jpg', outputName: 'tomoo' },
  { source: 'images/hobbies/cute-characters.jpeg', outputName: 'cute-characters' },
] as const;

type GenerateHobbyOptimizedImagesOptions = {
  publicDir?: string;
  outputDir?: string;
  widths?: readonly number[];
};

export async function generateHobbyOptimizedImages({
  publicDir = path.join(process.cwd(), 'public'),
  outputDir = path.join(publicDir, 'images/hobbies/nextImageExportOptimizer'),
  widths = HOBBY_OPTIMIZED_IMAGE_WIDTHS,
}: GenerateHobbyOptimizedImagesOptions = {}) {
  await mkdir(outputDir, { recursive: true });

  const generatedFiles: string[] = [];

  for (const sourceImage of HOBBY_BITMAP_SOURCES) {
    const sourcePath = path.join(publicDir, sourceImage.source);
    const metadata = await sharp(sourcePath).metadata();
    const sourceWidth = metadata.width ?? Number.POSITIVE_INFINITY;

    for (const width of widths) {
      const outputPath = path.join(outputDir, `${sourceImage.outputName}-opt-${width}.WEBP`);

      await sharp(sourcePath)
        .rotate()
        .resize({
          width: Math.min(width, sourceWidth),
          withoutEnlargement: true,
        })
        .webp({ quality: 75 })
        .toFile(outputPath);

      generatedFiles.push(outputPath);
    }
  }

  return generatedFiles;
}

if (import.meta.main) {
  generateHobbyOptimizedImages()
    .then((generatedFiles) => {
      console.log(`generated ${generatedFiles.length} optimized hobby images`);
    })
    .catch((error) => {
      console.error('[generate-hobby-optimized-images] failed', error);
      process.exitCode = 1;
    });
}
