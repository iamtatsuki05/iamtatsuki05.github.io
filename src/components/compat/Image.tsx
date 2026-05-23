import React from 'react';
import { withBasePath } from '@/lib/url';

type ImageProps = Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src' | 'width' | 'height'> & {
  src: string;
  alt: string;
  width?: number | `${number}`;
  height?: number | `${number}`;
  fill?: boolean;
  priority?: boolean;
  quality?: number | `${number}`;
};

export default function Image({
  src,
  alt,
  width,
  height,
  fill,
  priority,
  quality: _quality,
  loading,
  decoding,
  style,
  className,
  ...rest
}: ImageProps) {
  const resolvedLoading = loading ?? (priority ? 'eager' : undefined);
  const resolvedDecoding = decoding ?? (priority ? 'sync' : 'async');
  const fillStyle = fill
    ? ({
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        ...style,
      } satisfies React.CSSProperties)
    : style;

  return (
    <img
      {...rest}
      src={withBasePath(src)}
      alt={alt}
      width={fill ? undefined : width}
      height={fill ? undefined : height}
      loading={resolvedLoading}
      decoding={resolvedDecoding}
      fetchPriority={priority ? 'high' : rest.fetchPriority}
      className={className}
      style={fillStyle}
    />
  );
}
