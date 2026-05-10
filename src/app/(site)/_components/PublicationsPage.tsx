import { PublicationsClient } from '@/app/publications/sections/PublicationsClient';
import { getAllPublications } from '@/lib/content/publication';
import type { Locale } from '@/lib/i18n';
import { publicationsPageCopy } from '@/app/(site)/_config/pageCopy';
import { Suspense } from 'react';

type PublicationItem = Awaited<ReturnType<typeof getAllPublications>>[number];

export async function PublicationsPage({ locale, items }: { locale: Locale; items?: PublicationItem[] }) {
  const copy = publicationsPageCopy[locale];
  const resolvedItems = items ?? (await getAllPublications());
  return (
    <div className="space-y-4">
      <div className="text-sm opacity-70">{copy.breadcrumb}</div>
      <h1 className="text-3xl font-bold">{copy.heading}</h1>
      <Suspense fallback={null}>
        <PublicationsClient items={resolvedItems} locale={locale} />
      </Suspense>
    </div>
  );
}
