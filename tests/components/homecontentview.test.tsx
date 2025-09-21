import React from 'react';
import { render } from '@testing-library/react';
import { HomeContentView } from '@/components/home/HomeContentView';
import type { BlogPost } from '@/lib/content/blog';
import type { Publication } from '@/lib/content/publication';
import type { LinkItem } from '@/lib/data/links';

const dict = {
  title: 'ホームページ',
  intro: 'イントロ',
  alias: 'alias',
  handle: 'handle',
  affiliation: '所属',
  latest_blog: '最新のブログ',
  latest_pub: '最近の公開物',
  cta_more: 'もっと見る',
};

const latest: BlogPost[] = [
  {
    slug: 'sample-post',
    title: 'Sample Post',
    date: '2024-01-01',
    tags: [],
    summary: 'Summary',
  },
];

const publications: Publication[] = [
  {
    slug: 'paper-1',
    title: 'Paper 1',
    tags: [],
    type: 'paper',
    links: [{ kind: 'pdf', url: 'https://example.com' }],
    publishedAt: '2024-01-01',
  },
];

const links: LinkItem[] = [
  { title: 'GitHub', url: 'https://github.com' },
  { title: 'Twitter', url: 'https://twitter.com' },
  { title: 'Blog', url: 'https://blog.example.com' },
  { title: 'Extra', url: 'https://extra.example.com' },
];

describe('HomeContentView', () => {
  it('renders sections with provided data', () => {
    const { getByRole, getByText } = render(
      <HomeContentView
        locale="ja"
        dict={dict}
        latest={latest}
        publications={publications}
        links={links}
      />,
    );

    expect(getByRole('heading', { name: 'ホームページ' })).toBeVisible();
    expect(getByRole('heading', { name: '最新のブログ' })).toBeVisible();
    expect(getByRole('heading', { name: '最近の公開物' })).toBeVisible();
    expect(getByText('Sample Post')).toBeVisible();
    expect(getByText('Paper 1')).toBeVisible();
  });
});
