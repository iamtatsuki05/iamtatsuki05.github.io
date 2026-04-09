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
  it('renders an icon trigger and opens the japanese share menu', async () => {
    const { render } = await import('@testing-library/react');
    const userEvent = await import('@testing-library/user-event');

    const { getByRole, queryByText, getByText } = render(<ShareButtons url="https://example.com" title="Sample" />);
    const user = userEvent.default.setup();
    const button = getByRole('button', { name: '共有' });

    expect(queryByText('Xでシェア')).not.toBeInTheDocument();

    await user.click(button);

    expect(button).toHaveAttribute('aria-expanded', 'true');
    expect(getByText('Xでシェア')).toBeInTheDocument();
    expect(getByText('LinkedInでシェア')).toBeInTheDocument();
  });

  it('uses the stored english locale for share menu labels', async () => {
    const { render, waitFor } = await import('@testing-library/react');
    const userEvent = await import('@testing-library/user-event');

    window.localStorage.setItem(LOCALE_PREFERENCE_STORAGE_KEY, 'en');

    const { getByRole, getByText } = render(<ShareButtons url="https://example.com" title="Sample" />);
    const user = userEvent.default.setup();

    await waitFor(() => expect(getByRole('button', { name: 'Share' })).toBeInTheDocument());
    await user.click(getByRole('button', { name: 'Share' }));

    expect(getByText('Share on X')).toBeInTheDocument();
    expect(getByText('Share on LinkedIn')).toBeInTheDocument();
  });

  it('adds transient active state when triggering native share from the menu', async () => {
    const { render } = await import('@testing-library/react');
    const userEvent = await import('@testing-library/user-event');

    Object.defineProperty(navigator, 'share', {
      configurable: true,
      value: vi.fn().mockResolvedValue(undefined),
    });

    const { getByRole } = render(<ShareButtons url="https://example.com" title="Sample" />);
    const user = userEvent.default.setup();
    const trigger = getByRole('button', { name: '共有' });

    await user.click(trigger);

    const menuItem = getByRole('menuitem', { name: '共有' });
    await user.click(menuItem);

    expect(trigger).toHaveAttribute('data-state', 'active');
    expect(navigator.share).toHaveBeenCalledWith({ url: 'https://example.com', title: 'Sample' });
  });

  it('closes the menu when clicking outside', async () => {
    const { render } = await import('@testing-library/react');
    const userEvent = await import('@testing-library/user-event');

    const { getByRole, queryByText } = render(
      <div>
        <ShareButtons url="https://example.com" title="Sample" />
        <button type="button">outside</button>
      </div>,
    );
    const user = userEvent.default.setup();

    await user.click(getByRole('button', { name: '共有' }));
    expect(queryByText('Xでシェア')).toBeInTheDocument();

    await user.click(getByRole('button', { name: 'outside' }));
    expect(queryByText('Xでシェア')).not.toBeInTheDocument();
  });
});
