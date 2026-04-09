import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Card } from '@/components/ui/Card';

describe('Card', () => {
  it('adds pressable styling when rendered as a link', () => {
    render(
      <Card as="a" href="https://example.com">
        Example
      </Card>,
    );

    const link = screen.getByRole('link', { name: 'Example' });
    expect(link).toHaveClass('card');
    expect(link).toHaveClass('ui-layered-card');
    expect(link).toHaveClass('pressable-card');
  });

  it('keeps non-link cards static', () => {
    render(<Card>Static</Card>);

    const card = screen.getByText('Static').closest('div');
    expect(card).toHaveClass('card');
    expect(card).toHaveClass('ui-layered-card');
    expect(card).not.toHaveClass('pressable-card');
  });
});
