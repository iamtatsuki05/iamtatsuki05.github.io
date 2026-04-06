import React from 'react';
import { describe, it, expect, afterEach, vi } from 'vitest';
import { ShareButtons } from '@/components/blogs/ShareButtons';
import { LOCALE_PREFERENCE_STORAGE_KEY } from '@/lib/localePreference';

afterEach(() => {
  window.localStorage.clear();
  Object.defineProperty(navigator, 'share', {
    configurable: true,
    value: undefined,
  });
  vi.restoreAllMocks();
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

  it('adds transient active state when triggering native share', async () => {
    const { render } = await import('@testing-library/react');
    const userEvent = await import('@testing-library/user-event');

    Object.defineProperty(navigator, 'share', {
      configurable: true,
      value: vi.fn().mockResolvedValue(undefined),
    });

    const { getByRole } = render(<ShareButtons url="https://example.com" title="Sample" />);
    const user = userEvent.default.setup();
    const button = getByRole('button', { name: '共有' });

    await user.click(button);

    expect(button).toHaveAttribute('data-state', 'active');
    expect(navigator.share).toHaveBeenCalledWith({ url: 'https://example.com', title: 'Sample' });
  });
});
