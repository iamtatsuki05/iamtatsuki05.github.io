import Head from 'next/head';
import type { GetStaticProps, GetStaticPaths } from 'next';
import { getAllPosts, getPostBySlug } from '@/lib/content/blog';
import { formatDate } from '@/lib/date';
import { withBasePath } from '@/lib/url';
import { CodeCopyClient } from '@/components/site/CodeCopyClient';

type Props = {
  slug: string;
  title: string;
  date: string;
  updated: string | null;
  html: string;
  summary: string | null;
  headerImage?: string | null;
  headerAlt?: string | null;
  headings?: { id: string; title: string; level: number }[] | null;
};

export default function BlogPost({ title, date, updated, html, summary, headerImage, headerAlt, headings }: Props) {
  const hasToc = Array.isArray(headings) && headings.length >= 2;
  return (
    <article className="prose dark:prose-invert max-w-none">
      <Head>
        <title>{title}</title>
        {summary ? <meta name="description" content={summary} /> : null}
        <meta property="og:title" content={title} />
        {summary ? <meta property="og:description" content={summary} /> : null}
      </Head>
      {/* ヘッダー画像（存在する場合のみ） */}
      {/* 画像のパスは frontmatter.headerImage を使用（下の getStaticProps で渡す） */}
      {headerImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={withBasePath(headerImage)}
          alt={headerAlt || title}
          className="mb-4 w-full h-auto rounded-sm border border-gray-200 dark:border-gray-700"
        />
      ) : null}
      <h1>{title}</h1>
      <p className="mt-0! text-sm opacity-70">
        {formatDate(date, 'ja')}
        {updated ? `（更新: ${formatDate(updated, 'ja')}）` : ''}
      </p>
      {hasToc ? (
        <div className="not-prose border border-gray-200 dark:border-gray-800 rounded-md p-3 my-4 bg-white/60 dark:bg-gray-900/60">
          <p className="text-sm font-medium mb-2">目次</p>
          <ul className="text-sm space-y-1">
            {headings!.map((h) => (
              <li key={h.id} className={h.level === 3 ? 'pl-3' : ''}>
                <a href={`#${h.id}`} className="hover:underline">
                  {h.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
      <div dangerouslySetInnerHTML={{ __html: html }} />
      <CodeCopyClient />
    </article>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = await getAllPosts();
  return {
    paths: posts.map((p) => ({ params: { slug: p.slug } })),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<Props> = async (ctx) => {
  const slug = ctx.params?.slug as string;
  const post = await getPostBySlug(slug);
  if (!post) {
    return { notFound: true };
  }
  const props: Props = {
    slug,
    title: post.title,
    date: post.date,
    updated: post.updated ?? null,
    html: post.html || '',
    summary: post.summary ?? null,
    headerImage: post.headerImage || null,
    headerAlt: post.headerAlt || null,
    headings: post.headings || null,
  };
  return { props };
};
