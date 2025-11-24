import type { Meta, StoryObj } from '@storybook/react';
import { LinksSection } from './LinksSection';
import type { LinkItem } from '@/lib/data/links';

const links: LinkItem[] = [
  {
    title: 'GitHub',
    url: 'https://github.com/iamtatsuki05',
    desc: 'ソースコードとプロジェクト',
    iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/github/github-original.svg',
    category: 'Social',
  },
  {
    title: 'X (Twitter)',
    url: 'https://x.com/iam_tatsuki05',
    desc: '日々の発信',
    iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/twitter/twitter-original.svg',
    category: 'Social',
  },
  {
    title: 'Instagram',
    url: 'https://www.instagram.com/iam_tatsuki05',
    desc: '写真・日常',
    iconUrl: 'https://raw.githubusercontent.com/rahuldkjain/github-profile-readme-generator/master/src/images/icons/Social/instagram.svg',
    category: 'Social',
  },
  {
    title: 'LinkedIn',
    url: 'https://www.linkedin.com/in/iamtatsuki05',
    desc: '職務経歴・プロフィール',
    iconUrl: 'https://raw.githubusercontent.com/rahuldkjain/github-profile-readme-generator/master/src/images/icons/Social/linked-in-alt.svg',
    category: 'Social',
  },
  {
    title: 'Huggingface',
    url: 'https://huggingface.co/iamtatsuki05',
    desc: 'モデル・データセット・アプリ',
    iconUrl: 'https://huggingface.co/front/assets/huggingface_logo-noborder.svg',
    category: 'Social',
  },
];

const meta = {
  title: 'Home/LinksSection',
  component: LinksSection,
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    links,
    ctaLabel: 'もっと見る',
  },
  tags: ['autodocs'],
  render: (args) => (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-[260px]">
      <div className="container mx-auto max-w-4xl px-4 py-6">
        <LinksSection {...args} />
      </div>
    </div>
  ),
} satisfies Meta<typeof LinksSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
