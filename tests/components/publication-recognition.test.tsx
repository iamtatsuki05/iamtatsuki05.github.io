import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { PublicationCard } from '@/components/publications/PublicationCard';

const base = { slug: 'p', title: 'Paper', links: [] };
const acceptance = { accepted: 11, submitted: 17, source: 'https://example.com/front-matter.pdf' };

describe('PublicationCard recognition', () => {
  it.each([
    ['ja', /^採択率 64\.7% \(11\/17\)$/],
    ['en', /^Acceptance rate 64\.7% \(11\/17\)$/],
    ['zh', /^录用率 64\.7% \(11\/17\)$/],
    // ICU versions differ on whether French puts U+00A0 or U+202F before the percent sign.
    ['fr', /^Taux d'acceptation 64,7[  ]% \(11\/17\)$/],
  ] as const)('shows the acceptance rate in %s and links to its source', (locale, label) => {
    render(<PublicationCard item={{ ...base, acceptance }} locale={locale} />);
    const stat = screen.getByTestId('publication-acceptance');
    expect(stat.textContent).toMatch(label);
    expect(stat).toHaveAttribute('href', acceptance.source);
  });

  it('shows an award badge', () => {
    render(<PublicationCard item={{ ...base, award: 'Best Demo Paper Award' }} locale="en" />);
    expect(screen.getByTestId('publication-award')).toHaveTextContent('🏆Best Demo Paper Award');
  });

  it('shows neither when unknown', () => {
    render(<PublicationCard item={base} locale="en" />);
    expect(screen.queryByTestId('publication-acceptance')).toBeNull();
    expect(screen.queryByTestId('publication-award')).toBeNull();
  });
});
