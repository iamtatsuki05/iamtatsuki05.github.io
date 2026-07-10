import { readFileSync } from 'node:fs';
import path from 'node:path';
import { withBasePath } from '@/lib/url';

// scripts/generate-blog-header-images.ts が生成する manifest。
// 未生成の場合(dev 直起動や取得失敗)は元 URL のまま配信する。
const MANIFEST_PATH = path.join(process.cwd(), 'src', 'data', 'blog-header-images.json');

export type ManifestEntry = {
  prefix: string;
  widths: number[];
  width: number;
  height: number;
};

export type OptimizedBlogHeaderImage = {
  src: string;
  srcSet: string;
};

let manifestCache: Record<string, ManifestEntry> | null = null;

function loadManifest(): Record<string, ManifestEntry> {
  if (manifestCache) return manifestCache;
  try {
    manifestCache = JSON.parse(readFileSync(MANIFEST_PATH, 'utf8'));
  } catch {
    console.warn('[blog-header-images] manifest not found; serving original header image URLs');
    manifestCache = {};
  }
  return manifestCache ?? {};
}

export function buildOptimizedBlogHeaderImage(entry: ManifestEntry): OptimizedBlogHeaderImage | null {
  if (entry.widths.length === 0) return null;
  const candidates = entry.widths.map((width) => `${withBasePath(`${entry.prefix}w${width}.webp`)} ${width}w`);
  const largest = entry.widths[entry.widths.length - 1];
  const src = withBasePath(`${entry.prefix}w${largest}.webp`);
  if (!src) return null;
  return { src, srcSet: candidates.join(', ') };
}

export function resolveOptimizedBlogHeaderImage(url?: string): OptimizedBlogHeaderImage | null {
  if (!url) return null;
  const entry = loadManifest()[url];
  if (!entry) return null;
  return buildOptimizedBlogHeaderImage(entry);
}
