import React from 'react';
import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';
afterEach(() => cleanup());
import { vi } from 'vitest';

// Disable network OG fetches during tests
// @ts-ignore
process.env.OG_DISABLE_FETCH = 'true';

// next/link mock (anchor passthrough)
vi.mock('next/link', () => {
  const Link = ({ href, children, prefetch: _prefetch, ...rest }: any) =>
    React.createElement('a', { href: typeof href === 'string' ? href : '#', ...rest }, children);
  return { __esModule: true, default: Link };
});

// next/navigation mock (pathname only)
vi.mock('next/navigation', () => ({
  usePathname: () => '/',
}));

// IntersectionObserver mock for infinite scroll
class IO {
  constructor(_cb: any) {}
  observe() {}
  disconnect() {}
  unobserve() {}
}
// @ts-ignore
global.IntersectionObserver = IO;
