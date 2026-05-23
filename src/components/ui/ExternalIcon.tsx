"use client";

import { useState } from 'react';

type Props = {
  src: string;
  alt: string;
  size?: number;
  className?: string;
  fallbackLabel?: string;
};

export function ExternalIcon({ src, alt, size = 48, className = '', fallbackLabel }: Props) {
  const [failed, setFailed] = useState(false);
  const fallbackSize = Math.max(size * 0.72, 26);

  if (failed) {
    if (fallbackLabel) {
      return (
        <span
          aria-hidden="true"
          className="inline-flex items-center justify-center rounded-full bg-purple-100 text-sm font-semibold text-purple-700 dark:bg-purple-800/60 dark:text-purple-100"
          style={{ width: fallbackSize, height: fallbackSize }}
        >
          {fallbackLabel}
        </span>
      );
    }
    return null;
  }

  return (
    <img
      src={src}
      alt={alt}
      width={size}
      height={size}
      className={`mx-auto ${className}`}
      loading="eager"
      decoding="async"
      referrerPolicy="no-referrer"
      crossOrigin="anonymous"
      onError={() => setFailed(true)}
    />
  );
}
