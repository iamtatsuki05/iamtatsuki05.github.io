import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = path.dirname(fileURLToPath(import.meta.url));

function normalizeBasePath(input) {
  if (!input || input === '/') return undefined;
  const stripped = input.replace(/^\/+|\/+$/g, '');
  return stripped ? `/${stripped}` : undefined;
}

export default defineConfig({
  output: 'static',
  outDir: './out',
  publicDir: './public',
  base: normalizeBasePath(process.env.PUBLIC_BASE_PATH || process.env.NEXT_PUBLIC_BASE_PATH),
  integrations: [react()],
  vite: {
    resolve: {
      alias: {
        '@': path.resolve(rootDir, './src'),
      },
    },
  },
});
