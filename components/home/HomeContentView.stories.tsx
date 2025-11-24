import type { Meta, StoryObj } from '@storybook/react';
import { HomeContentView } from '@/components/home/HomeContentView';
import type { BlogPost } from '@/lib/content/blog';
import type { Publication } from '@/lib/content/publication';
import type { LinkItem } from '@/lib/data/links';
import ja from '@/locales/ja/common.json';
import en from '@/locales/en/common.json';

const sampleLatest: BlogPost[] = [
  {
    slug: 'ai-daily-notes',
    title: 'LLMで日常をちょっと便利にするメモ',
    date: '2024-10-02',
    tags: ['NLP'],
    summary: '身近な作業をLLMで自動化したときのトライアルとTIL。',
  },
  {
    slug: 'photo-walk-kyoto',
    title: '秋の京都で撮った写真セットアップ',
    date: '2024-09-10',
    tags: ['Photo'],
    summary: '街歩きで使った機材や設定を簡単にまとめました。',
  },
  {
    slug: 'portfolio-refresh',
    title: 'ポートフォリオデザインを整理した話',
    date: '2024-08-20',
    tags: ['Design'],
    summary: '情報をそぎ落として読みやすさを上げたときの気付き。',
  },
];

const samplePublications: Publication[] = [
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

const sampleLinks: LinkItem[] = [
  {
    title: 'GitHub',
    url: 'https://github.com/iamtatsuki05',
    iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/github/github-original.svg',
    desc: 'ソースコードとプロジェクト',
    category: 'Social',
  },
  {
    title: 'X (Twitter)',
    url: 'https://x.com/iam_tatsuki05',
    iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/twitter/twitter-original.svg',
    desc: '日々の発信',
    category: 'Social',
  },
  {
    title: 'Instagram',
    url: 'https://www.instagram.com/iam_tatsuki05',
    iconUrl: 'https://raw.githubusercontent.com/rahuldkjain/github-profile-readme-generator/master/src/images/icons/Social/instagram.svg',
    desc: '写真・日常',
    category: 'Social',
  },
  {
    title: 'LinkedIn',
    url: 'https://www.linkedin.com/in/iamtatsuki05',
    iconUrl: 'https://raw.githubusercontent.com/rahuldkjain/github-profile-readme-generator/master/src/images/icons/Social/linked-in-alt.svg',
    desc: '職務経歴・プロフィール',
    category: 'Social',
  },
  {
    title: 'Huggingface',
    url: 'https://huggingface.co/iamtatsuki05',
    iconUrl: 'https://huggingface.co/front/assets/huggingface_logo-noborder.svg',
    desc: 'モデル・データセット・アプリ',
    category: 'Social',
  },
];

const meta = {
  title: 'Home/HomeContentView',
  component: HomeContentView,
  parameters: {
    layout: 'fullscreen',
    nextjs: {
      appDirectory: true,
      navigation: { pathname: '/' },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof HomeContentView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Japanese: Story = {
  args: {
    locale: 'ja',
    dict: ja,
    latest: sampleLatest,
    publications: samplePublications,
    links: sampleLinks,
  },
};

export const English: Story = {
  args: {
    locale: 'en',
    dict: en,
    latest: sampleLatest,
    publications: samplePublications,
    links: sampleLinks,
  },
  parameters: {
    nextjs: {
      appDirectory: true,
      navigation: { pathname: '/en/' },
    },
  },
};
