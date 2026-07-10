#!/usr/bin/env bun
import { createHash } from 'node:crypto';
import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import matter from 'gray-matter';
import sharp from 'sharp';
import type { ManifestEntry } from '@/lib/content/blogHeaderImages';

// 外部ホストのブログヘッダー画像をビルド時に取得し、モバイル向けの responsive WebP を
// self-host する。取得失敗時は manifest に載せず、ページ側は元 URL に fallback する。
const BLOG_DIR = path.join(process.cwd(), 'src', 'content', 'blogs');
const CACHE_DIR = path.join(process.cwd(), '.cache', 'blog-header-images');
const OUTPUT_DIR = path.join(process.cwd(), 'public', 'images', 'blog-headers');
const MANIFEST_PATH = path.join(process.cwd(), 'src', 'data', 'blog-header-images.json');

export const BLOG_HEADER_IMAGE_WIDTHS = [480, 960, 1440] as const;

function urlHash(url: string) {
  return createHash('sha1').update(url).digest('hex').slice(0, 12);
}

async function collectRemoteHeaderImageUrls() {
  const files = await readdir(BLOG_DIR);
  const urls = new Set<string>();
  for (const file of files) {
    if (!/\.mdx?$/.test(file)) continue;
    const raw = await readFile(path.join(BLOG_DIR, file), 'utf8');
    const headerImage = matter(raw).data?.headerImage;
    if (typeof headerImage === 'string' && /^https?:\/\//.test(headerImage)) {
      urls.add(headerImage);
    }
  }
  return [...urls];
}

async function fetchWithCache(url: string): Promise<Buffer | null> {
  const cachePath = path.join(CACHE_DIR, `${urlHash(url)}.bin`);
  try {
    return await readFile(cachePath);
  } catch {
    // キャッシュ未作成時のみ取得する
  }
  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(20_000) });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const buffer = Buffer.from(await response.arrayBuffer());
    // 200 でも HTML エラーページ等が返ることがあるため、画像として読めたものだけキャッシュする
    await sharp(buffer).metadata();
    await writeFile(cachePath, buffer);
    return buffer;
  } catch (error) {
    console.warn(`[blog-header-images] fetch failed, falling back to remote URL: ${url}`, error);
    return null;
  }
}

export async function generateBlogHeaderImages() {
  await mkdir(CACHE_DIR, { recursive: true });
  await mkdir(OUTPUT_DIR, { recursive: true });
  await mkdir(path.dirname(MANIFEST_PATH), { recursive: true });

  const manifest: Record<string, ManifestEntry> = {};
  for (const url of await collectRemoteHeaderImageUrls()) {
    try {
      const source = await fetchWithCache(url);
      if (!source) continue;

      const hash = urlHash(url);
      const metadata = await sharp(source).metadata();
      const sourceWidth = metadata.width ?? 0;
      const sourceHeight = metadata.height ?? 0;
      if (!sourceWidth || !sourceHeight) {
        console.warn(`[blog-header-images] could not read dimensions, skipping: ${url}`);
        continue;
      }

      const widths: number[] = BLOG_HEADER_IMAGE_WIDTHS.filter((w) => w <= sourceWidth);
      if (widths.length === 0) widths.push(sourceWidth);
      await Promise.all(
        widths.map((width) =>
          sharp(source)
            .resize(width)
            .webp({ quality: 78 })
            .toFile(path.join(OUTPUT_DIR, `${hash}-w${width}.webp`)),
        ),
      );

      manifest[url] = {
        prefix: `/images/blog-headers/${hash}-`,
        widths,
        width: sourceWidth,
        height: sourceHeight,
      };
    } catch (error) {
      // 1 件の失敗でビルド全体を止めず、そのページは元 URL のまま配信する
      console.warn(`[blog-header-images] optimization failed, falling back to remote URL: ${url}`, error);
    }
  }

  await writeFile(MANIFEST_PATH, `${JSON.stringify(manifest, null, 2)}\n`);
  console.log(`[blog-header-images] optimized ${Object.keys(manifest).length} header image(s)`);
  return manifest;
}

if (import.meta.main) {
  await generateBlogHeaderImages();
}
