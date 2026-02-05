import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import ErrorPage from '@/app/error';

describe('app/error', () => {
  let errorSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    errorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);
  });

  afterEach(() => {
    errorSpy.mockRestore();
  });

  it('再試行ボタンを押すと reset を呼ぶ', async () => {
    const reset = vi.fn();
    const user = userEvent.setup();
    render(<ErrorPage error={new Error('test error')} reset={reset} />);

    await user.click(screen.getByRole('button', { name: '再試行する' }));
    expect(reset).toHaveBeenCalledTimes(1);
  });

  it('ホームに戻るリンクを表示する', () => {
    render(<ErrorPage error={new Error('test error')} reset={() => undefined} />);

    expect(screen.getByRole('link', { name: 'ホームへ戻る' })).toHaveAttribute('href', '/');
  });
});
