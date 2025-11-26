import Image from 'next/image';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getAllPosts, getPostBySlug } from '@/lib/content/blog';
import { formatDate } from '@/lib/date';
import { CodeCopyClient } from '@/components/site/CodeCopyClient';
import { EmbedsClient } from '@/components/site/EmbedsClient';
import { buildArticleJsonLd, buildPageMetadata } from '@/lib/seo';

type Params = { slug: string };

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};

  const publishedTime = toIsoString(post.date);
  const modifiedTime = toIsoString(post.updated) || publishedTime;
  const description = post.summary || `${post.title} に関する記事です。`;
  const images = [post.headerImage, post.thumbnail].filter((src): src is string => Boolean(src));
  return buildPageMetadata({
    title: post.title,
    description,
    locale: 'ja',
    path: `/blogs/${slug}/`,
    type: 'article',
    images,
    keywords: post.tags,
    languageAlternates: {
      'ja-JP': `/blogs/${slug}/`,
      'x-default': `/blogs/${slug}/`,
    },
    publishedTime,
    modifiedTime,
    tags: post.tags,
  });
}

export default async function BlogPostPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return notFound();

  const { title, date, updated, html, summary, headerImage, headerAlt, thumbnail, tags } = post;
  const images = [headerImage, thumbnail].filter((src): src is string => Boolean(src));
  const articleJsonLd = buildArticleJsonLd({
    title,
    description: summary || `${title} に関する記事です。`,
    path: `/blogs/${slug}/`,
    image: images[0],
    datePublished: toIsoString(date) ?? date,
    dateModified: toIsoString(updated) ?? toIsoString(date) ?? date,
    tags,
  });

  return (
    <article className="prose dark:prose-invert max-w-none">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      {headerImage ? (
        <div className="relative mb-4 w-full aspect-video">
          <Image
            src={headerImage}
            alt={headerAlt || title}
            fill
            className="rounded-sm border border-gray-200 dark:border-gray-700 object-cover"
            priority
            sizes="(max-width: 768px) 100vw, 800px"
          />
        </div>
      ) : null}
      <h1>{title}</h1>
      <p className="mt-0! text-sm opacity-70">
        {formatDate(date, 'ja')}
        {updated ? `（更新: ${formatDate(updated, 'ja')}）` : ''}
      </p>
      <div dangerouslySetInnerHTML={{ __html: html || '' }} />
      <CodeCopyClient />
      <EmbedsClient />
    </article>
  );
}

function toIsoString(input?: string | null) {
  if (!input) return undefined;
  const date = new Date(input);
  if (Number.isNaN(date.getTime())) return undefined;
  return date.toISOString();
}
