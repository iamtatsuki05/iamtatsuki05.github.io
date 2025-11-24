import type { Meta, StoryObj } from '@storybook/react';
import { LatestBlogSection } from './LatestBlogSection';
import type { BlogPost } from '@/lib/content/blog';

const posts: BlogPost[] = [
  {
    slug: 'ai-daily-notes',
    title: 'LLMで日常をちょっと便利にするメモ',
    date: '2024-10-02',
    tags: ['NLP'],
    summary: '身近な作業をLLMで自動化したときのトライアルとTIL。',
  },
  {
    slug: 'portfolio-refresh',
    title: 'ポートフォリオデザインを整理した話',
    date: '2024-08-20',
    tags: ['Design'],
    summary: '情報をそぎ落として読みやすさを上げたときの気付き。',
  },
];

const meta = {
  title: 'Home/LatestBlogSection',
  component: LatestBlogSection,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  args: {
    posts,
    locale: 'ja',
    title: '✨ 最新のブログ',
    ctaLabel: 'もっと見る',
  },
  render: (args) => (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-[320px]">
      <div className="container mx-auto max-w-4xl px-4 py-6">
        <LatestBlogSection {...args} />
      </div>
    </div>
  ),
} satisfies Meta<typeof LatestBlogSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const English: Story = {
  args: { locale: 'en', title: '✨ Latest Blog Posts', ctaLabel: 'See more' },
};
