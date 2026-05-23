import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';
afterEach(() => cleanup());

// Disable network OG fetches during tests
// @ts-ignore
process.env.OG_DISABLE_FETCH = 'true';

// IntersectionObserver mock for infinite scroll
class IO {
  constructor(_cb: any) {}
  observe() {}
  disconnect() {}
  unobserve() {}
}
// @ts-ignore
global.IntersectionObserver = IO;
