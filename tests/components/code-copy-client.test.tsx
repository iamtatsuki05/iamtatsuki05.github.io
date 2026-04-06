import React from 'react';
import { describe, it, expect, afterEach } from 'vitest';
import { CodeCopyClient } from '@/components/site/CodeCopyClient';
import { LOCALE_PREFERENCE_STORAGE_KEY } from '@/lib/localePreference';

afterEach(() => {
  window.localStorage.clear();
});

describe('CodeCopyClient', () => {
  it('injects japanese copy buttons by default', async () => {
    const { render, waitFor } = await import('@testing-library/react');

    render(
      <article className="prose">
        <pre>
          <code>const a = 1;</code>
        </pre>
        <CodeCopyClient />
      </article>,
    );

    await waitFor(() => expect(document.querySelector('.code-copy-btn')?.textContent).toBe('コピー'));
    expect(document.querySelector('.code-copy-btn')?.getAttribute('aria-label')).toBe('コードをコピー');
  });

  it('injects english copy buttons when english locale is stored', async () => {
    const { render, waitFor } = await import('@testing-library/react');

    window.localStorage.setItem(LOCALE_PREFERENCE_STORAGE_KEY, 'en');

    render(
      <article className="prose">
        <pre>
          <code>const a = 1;</code>
        </pre>
        <CodeCopyClient />
      </article>,
    );

    await waitFor(() => expect(document.querySelector('.code-copy-btn')?.textContent).toBe('Copy'));
    expect(document.querySelector('.code-copy-btn')?.getAttribute('aria-label')).toBe('Copy code');
  });
});
