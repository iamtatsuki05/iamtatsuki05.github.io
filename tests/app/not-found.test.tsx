import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import NotFound from '@/app/not-found';

describe('app/not-found', () => {
  it('404ページの見出しと導線を表示する', () => {
    render(<NotFound />);

    expect(screen.getByRole('heading', { name: 'ページが見つかりません' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'ホームへ戻る' })).toHaveAttribute('href', '/');
    expect(screen.getByRole('link', { name: 'ブログ一覧へ' })).toHaveAttribute('href', '/blogs/');
    expect(screen.getByRole('link', { name: 'リンク一覧へ' })).toHaveAttribute('href', '/links/');
  });
});
