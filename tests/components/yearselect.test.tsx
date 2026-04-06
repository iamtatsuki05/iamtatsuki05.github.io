import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { YearSelect } from '@/components/filters/YearSelect';

describe('YearSelect', () => {
  it('FilterDisclosure として年候補を表示し、複数選択の変更を通知する', async () => {
    const user = userEvent.setup();
    const onToggle = vi.fn();
    const onClear = vi.fn();

    render(
      <YearSelect
        years={['2025', '2024']}
        selected={new Set(['2025'])}
        onToggle={onToggle}
        onClear={onClear}
        label="Year"
      />,
    );

    const summary = screen.getByText('Year').closest('summary');
    if (!summary) throw new Error('Year summary is missing');

    await user.click(summary);
    await user.click(screen.getByRole('button', { name: '2024' }));
    await user.click(screen.getByRole('button', { name: 'All' }));

    expect(onToggle).toHaveBeenCalledWith('2024');
    expect(onClear).toHaveBeenCalledTimes(1);
    expect(summary).toHaveTextContent('(1)');
  });
});
