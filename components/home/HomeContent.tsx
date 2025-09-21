import type { Locale } from '@/lib/i18n';
import { dictionaries } from '@/lib/i18n';
import { getLatestPosts } from '@/lib/content/blog';
import { getAllPublications } from '@/lib/content/publication';
import { getLinks } from '@/lib/data/links';
import { HomeContentView } from '@/components/home/HomeContentView';

export default async function HomeContent({ locale }: { locale: Locale }) {
  const dict = dictionaries[locale];
  const [latest, publications, links] = await Promise.all([
    getLatestPosts(3),
    getAllPublications(),
    getLinks(),
  ]);

  return (
    <HomeContentView
      locale={locale}
      dict={dict}
      latest={latest.items}
      publications={publications.slice(0, 4)}
      links={links.slice(0, 6)}
    />
  );
}
