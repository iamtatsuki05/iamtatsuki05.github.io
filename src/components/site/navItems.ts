import type { Locale } from '@/lib/i18n';

export type NavItemDef = { href: string; label: Record<Locale, string> };
export type NavDisplayItem = { href: string; label: string };

const NAV_ITEMS: NavItemDef[] = [
  { href: '/', label: { ja: '🏠 Home', en: '🏠 Home', zh: '🏠 首页', fr: '🏠 Accueil' } },
  { href: '/links/', label: { ja: '🔗 Links', en: '🔗 Links', zh: '🔗 链接', fr: '🔗 Liens' } },
  { href: '/hobbies/', label: { ja: '🧸 Hobbies', en: '🧸 Hobbies', zh: '🧸 兴趣', fr: '🧸 Centres d’intérêt' } },
  {
    href: '/publications/',
    label: { ja: '📚 Publications', en: '📚 Publications', zh: '📚 公开成果', fr: '📚 Publications' },
  },
  { href: '/blogs/', label: { ja: '📝 Blogs', en: '📝 Blogs', zh: '📝 博客', fr: '📝 Articles' } },
];

export function resolveNavItems(locale: Locale): NavDisplayItem[] {
  return NAV_ITEMS.map((item) => ({ href: item.href, label: item.label[locale] }));
}
