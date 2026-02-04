import type { Meta, StoryObj } from '@storybook/react';
import { LanguageSwitch } from './LanguageSwitch';

const meta = {
  title: 'Site/LanguageSwitch',
  component: LanguageSwitch,
  parameters: {
    layout: 'centered',
    nextjs: {
      navigation: { pathname: '/' },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof LanguageSwitch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Mobile: Story = {
  parameters: {
    viewport: { defaultViewport: 'mobile2' },
  },
};

export const NonTranslatablePage: Story = {
  parameters: {
    nextjs: {
      navigation: { pathname: '/ja/blogs/example-post/' },
    },
  },
};
