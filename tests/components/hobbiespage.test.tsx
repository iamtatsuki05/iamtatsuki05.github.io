import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { HobbiesPage } from '@/components/pages/HobbiesPage';
import type { BlogPost } from '@/lib/content/blog';

const cameraPost: BlogPost = {
  slug: 'camera-post',
  title: 'Camera post',
  date: '2026-01-01',
  tags: ['camera'],
  summary: 'summary',
};

describe('HobbiesPage', () => {
  it('links a hobby card to the blog list only when the hobby has related posts', () => {
    render(<HobbiesPage locale="en" posts={[cameraPost]} />);

    const cards = screen.getAllByTestId('hobby-card');
    const linked = cards.filter((card) => card.tagName === 'A');
    expect(linked).toHaveLength(1);
    expect(linked[0]).toHaveAttribute('href', expect.stringContaining('tags=camera'));
    expect(screen.getAllByText('See Blog Posts')).toHaveLength(1);
  });
});
