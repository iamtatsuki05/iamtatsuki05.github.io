import path from 'path';
import type { StorybookConfig } from '@storybook/nextjs-vite';

const config: StorybookConfig = {
  stories: ['../src/components/**/*.stories.@(ts|tsx)'],
  addons: ['@storybook/addon-docs'],
  staticDirs: ['../public', '../src/app'],
  framework: {
    name: '@storybook/nextjs-vite',
    options: {
      appDirectory: true,
    },
  },
  docs: {
    autodocs: 'tag',
  },
  webpackFinal: async (baseConfig) => {
    const resolve = baseConfig.resolve || {};
    resolve.alias = {
      ...(resolve.alias || {}),
      '@': path.resolve(__dirname, '..', 'src'),
    };
    return {
      ...baseConfig,
      resolve,
    };
  },
};

export default config;
