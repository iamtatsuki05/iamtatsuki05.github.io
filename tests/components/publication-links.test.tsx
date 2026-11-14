import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { PublicationLinks } from '@/components/publications/PublicationLinks';
import { PublicationLinkKind } from '@/lib/content/types';

describe('PublicationLinks', () => {
  it('renders a labelled, icon-decorated external chip for every link kind', () => {
    const links = PublicationLinkKind.options.map((kind) => ({ kind, url: `https://example.com/${kind}` }));
    render(<PublicationLinks links={links} />);

    for (const { kind, url } of links) {
      const anchor = document.querySelector(`a[data-kind="${kind}"]`);
      expect(anchor?.getAttribute('href')).toBe(url);
      expect(anchor?.getAttribute('target')).toBe('_blank');
      expect(anchor?.textContent?.trim()).not.toBe('');
      expect(anchor?.querySelector('svg[aria-hidden="true"]')).not.toBeNull();
    }
    expect(screen.getByRole('link', { name: 'PyPI' })).toHaveAttribute('href', 'https://example.com/pypi');
    expect(screen.getByRole('link', { name: 'Project' })).toHaveAttribute('href', 'https://example.com/project');
  });

  it('renders nothing without links', () => {
    const { container } = render(<PublicationLinks links={[]} />);
    expect(container).toBeEmptyDOMElement();
  });
});
