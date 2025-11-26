import { PublicationsClient } from '@/app/publications/sections/PublicationsClient';
import { getAllPublications } from '@/lib/content/publication';
import type { Locale } from '@/lib/i18n';
import { publicationsPageCopy } from '@/app/(site)/_config/pageCopy';
import { Suspense } from 'react';

export async function PublicationsPage({ locale }: { locale: Locale }) {
  const copy = publicationsPageCopy[locale];
  const items = await getAllPublications();
  return (
    <div className="space-y-4">
      <div className="text-sm opacity-70">{copy.breadcrumb}</div>
      <h1 className="text-3xl font-bold">{copy.heading}</h1>
      <Suspense fallback={null}>
        <PublicationsClient items={items} locale={locale} />
      </Suspense>
    </div>
  );
}
