import type { Meta, StoryObj } from '@storybook/react';
import { ProfileSection } from './ProfileSection';

const meta = {
  title: 'Home/ProfileSection',
  component: ProfileSection,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  args: {
    title: 'ホームページ',
    alias: '氏名：岡田 龍樹 | Tatsuki Okada',
    handle: 'ハンドルネーム: iamtatsuki05 | iam_tatsuki05',
    affiliation: '所属：芝浦工業大学 [杉本研究室](http://www.lang.ise.shibaura-it.ac.jp/)',
    intro: '自然言語処理 | 機械学習 | ソフトウェア のエンジニアをしています。\nちいかわのハチワレが好きで、かわいいキャラクター全般が好きです。仮想通貨、株、テクノロジーにも興味があります。',
  },
  render: (args) => (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-[320px]">
      <div className="container mx-auto max-w-4xl px-4 py-6">
        <ProfileSection {...args} />
      </div>
    </div>
  ),
} satisfies Meta<typeof ProfileSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
