import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getAllPosts, getPostBySlug } from '@/lib/content/blog';
import { formatDate } from '@/lib/date';
import { withBasePath } from '@/lib/url';
import { CodeCopyClient } from '@/components/site/CodeCopyClient';
import { EmbedsClient } from '@/components/site/EmbedsClient';

type Params = { slug: string };

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};
  const md: Metadata = {
    title: post.title,
    description: post.summary || undefined,
    openGraph: {
      title: post.title,
      description: post.summary || undefined,
      type: 'article',
    },
  };
  return md;
}

export default async function BlogPostPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return notFound();

  const { title, date, updated, html, summary, headerImage, headerAlt } = post;

  return (
    <article className="prose dark:prose-invert max-w-none">
      {headerImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={withBasePath(headerImage)}
          alt={headerAlt || title}
          className="mb-4 w-full h-auto rounded-sm border border-gray-200 dark:border-gray-700"
          loading="eager"
          decoding="async"
          fetchPriority="high"
          referrerPolicy="no-referrer"
        />
      ) : null}
      <h1>{title}</h1>
      <p className="mt-0! text-sm opacity-70">
        {formatDate(date, 'ja')}
        {updated ? `（更新: ${formatDate(updated, 'ja')}）` : ''}
      </p>
      {/* eslint-disable-next-line react/no-danger */}
      <div dangerouslySetInnerHTML={{ __html: html || '' }} />
      <CodeCopyClient />
      <EmbedsClient />
    </article>
  );
}
