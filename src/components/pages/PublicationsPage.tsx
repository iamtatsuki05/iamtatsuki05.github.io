import { PublicationsClient } from '@/components/pages/PublicationsClient';
import type { Publication } from '@/lib/content/publication';
import type { Locale } from '@/lib/i18n';
import { publicationsPageCopy } from '@/lib/pageCopy';
import { Suspense } from 'react';

export function PublicationsPage({ locale, items }: { locale: Locale; items: Publication[] }) {
  const copy = publicationsPageCopy[locale];
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
