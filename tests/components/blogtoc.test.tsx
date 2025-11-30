import React from 'react';
import { describe, it, expect, beforeEach } from 'vitest';
import { BlogToc } from '@/components/blogs/BlogToc';

describe('BlogToc', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <article id="blog-article">
        <h2 id="sec-1">セクション1</h2>
        <p>text</p>
        <h3 id="sub-1">サブ1</h3>
        <h2 id="sec-2">セクション2</h2>
      </article>
    `;
  });

  it('renders toc items from headings', async () => {
    const { render } = await import('@testing-library/react');
    const { getAllByText } = render(<BlogToc containerId="blog-article" />);
    expect(getAllByText('セクション1').length).toBeGreaterThan(0);
    expect(getAllByText('サブ1').length).toBeGreaterThan(0);
    expect(getAllByText('セクション2').length).toBeGreaterThan(0);
  });
});
