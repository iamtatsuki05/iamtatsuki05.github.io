import path from 'path';
import { fileURLToPath } from 'url';
import type { StorybookConfig } from '@storybook/react-vite';

const dirname = path.dirname(fileURLToPath(import.meta.url));

const config: StorybookConfig = {
  stories: ['../src/components/**/*.stories.@(ts|tsx)'],
  addons: ['@storybook/addon-docs'],
  staticDirs: ['../public'],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  docs: {
    autodocs: 'tag',
  },
  viteFinal: async (baseConfig) => ({
    ...baseConfig,
    resolve: {
      ...(baseConfig.resolve || {}),
      alias: {
        ...(baseConfig.resolve?.alias || {}),
        '@': path.resolve(dirname, '..', 'src'),
      },
    },
  }),
};

export default config;
