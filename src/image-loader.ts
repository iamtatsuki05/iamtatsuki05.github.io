const OPTIMIZED_IMAGE_WIDTHS = [16, 32, 48, 64, 96, 128, 256, 384, 640, 750, 828, 1080, 1200, 1920] as const;

export default function myImageLoader({ src, width, quality }: { src: string; width: number; quality?: number }) {
  const optimized = src.match(/^(.*\/nextImageExportOptimizer\/.+-opt-)(\d+)(\.(?:WEBP|AVIF|webp|avif))$/);
  if (optimized) {
    const requestedWidth = pickOptimizedWidth(width);
    return `${optimized[1]}${requestedWidth}${optimized[3]}`;
  }

  return `${src}?w=${width}&q=${quality || 75}`;
}

function pickOptimizedWidth(width: number) {
  return OPTIMIZED_IMAGE_WIDTHS.find((candidate) => candidate >= width) ?? OPTIMIZED_IMAGE_WIDTHS.at(-1);
}
