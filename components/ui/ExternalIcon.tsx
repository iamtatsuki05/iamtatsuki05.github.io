type Props = {
  src: string;
  alt: string;
  size?: number;
  className?: string;
};

// Simple helper to provide light/dark variants for Simple Icons CDN.
export function ExternalIcon({ src, alt, size = 48, className = '' }: Props) {
  const m = src.match(/^https?:\/\/cdn\.simpleicons\.org\/([^/]+)(?:\/([0-9a-fA-F]{3,6}))?$/);
  if (m) {
    const slug = m[1];
    const light = `https://cdn.simpleicons.org/${slug}`; // brand color
    const dark = `https://cdn.simpleicons.org/${slug}/ffffff`; // white on dark
    return (
      <picture>
        <source media="(prefers-color-scheme: dark)" srcSet={dark} />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={light}
          alt={alt}
          width={size}
          height={size}
          className={`mx-auto ${className}`}
          loading="lazy"
          decoding="async"
        />
      </picture>
    );
  }
  // Fallback: use same src and invert in dark mode
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      width={size}
      height={size}
      className={`mx-auto dark:invert ${className}`}
      loading="lazy"
      decoding="async"
    />
  );
}
