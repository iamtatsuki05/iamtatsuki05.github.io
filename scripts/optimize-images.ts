// 画像圧縮スクリプト（Squoosh WASM）
// 使用方法: bunx tsx scripts/optimize-images.ts
// 事前に: bun add -D @squoosh/lib

import { promises as fs } from 'node:fs';
import path from 'node:path';
import { ImagePool } from '@squoosh/lib';

async function ensureDir(dir: string) {
  await fs.mkdir(dir, { recursive: true });
}

async function optimizeOne(srcPath: string, outDir: string, baseName: string) {
  const pool = new ImagePool(1);
  const buf = await fs.readFile(srcPath);
  const image = pool.ingestImage(buf);

  // 出力: 160px 正方形相当（アイコン用途）と 320px
  await image.preprocess({ resize: { enabled: true, width: 160 } });
  await image.encode({ webp: { quality: 80 } });
  const { webp } = await image.encodedWith;
  await ensureDir(outDir);
  await fs.writeFile(path.join(outDir, `${baseName}-160.webp`), webp.binary);

  // 320px 版
  const image2 = pool.ingestImage(buf);
  await image2.preprocess({ resize: { enabled: true, width: 320 } });
  await image2.encode({ webp: { quality: 82 } });
  const { webp: webp2 } = await image2.encodedWith;
  await fs.writeFile(path.join(outDir, `${baseName}-320.webp`), webp2.binary);

  await pool.close();
}

async function main() {
  const publicDir = path.join(process.cwd(), 'public');
  const imagesDir = path.join(publicDir, 'images');
  const src = path.join(publicDir, 'favicon.ico');
  try {
    await fs.access(src);
  } catch {
    console.error('source not found:', src);
    process.exit(1);
  }
  const ext = path.extname(src).toLowerCase();
  if (ext !== '.jpeg' && ext !== '.jpg' && ext !== '.png') {
    console.warn('Skipping optimization: favicon.ico is not a JPEG/PNG source. Provide a JPEG or PNG if optimization is needed.');
    process.exit(0);
  }
  await optimizeOne(src, imagesDir, 'favicon');
  console.log('Optimized images written to public/images/favicon-160.webp and -320.webp');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
