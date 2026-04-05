import React from 'react';
import { describe, it, expect, afterEach } from 'vitest';
import { ShareButtons } from '@/components/blogs/ShareButtons';
import { LOCALE_PREFERENCE_STORAGE_KEY } from '@/lib/localePreference';

afterEach(() => {
  window.localStorage.clear();
});

describe('ShareButtons', () => {
  it('renders japanese share buttons by default', async () => {
    const { render } = await import('@testing-library/react');
    const { getByText } = render(<ShareButtons url="https://example.com" title="Sample" />);
    expect(getByText('共有')).toBeInTheDocument();
    expect(getByText('Xでシェア')).toBeInTheDocument();
    expect(getByText('LinkedInでシェア')).toBeInTheDocument();
  });

  it('uses the stored english locale for share button labels', async () => {
    const { render, waitFor } = await import('@testing-library/react');

    window.localStorage.setItem(LOCALE_PREFERENCE_STORAGE_KEY, 'en');

    const { getByText } = render(<ShareButtons url="https://example.com" title="Sample" />);
    await waitFor(() => expect(getByText('Share')).toBeInTheDocument());
    expect(getByText('Share on X')).toBeInTheDocument();
    expect(getByText('Share on LinkedIn')).toBeInTheDocument();
  });
});
