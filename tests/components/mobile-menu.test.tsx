import React from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { MobileMenu } from '@/components/site/MobileMenu';
import { resolveNavItems } from '@/components/site/navItems';

const items = resolveNavItems('ja');

function renderMobileMenu(open: boolean, onClose = vi.fn()) {
  return render(
    <MobileMenu
      open={open}
      onClose={onClose}
      items={items}
      activePath="/"
      localePrefix=""
    />,
  );
}

describe('MobileMenu', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
  });

  it('開いた直後はclosed状態から始まり、アニメーション後にopenになる', () => {
    renderMobileMenu(true);

    expect(screen.getByRole('dialog')).toHaveAttribute('data-state', 'closed');

    act(() => {
      vi.advanceTimersByTime(16);
    });

    expect(screen.getByRole('dialog')).toHaveAttribute('data-state', 'open');
    expect(document.body.style.overflow).toBe('hidden');
  });

  it('閉じるとclosed状態に切り替わり、アニメーション後にアンマウントされる', () => {
    const onClose = vi.fn();
    const { rerender } = renderMobileMenu(true, onClose);

    act(() => {
      vi.advanceTimersByTime(16);
    });

    rerender(
      <MobileMenu
        open={false}
        onClose={onClose}
        items={items}
        activePath="/"
        localePrefix=""
      />,
    );

    expect(screen.getByRole('dialog', { hidden: true })).toHaveAttribute('data-state', 'closed');

    act(() => {
      vi.advanceTimersByTime(279);
    });

    expect(screen.getByRole('dialog', { hidden: true })).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(1);
    });

    expect(screen.queryByRole('dialog', { hidden: true })).not.toBeInTheDocument();
    expect(document.body.style.overflow).toBe('');
  });

  it('Escapeキーで閉じる', () => {
    const onClose = vi.fn();
    renderMobileMenu(true, onClose);

    act(() => {
      vi.advanceTimersByTime(16);
    });

    fireEvent.keyDown(window, { key: 'Escape' });

    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
