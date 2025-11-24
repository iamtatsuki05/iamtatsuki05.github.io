import path from 'path';
import type { StorybookConfig } from '@storybook/nextjs';

const config: StorybookConfig = {
  stories: ['../src/components/**/*.stories.@(ts|tsx)'],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
  ],
  staticDirs: ['../public'],
  framework: {
    name: '@storybook/nextjs',
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
