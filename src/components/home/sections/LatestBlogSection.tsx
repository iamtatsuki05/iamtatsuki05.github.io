import { useMemo } from 'react';
import type { BlogPost } from '@/lib/content/blog';
import { formatDate } from '@/lib/date';
import { SectionHeader } from './SectionHeader';
import { ContentCardList } from './ContentCardList';
import { SectionShell } from '@/components/home/SectionShell';
import type { Locale } from '@/lib/i18n';
import { localizedPath } from '@/lib/routing';

type Props = {
  posts: BlogPost[];
  locale: Locale;
  title: string;
  ctaLabel: string;
};

export function LatestBlogSection({ posts, locale, title, ctaLabel }: Props) {
  const items = useMemo(
    () =>
      posts.map((post) => ({
        key: post.slug,
        title: post.title,
        description: post.summary,
        href: localizedPath(`/blogs/${post.slug}/`, locale),
        date: formatDate(post.date, locale),
        linkTestId: 'home-latest-blog-link',
      })),
    [posts, locale],
  );

  return (
    <SectionShell id="blog" tone="amber">
      <SectionHeader title={title} ctaLabel={ctaLabel} ctaHref={localizedPath('/blogs/', locale)} tone="amber" />
      <ContentCardList
        items={items}
        listTestId="home-latest-blog-list"
        cardTestId="home-latest-blog-card"
      />
    </SectionShell>
  );
}
