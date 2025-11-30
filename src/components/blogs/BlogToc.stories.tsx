import type { Meta, StoryObj } from '@storybook/react';
import { BlogToc } from './BlogToc';

const meta = {
  title: 'Blogs/BlogToc',
  component: BlogToc,
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    containerId: 'demo-article',
  },
  render: (args) => (
    <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,3fr)_minmax(240px,1fr)] gap-6 bg-gray-50 dark:bg-gray-900 min-h-[300px] p-4">
      <article id="demo-article" className="prose dark:prose-invert max-w-none space-y-6">
        <h1>デモ記事タイトル</h1>
        <h2 id="sec-1">セクション1</h2>
        <p>本文</p>
        <h3 id="sub-1">サブ1</h3>
        <p>本文</p>
        <h2 id="sec-2">セクション2</h2>
        <p>本文</p>
        <h3 id="sub-2">サブ2</h3>
        <p>本文</p>
      </article>
      <BlogToc {...args} />
    </div>
  ),
  tags: ['autodocs'],
} satisfies Meta<typeof BlogToc>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Desktop: Story = {};

export const Mobile: Story = {
  parameters: {
    viewport: { defaultViewport: 'mobile2' },
  },
};
