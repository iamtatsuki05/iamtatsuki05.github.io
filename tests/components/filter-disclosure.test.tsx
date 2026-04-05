import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { FilterDisclosure } from '@/components/filters/FilterDisclosure';

describe('FilterDisclosure', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('summary clickで開閉状態をdata-stateに反映する', async () => {
    const user = userEvent.setup();

    render(
      <FilterDisclosure label="Tags" count={3}>
        <button type="button">#nlp</button>
      </FilterDisclosure>,
    );

    const summary = screen.getByText('Tags').closest('summary');
    const details = summary?.closest('details');
    if (!summary || !details) throw new Error('Filter disclosure is missing');

    expect(details).toHaveAttribute('data-state', 'closed');

    await user.click(summary);
    expect(details).toHaveAttribute('data-state', 'open');

    await user.click(summary);
    expect(details).toHaveAttribute('data-state', 'closed');
  });

  it('同じ親の別の disclosure を開くと前の disclosure を閉じる', async () => {
    const user = userEvent.setup();

    render(
      <div>
        <FilterDisclosure label="Types">
          <button type="button">paper</button>
        </FilterDisclosure>
        <FilterDisclosure label="Tags">
          <button type="button">#nlp</button>
        </FilterDisclosure>
      </div>,
    );

    const typesSummary = screen.getByText('Types').closest('summary');
    const tagsSummary = screen.getByText('Tags').closest('summary');
    const disclosures = document.querySelectorAll('details[data-filter-disclosure="true"]');
    if (!typesSummary || !tagsSummary || disclosures.length < 2) {
      throw new Error('Filter disclosures are missing');
    }

    await user.click(typesSummary);
    expect(disclosures[0]).toHaveAttribute('data-state', 'open');
    expect(disclosures[1]).toHaveAttribute('data-state', 'closed');

    await user.click(tagsSummary);
    expect(disclosures[0]).toHaveAttribute('data-state', 'closed');
    expect(disclosures[1]).toHaveAttribute('data-state', 'open');
  });

  it('親のフィルターバー幅を超えないようにパネル幅と位置を調整する', async () => {
    const user = userEvent.setup();

    render(
      <div data-filter-bar-root="true">
        <FilterDisclosure label="Tags" count={3}>
          <button type="button">#nlp</button>
        </FilterDisclosure>
      </div>,
    );

    const root = document.querySelector('[data-filter-bar-root="true"]');
    const summary = screen.getByText('Tags').closest('summary');
    const panel = document.querySelector('.filter-disclosure__panel');
    if (!root || !summary || !panel) {
      throw new Error('Filter disclosure elements are missing');
    }

    vi.spyOn(root, 'getBoundingClientRect').mockReturnValue({
      x: 40,
      y: 0,
      width: 180,
      height: 48,
      top: 0,
      left: 40,
      right: 220,
      bottom: 48,
      toJSON: () => ({}),
    });

    vi.spyOn(panel, 'getBoundingClientRect').mockReturnValue({
      x: 40,
      y: 56,
      width: 320,
      height: 120,
      top: 56,
      left: 40,
      right: 360,
      bottom: 176,
      toJSON: () => ({}),
    });

    await user.click(summary);

    expect(panel.style.getPropertyValue('--filter-disclosure-max-width')).toBe('164px');
    expect(Number.parseFloat(panel.style.getPropertyValue('--filter-disclosure-offset-x'))).toBeLessThan(0);
  });
});
