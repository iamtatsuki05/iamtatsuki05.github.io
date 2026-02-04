import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Loading from '@/app/loading';

describe('app/loading', () => {
  it('ローディング表示を描画する', () => {
    render(<Loading />);

    expect(screen.getByLabelText('ページを読み込み中')).toBeInTheDocument();
    expect(screen.getByText('ページを読み込んでいます…')).toBeInTheDocument();
  });
});
