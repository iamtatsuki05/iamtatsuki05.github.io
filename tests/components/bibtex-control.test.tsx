import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { PublicationCard, type PublicationCardItem } from '@/components/publications/PublicationCard';
import { LOCALE_PREFERENCE_STORAGE_KEY } from '@/lib/localePreference';

const bibtex = '@inproceedings{okada-etal-2026-lenslapse,\n    title = "{L}ens{L}apse",\n    year = "2026"\n}';
const item: PublicationCardItem = {
  slug: 'lenslapse',
  title: 'LensLapse',
  links: [{ kind: 'paper', url: 'https://example.com/paper' }],
  bibtex,
};

function renderCard(overrides: Partial<PublicationCardItem> = {}, onOpen = vi.fn()) {
  render(
    <ul>
      <PublicationCard item={{ ...item, ...overrides }} onOpen={onOpen} />
    </ul>,
  );
  return onOpen;
}

afterEach(() => {
  window.localStorage.clear();
});

describe('BibtexControl on a publication card', () => {
  it('reveals the BibTeX on demand without opening the paper', async () => {
    const user = userEvent.setup();
    const onOpen = renderCard();
    const toggle = screen.getByRole('button', { name: 'BibTeXを表示' });
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    expect(screen.getByTestId('publication-bibtex-panel')).not.toBeVisible();

    await user.click(toggle);

    expect(toggle).toHaveAttribute('aria-expanded', 'true');
    expect(toggle).toHaveAccessibleName('BibTeXを閉じる');
    expect(screen.getByTestId('publication-bibtex-panel')).toBeVisible();
    expect(screen.getByLabelText('BibTeX')).toHaveTextContent('okada-etal-2026-lenslapse');
    expect(onOpen).not.toHaveBeenCalled();
  });

  it('copies the exact BibTeX and announces it', async () => {
    const user = userEvent.setup();
    const onOpen = renderCard();
    await user.click(screen.getByRole('button', { name: 'BibTeXを表示' }));
    await user.click(screen.getByRole('button', { name: 'コピー' }));

    await expect(navigator.clipboard.readText()).resolves.toBe(bibtex);
    await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent('コピーしました'));
    expect(onOpen).not.toHaveBeenCalled();
  });

  it('offers a .bib download named after the citation key', async () => {
    renderCard();
    const link = screen.getByRole('link', { name: '.bib をダウンロード', hidden: true });
    expect(link).toHaveAttribute('download', 'okada-etal-2026-lenslapse.bib');
    expect(decodeURIComponent(link.getAttribute('href') ?? '')).toBe(`data:application/x-bibtex;charset=utf-8,${bibtex}`);
  });

  it('uses the preferred locale for labels', async () => {
    window.localStorage.setItem(LOCALE_PREFERENCE_STORAGE_KEY, 'fr');
    renderCard();
    expect(await screen.findByRole('button', { name: 'Afficher le BibTeX' })).toBeInTheDocument();
  });

  it('shows no control for a paper without BibTeX', () => {
    renderCard({ bibtex: undefined });
    expect(screen.queryByTestId('publication-bibtex-toggle')).toBeNull();
  });
});
