import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import GlobalErrorPage from '@/app/global-error';

describe('app/global-error', () => {
  let errorSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    errorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);
  });

  afterEach(() => {
    errorSpy.mockRestore();
  });

  it('再読み込みボタンを押すと reset を呼ぶ', async () => {
    const reset = vi.fn();
    const user = userEvent.setup();
    render(<GlobalErrorPage error={new Error('global error')} reset={reset} />);

    await user.click(screen.getByRole('button', { name: '再読み込みする' }));
    expect(reset).toHaveBeenCalledTimes(1);
  });

  it('ホームに戻るリンクを表示する', () => {
    render(<GlobalErrorPage error={new Error('global error')} reset={() => undefined} />);

    expect(screen.getByRole('link', { name: 'ホームへ戻る' })).toHaveAttribute('href', '/');
  });
});
