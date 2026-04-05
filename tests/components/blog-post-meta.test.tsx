import React from 'react';
import { describe, it, expect, afterEach } from 'vitest';
import { BlogPostMeta } from '@/components/blogs/BlogPostMeta';
import { LOCALE_PREFERENCE_STORAGE_KEY } from '@/lib/localePreference';

afterEach(() => {
  window.localStorage.clear();
});

describe('BlogPostMeta', () => {
  it('renders japanese meta by default', async () => {
    const { render } = await import('@testing-library/react');
    const { getByText } = render(<BlogPostMeta date="2025-09-09" updated="2025-09-10" />);

    expect(getByText('2025/09/09（更新: 2025/09/10）')).toBeInTheDocument();
  });

  it('renders english meta when english locale is stored', async () => {
    const { render, waitFor } = await import('@testing-library/react');

    window.localStorage.setItem(LOCALE_PREFERENCE_STORAGE_KEY, 'en');

    const { getByText } = render(<BlogPostMeta date="2025-09-09" updated="2025-09-10" />);
    await waitFor(() => expect(getByText('2025-09-09 (Updated: 2025-09-10)')).toBeInTheDocument());
  });
});
