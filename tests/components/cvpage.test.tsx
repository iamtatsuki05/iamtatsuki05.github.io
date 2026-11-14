import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { CvPage } from '@/components/pages/CvPage';
import type { Publication } from '@/lib/content/publication';

const publications: Publication[] = [
  {
    slug: 'demo',
    title: 'Demo paper',
    type: 'paper',
    venueType: 'conference',
    region: 'international',
    refereed: true,
    venue: 'AACL-IJCNLP 2026 System Demonstrations',
    publishedAt: '2026-11',
    authors: ['Tatsuki Okada', 'Yusuke Sakai'],
    links: [{ kind: 'paper', url: 'https://example.com/paper' }],
    tags: [],
  },
  { slug: 'tool', title: 'A tool', type: 'app', authors: [], links: [], tags: [] },
];

const emptyCv = { education: [], grants: [], awards: [] };

describe('CvPage', () => {
  it('lists only papers, under their group, and marks the owner in the author list', () => {
    render(<CvPage locale="en" cv={emptyCv} publications={publications} alias="Name" affiliation="Affiliation" />);

    const group = screen.getByTestId('cv-papers-conference-international-refereed');
    expect(within(group).getByText('International Conferences (Refereed)')).toBeInTheDocument();
    expect(within(group).getByRole('link', { name: 'Demo paper' })).toHaveAttribute('href', 'https://example.com/paper');
    expect(within(group).getByText('Tatsuki Okada').tagName).toBe('STRONG');
    expect(screen.queryByText('A tool')).toBeNull();
  });

  it('hides sections that have no entries', () => {
    render(<CvPage locale="ja" cv={emptyCv} publications={[]} alias="氏名" affiliation="所属" />);
    expect(screen.queryByRole('heading', { level: 2, name: '🎓 学歴' })).toBeNull();
    expect(screen.queryByRole('heading', { level: 2, name: '📚 論文' })).toBeNull();
  });

  it('shows education with an ongoing period in the page language', () => {
    const cv = { ...emptyCv, education: [{ start: '2026-04', title: { ja: '大学院', en: 'Graduate school' } }] };
    render(<CvPage locale="ja" cv={cv} publications={[]} alias="氏名" affiliation="所属" />);
    expect(screen.getByRole('heading', { level: 2, name: '🎓 学歴' })).toBeInTheDocument();
    expect(screen.getByText('2026.04 – 現在')).toBeInTheDocument();
    expect(screen.getByText('大学院')).toBeInTheDocument();
  });

  it('points work experience to LinkedIn', () => {
    render(<CvPage locale="en" cv={emptyCv} publications={[]} alias="Name" affiliation="Affiliation" />);
    expect(screen.getByRole('heading', { level: 2, name: '💼 Experience' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'LinkedIn' })).toHaveAttribute('href', 'https://www.linkedin.com/in/iamtatsuki05');
  });

  it('lists talks and awards with the awarded paper linked', () => {
    const items: Publication[] = [
      { ...publications[0], award: 'Best Demo Award' },
      { slug: 'talk', title: 'Invited talk', type: 'talk', publishedAt: '2026-06', authors: [], links: [], tags: [] },
    ];
    const cv = { ...emptyCv, awards: [{ date: '2025-01', title: { ja: '奨励賞', en: 'Encouragement Award' } }] };
    render(<CvPage locale="en" cv={cv} publications={items} alias="Name" affiliation="Affiliation" />);

    expect(screen.getByRole('heading', { level: 2, name: '🎤 Talks' })).toBeInTheDocument();
    expect(screen.getByText('Invited talk')).toBeInTheDocument();
    const titles = screen.getAllByTestId('cv-entry').map((li) => within(li).getByRole('heading', { level: 3 }).textContent);
    expect(titles).toEqual(['Best Demo Award', 'Encouragement Award']);
    const paperAward = screen.getAllByTestId('cv-entry')[0];
    expect(within(paperAward).getByRole('link', { name: 'Demo paper' })).toHaveAttribute('href', 'https://example.com/paper');
  });

  it('hides talks when there are none', () => {
    render(<CvPage locale="ja" cv={emptyCv} publications={publications} alias="氏名" affiliation="所属" />);
    expect(screen.queryByRole('heading', { level: 2, name: '🎤 発表' })).toBeNull();
  });
});
