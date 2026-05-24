import type { Locale } from '@/lib/i18n';
import type { BlogPost } from '@/lib/content/blog';
import { blogAiWritingNotice, blogTranslationNotice } from '@/lib/blog/translation';

export function buildBlogRssDescription(post: BlogPost, locale: Locale, site: string) {
  const notices = [];
  if (locale !== 'ja') {
    const notice = blogTranslationNotice[locale];
    const originalUrl = `${site}/blogs/${post.slug}/`;
    notices.push(`${notice.label} ${notice.originalLinkLabel}: ${originalUrl}`);
  }
  if (post.aiAssisted) {
    notices.push(blogAiWritingNotice[locale]);
  }

  return [...notices, post.summary].filter(Boolean).join('\n\n');
}
