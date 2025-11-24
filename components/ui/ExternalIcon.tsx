import React from 'react';
import { withBasePath } from '@/lib/url';

type Props = {
  src: string;
  alt: string;
  size?: number;
  className?: string;
};

// Simple helper to provide light/dark variants for Simple Icons CDN.
export function ExternalIcon({ src, alt, size = 48, className = '' }: Props) {
  const fallbackDataUri = (() => {
    const letter = (alt || '?').slice(0, 1).toUpperCase();
    const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='${size}' height='${size}' viewBox='0 0 ${size} ${size}'><rect width='100%' height='100%' rx='${size / 2}' fill='%23e5e7eb'/><text x='50%' y='55%' text-anchor='middle' font-size='${size / 2}' fill='%236b7280' font-family='Arial, sans-serif'>${letter}</text></svg>`;
    return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
  })();

  const handleError: React.ReactEventHandler<HTMLImageElement> = (e) => {
    const target = e.currentTarget;
    if (target.src === fallbackDataUri) return;
    target.src = fallbackDataUri;
  };

  const m = src.match(/^https?:\/\/cdn\.simpleicons\.org\/([^/]+)(?:\/([0-9a-fA-F]{3,6}))?$/);
  if (m) {
    const slug = m[1];
    const light = `https://cdn.simpleicons.org/${slug}`; // brand color
    const dark = `https://cdn.simpleicons.org/${slug}/ffffff`; // white on dark
    return (
      <picture>
        <source media="(prefers-color-scheme: dark)" srcSet={dark} />
        <img
          src={light}
          alt={alt}
          width={size}
          height={size}
          className={`mx-auto ${className}`}
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
          crossOrigin="anonymous"
          onError={handleError}
        />
      </picture>
    );
  }
  // Fallback: use same src and invert in dark mode
  return (
    <img
      src={src}
      alt={alt}
      width={size}
      height={size}
      className={`mx-auto dark:invert ${className}`}
      loading="lazy"
      decoding="async"
      referrerPolicy="no-referrer"
      crossOrigin="anonymous"
      onError={handleError}
    />
  );
}
