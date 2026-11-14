import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { PublicationCard } from '@/components/publications/PublicationCard';

const lenslapse = {
  slug: 'p',
  title: 'Paper',
  links: [],
  publishedAt: '2026-11',
  venue: 'AACL-IJCNLP 2026',
  venueFull: 'The 15th IJCNLP',
  pages: '66-73',
  location: 'Hengqin, China',
};

describe('PublicationCard venue citation', () => {
  it.each([
    ['en', 'The 15th IJCNLP (AACL-IJCNLP 2026), pp. 66–73, November 2026, Hengqin, China.'],
    ['fr', 'The 15th IJCNLP (AACL-IJCNLP 2026), pp. 66–73, novembre 2026, Hengqin, China.'],
    ['ja', 'The 15th IJCNLP (AACL-IJCNLP 2026), pp. 66–73, 2026年11月, Hengqin, China.'],
  ] as const)('formats the venue line in %s', (locale, text) => {
    render(<PublicationCard item={lenslapse} locale={locale} />);
    expect(screen.getByTestId('publication-venue')).toHaveTextContent(text);
  });

  it('writes a Japanese venue in Japanese and omits missing parts', () => {
    const item = { slug: 'j', title: 'J', links: [], publishedAt: '2025-03', venue: '言語処理学会第31回年次大会 (NLP2025)', pages: '1962-1967' };
    render(<PublicationCard item={item} locale="en" />);
    expect(screen.getByTestId('publication-venue')).toHaveTextContent('言語処理学会第31回年次大会 (NLP2025)、pp. 1962–1967、2025年3月。');
  });

  it('uses p. for a single page and skips the month without one', () => {
    render(<PublicationCard item={{ slug: 's', title: 'S', links: [], publishedAt: '2024', venue: 'Conf', pages: '5' }} locale="en" />);
    expect(screen.getByTestId('publication-venue')).toHaveTextContent(/^Conf, p\. 5\.$/);
  });

  it('keeps the date and venue line when no citation details exist', () => {
    render(<PublicationCard item={{ slug: 'o', title: 'O', links: [], publishedAt: '2024-12', venue: 'Conf' }} locale="en" />);
    expect(screen.queryByTestId('publication-venue')).toBeNull();
    expect(screen.getByText(/2024-12 ・/)).toBeInTheDocument();
  });
});
