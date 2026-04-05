import React from 'react';
import { describe, it, expect, afterEach } from 'vitest';
import { MarkdownCopyButton } from '@/components/blogs/MarkdownCopyButton';
import { LOCALE_PREFERENCE_STORAGE_KEY } from '@/lib/localePreference';

afterEach(() => {
  window.localStorage.clear();
});

describe('MarkdownCopyButton', () => {
  it('shows copied state after clicking the button', async () => {
    const { render, waitFor } = await import('@testing-library/react');
    const userEvent = await import('@testing-library/user-event');

    const { getByRole } = render(<MarkdownCopyButton markdown="# title\n\nbody" />);
    const button = getByRole('button', { name: '記事のMarkdownをコピー' });
    const user = userEvent.default.setup();

    await user.click(button);

    await waitFor(() => expect(button).toHaveTextContent('コピーしました'));
  });

  it('uses the stored english locale for button labels', async () => {
    const { render, waitFor } = await import('@testing-library/react');
    const userEvent = await import('@testing-library/user-event');

    window.localStorage.setItem(LOCALE_PREFERENCE_STORAGE_KEY, 'en');

    const { getByRole } = render(<MarkdownCopyButton markdown="# title\n\nbody" />);
    const button = getByRole('button');
    const user = userEvent.default.setup();

    await waitFor(() => expect(button).toHaveTextContent('Copy Markdown'));
    expect(button).toHaveAttribute('aria-label', 'Copy article markdown');

    await user.click(button);

    await waitFor(() => expect(button).toHaveTextContent('Copied'));
  });

  it('is disabled when markdown is empty', async () => {
    const { render } = await import('@testing-library/react');

    const { getByRole } = render(<MarkdownCopyButton markdown="" />);
    expect(getByRole('button', { name: '記事のMarkdownをコピー' })).toBeDisabled();
  });
});
