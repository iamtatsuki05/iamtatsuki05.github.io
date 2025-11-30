import type { Meta, StoryObj } from '@storybook/react';
import { ContentCardList } from './ContentCardList';

const items = [
  {
    key: 'blog-1',
    title: 'LLMで日常をちょっと便利にするメモ',
    description: '身近な作業をLLMで自動化したときのトライアルとTIL。',
    href: '/blogs/ai-daily-notes/',
    date: '2024-10-02',
  },
  {
    key: 'blog-2',
    title: 'ポートフォリオデザインを整理した話',
    description: '情報をそぎ落として読みやすさを上げたときの気付き。',
    href: '/blogs/portfolio-refresh/',
    date: '2024-08-20',
  },
  {
    key: 'pub-1',
    title: 'Cross-Modal Representations for Lightweight NLP',
    description: 'Imaginary NLP 2024',
    href: 'https://example.com/paper.pdf',
    external: true,
    date: '2024-05-01',
  },
  {
    key: 'pub-2',
    title: 'OSSと個人ブログ運用の工夫',
    description: 'Tech Meetup',
    href: 'https://example.com/slides.pdf',
    external: true,
    date: '2023-12-10',
  },
];

const meta = {
  title: 'Home/ContentCardList',
  component: ContentCardList,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  args: {
    items,
  },
  render: (args) => (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-[320px]">
      <div className="container mx-auto max-w-4xl px-4 py-6">
        <ContentCardList {...args} />
      </div>
    </div>
  ),
} satisfies Meta<typeof ContentCardList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Mobile: Story = {
  parameters: {
    viewport: { defaultViewport: 'mobile2' },
  },
};
