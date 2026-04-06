import type { Locale } from '@/lib/i18n';

export type NavItemDef = { href: string; label: Record<Locale, string> };
export type NavDisplayItem = { href: string; label: string };

const NAV_ITEMS: NavItemDef[] = [
  { href: '/', label: { ja: '🏠 Home', en: '🏠 Home' } },
  { href: '/links/', label: { ja: '🔗 Links', en: '🔗 Links' } },
  { href: '/hobbies/', label: { ja: '🧸 Hobbies', en: '🧸 Hobbies' } },
  { href: '/publications/', label: { ja: '📚 Publications', en: '📚 Publications' } },
  { href: '/blogs/', label: { ja: '📝 Blog', en: '📝 Blog' } },
];

export function resolveNavItems(locale: Locale): NavDisplayItem[] {
  return NAV_ITEMS.map((item) => ({ href: item.href, label: item.label[locale] }));
}
