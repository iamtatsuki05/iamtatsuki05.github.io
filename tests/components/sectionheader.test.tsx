import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { SectionHeader } from '@/components/home/sections/SectionHeader';

describe('SectionHeader', () => {
  it('applies the shared cta interaction class', () => {
    render(<SectionHeader title="Latest posts" ctaLabel="See more" ctaHref="/blogs/" tone="amber" />);

    expect(screen.getByRole('link', { name: 'See more' })).toHaveClass('ui-cta');
    expect(screen.getByRole('link', { name: 'See more' })).toHaveClass('ui-section-cta');
  });

  it('applies the shared badge styling class', () => {
    render(<SectionHeader title="Latest posts" tone="amber" />);

    expect(screen.getByText('Latest posts', { selector: '.ui-section-badge' })).toHaveClass('ui-section-badge');
  });
});
