import type { Metadata } from 'next';
import { getAllPublications } from '@/lib/content/publication';
import { PublicationsClient } from '@/app/publications/sections/PublicationsClient';
import { buildPageMetadata } from '@/lib/seo';

export const metadata: Metadata = buildPageMetadata({
  title: 'Publications',
  description: 'Academic publications, articles, and talks by Tatsuki Okada in the field of NLP and machine learning.',
  locale: 'en',
  path: '/en/publications/',
  languageAlternates: {
    'ja-JP': '/ja/publications/',
    'en-US': '/en/publications/',
    'x-default': '/publications/',
  },
});

export default async function PublicationsEn() {
  const items = await getAllPublications();
  return (
    <div className="space-y-4">
      <div className="text-sm opacity-70">🏠 Home / 📚 Publications</div>
      <h1 className="text-3xl font-bold">📚 Publications</h1>
      <PublicationsClient items={items} locale="en" />
    </div>
  );
}
