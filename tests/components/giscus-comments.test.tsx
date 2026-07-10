import { act, render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { GiscusComments } from '@/components/blogs/GiscusComments';

describe('GiscusComments', () => {
  it('injects the giscus script with the article term and locale', () => {
    const { getByTestId } = render(<GiscusComments term="2026-05-24-next-to-astro-with-ai" locale="ja" />);

    const script = getByTestId('blog-comments').querySelector('script');
    expect(script).not.toBeNull();
    expect(script).toHaveAttribute('src', 'https://giscus.app/client.js');
    expect(script).toHaveAttribute('data-repo', 'iamtatsuki05/iamtatsuki05.github.io');
    expect(script).toHaveAttribute('data-mapping', 'specific');
    expect(script).toHaveAttribute('data-term', 'blog:2026-05-24-next-to-astro-with-ai');
    expect(script).toHaveAttribute('data-lang', 'ja');
    expect(script).toHaveAttribute('data-theme', 'light');
  });

  it('maps the zh locale to zh-CN and follows the current dark theme', () => {
    document.documentElement.classList.add('dark');
    try {
      const { getByTestId } = render(<GiscusComments term="post" locale="zh" />);
      const script = getByTestId('blog-comments').querySelector('script');
      expect(script).toHaveAttribute('data-lang', 'zh-CN');
      expect(script).toHaveAttribute('data-theme', 'dark');
    } finally {
      document.documentElement.classList.remove('dark');
    }
  });

  it('does not inject the script twice across re-renders', async () => {
    const { getByTestId, rerender } = render(<GiscusComments term="post" locale="en" />);
    await act(async () => {
      rerender(<GiscusComments term="post" locale="en" />);
    });
    expect(getByTestId('blog-comments').querySelectorAll('script')).toHaveLength(1);
  });
});
