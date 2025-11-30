import React, { useMemo } from 'react';
import type { BlogPost } from '@/lib/content/blog';
import { formatDate } from '@/lib/date';
import { SectionHeader } from './SectionHeader';
import { ContentCardList } from './ContentCardList';

type Props = {
  posts: BlogPost[];
  locale: 'ja' | 'en';
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
        href: `/blogs/${post.slug}/`,
        date: formatDate(post.date, locale === 'ja' ? 'ja' : 'en'),
        linkTestId: 'home-latest-blog-link',
      })),
    [posts, locale],
  );

  return (
    <section id="blog">
      <SectionHeader title={title} ctaLabel={ctaLabel} ctaHref="/blogs/" />
      <ContentCardList
        items={items}
        listTestId="home-latest-blog-list"
        cardTestId="home-latest-blog-card"
      />
    </section>
  );
}
