import type { Meta, StoryObj } from '@storybook/react';
import { Header } from '@/components/site/Header';

const meta = {
  title: 'Site/Header',
  component: Header,
  parameters: {
    layout: 'fullscreen',
    nextjs: {
      appDirectory: true,
      navigation: { pathname: '/' },
    },
  },
  tags: ['autodocs'],
  render: () => (
    <div className="min-h-[320px] bg-gradient-to-b from-white via-white to-gray-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-950">
      <Header />
      <div className="container mx-auto max-w-4xl px-4 py-6 text-sm text-gray-600 dark:text-gray-300">
        コンテンツのプレビュー領域です。メニューのハイライトやテーマ切替を確認できます。
      </div>
    </div>
  ),
} satisfies Meta<typeof Header>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const BlogActive: Story = {
  parameters: {
    nextjs: {
      appDirectory: true,
      navigation: { pathname: '/blogs/' },
    },
  },
};
