import type { Meta, StoryObj } from '@storybook/react';
import { PublicationsSection } from './PublicationsSection';
import type { Publication } from '@/lib/content/publication';

const publications: Publication[] = [
  {
    slug: 'paper-cross-modal',
    title: 'Cross-Modal Representations for Lightweight NLP',
    type: 'paper',
    venue: 'Imaginary NLP 2024',
    publishedAt: '2024-05-01',
    authors: ['Tatsuki Okada', 'Research Partner'],
    links: [
      { kind: 'pdf', url: 'https://example.com/paper.pdf' },
      { kind: 'code', url: 'https://github.com/iamtatsuki05/sample' },
    ],
    tags: ['NLP', 'Multimodal'],
  },
  {
    slug: 'talk-oss-blog',
    title: 'OSSと個人ブログ運用の工夫',
    type: 'talk',
    venue: 'Tech Meetup',
    publishedAt: '2023-12-10',
    authors: ['Tatsuki Okada'],
    links: [{ kind: 'slides', url: 'https://example.com/slides.pdf' }],
    tags: ['Blog', 'SRE'],
  },
];

const meta = {
  title: 'Home/PublicationsSection',
  component: PublicationsSection,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  args: {
    publications,
    title: '📚 最近の公開物',
    ctaLabel: 'もっと見る',
  },
  render: (args) => (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-[320px]">
      <div className="container mx-auto max-w-4xl px-4 py-6">
        <PublicationsSection {...args} />
      </div>
    </div>
  ),
} satisfies Meta<typeof PublicationsSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Mobile: Story = {
  parameters: {
    viewport: { defaultViewport: 'mobile2' },
  },
};
