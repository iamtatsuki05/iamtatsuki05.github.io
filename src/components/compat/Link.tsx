import React from 'react';
import { withBasePath } from '@/lib/url';

type LinkProps = Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & {
  href: string | URL;
  prefetch?: boolean;
};

export default function Link({ href, prefetch: _prefetch, children, ...rest }: LinkProps) {
  const rawHref = typeof href === 'string' ? href : href.toString();
  const resolvedHref = /^([a-z][a-z\d+.-]*:|#)/i.test(rawHref) ? rawHref : withBasePath(rawHref);

  return (
    <a href={resolvedHref} {...rest}>
      {children}
    </a>
  );
}
