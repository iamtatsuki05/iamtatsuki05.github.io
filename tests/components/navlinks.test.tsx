import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { NavLinks } from '@/components/site/NavLinks';
import { resolveNavItems } from '@/components/site/navItems';

describe('NavLinks', () => {
  const activePath = '/blogs/';
  const localePrefix = '';
  const items = resolveNavItems('ja');

  it('renders navigation items and marks active link', () => {
    render(<NavLinks items={items} activePath={activePath} localePrefix={localePrefix} />);

    const blogLink = screen.getByText('📝 Blog');
    expect(blogLink).toBeVisible();
    expect(blogLink.className).toContain('bg-gray-100');
  });

  it('calls onNavigate when a link is clicked', () => {
    const handler = vi.fn();
    render(
      <NavLinks
        items={items}
        activePath={activePath}
        localePrefix={localePrefix}
        onNavigate={handler}
      />,
    );

    fireEvent.click(screen.getByText('🏠 Home'));
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('renders vertical layout when orientation is vertical', () => {
    render(
      <NavLinks
        items={items}
        activePath="/"
        localePrefix=""
        orientation="vertical"
      />,
    );

    const nav = screen.getByRole('navigation');
    expect(nav.className).toContain('flex-col');
  });
});
