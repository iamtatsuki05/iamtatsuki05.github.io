import type { Metadata } from 'next';
import { getAllPublications } from '@/lib/content/publication';
import { PublicationsClient } from '@/app/publications/sections/PublicationsClient';
import { buildPageMetadata } from '@/lib/seo';

export const metadata: Metadata = buildPageMetadata({
  title: '公開物',
  description: '研究論文や記事、登壇資料など、岡田龍樹が携わった公開物の一覧です。',
  locale: 'ja',
  path: '/ja/publications/',
  languageAlternates: {
    'ja-JP': '/ja/publications/',
    'en-US': '/en/publications/',
    'x-default': '/publications/',
  },
});

export default async function PublicationsJa() {
  const items = await getAllPublications();
  return (
    <div className="space-y-4">
      <div className="text-sm opacity-70">🏠 Home / 📚 公開物</div>
      <h1 className="text-3xl font-bold">📚 公開物</h1>
      <PublicationsClient items={items} locale="ja" />
    </div>
  );
}
