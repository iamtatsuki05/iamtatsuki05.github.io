import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Image from 'next/image';
import { getAllPosts, getPostBySlug } from '@/lib/content/blog';
import { withBasePath } from '@/lib/url';
import { absoluteUrl } from '@/lib/seo';
import { CodeCopyClient } from '@/components/site/CodeCopyClient';
import { EmbedsClient } from '@/components/site/EmbedsClient';
import { buildArticleJsonLd, buildPageMetadata } from '@/lib/seo';
import { ShareButtons } from '@/components/blogs/ShareButtons';
import { BlogToc } from '@/components/blogs/BlogToc';
import { MarkdownCopyButton } from '@/components/blogs/MarkdownCopyButton';
import { BlogPostMeta } from '@/components/blogs/BlogPostMeta';

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

  const { title, date, updated, html, summary, headerImage, headerAlt, thumbnail, tags, markdown } = post;
  const shareUrl = absoluteUrl(`/blogs/${slug}/`);
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
    <div className="mx-auto w-full lg:grid lg:max-w-[1560px] lg:grid-cols-[minmax(0,1fr)_minmax(0,56rem)_minmax(0,1fr)] lg:items-start lg:gap-8">
      <article id="blog-article" className="prose dark:prose-invert w-full max-w-none lg:col-start-2">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
        {headerImage ? (
          <div className="relative mb-4 aspect-[16/9] w-full overflow-hidden rounded-sm border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
            <Image
              src={withBasePath(headerImage)!}
              alt={headerAlt || title}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, 720px"
              loading="lazy"
              priority={false}
              referrerPolicy="no-referrer"
            />
          </div>
        ) : null}
        <h1>{title}</h1>
        <BlogPostMeta date={date} updated={updated} />
        <div className="my-4 flex flex-wrap items-center gap-3">
          <ShareButtons url={shareUrl} title={title} className="my-0" />
          <MarkdownCopyButton markdown={markdown || ''} className="ml-auto" />
        </div>
        <div dangerouslySetInnerHTML={{ __html: html || '' }} />
        <CodeCopyClient />
        <EmbedsClient />
      </article>
      <BlogToc
        containerId="blog-article"
        className="min-[1440px]:col-start-3 min-[1440px]:justify-self-start min-[1440px]:w-full min-[1440px]:max-w-[clamp(14rem,24vw,20rem)]"
      />
    </div>
  );
}

function toIsoString(input?: string | null) {
  if (!input) return undefined;
  const date = new Date(input);
  if (Number.isNaN(date.getTime())) return undefined;
  return date.toISOString();
}
