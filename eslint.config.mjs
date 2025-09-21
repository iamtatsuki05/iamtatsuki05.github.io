import path from 'node:path';
import { fileURLToPath } from 'node:url';
import globals from 'globals';
import { FlatCompat } from '@eslint/eslintrc';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const compat = new FlatCompat({ baseDirectory: __dirname });

/** @type {import('eslint').Linter.FlatConfig[]} */
const config = [
  {
    ignores: ['.next/**', 'out/**', 'node_modules/**', '.cache/**'],
  },
  ...compat.extends('next/core-web-vitals'),
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    rules: {
      '@next/next/no-img-element': 'off',
    },
  },
];

export default config;
