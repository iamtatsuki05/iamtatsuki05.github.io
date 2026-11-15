import { getScrollIconTransform, STILL_ICON_TRANSFORM } from '@/components/site/headerMotion';
import { writePreferredLocale } from '@/lib/localePreference';
import { extractLocaleFromPath } from '@/lib/routing';

type Theme = 'light' | 'dark' | 'system';
type ResolvedTheme = 'light' | 'dark';

const THEME_STORAGE_KEY = 'theme';
const MENU_ENTER_DELAY_MS = 16;
const MENU_ANIMATION_MS = 280;
const INDICATOR_INSET_PX = 4;
// Tailwind sees this literal here; LanguageSwitch.tsx leaves the active option uncolored until the pill shows.
const ACTIVE_OPTION_CLASS = 'text-[#2a143f]!';

function matches(query: string): boolean {
  return typeof window.matchMedia === 'function' && window.matchMedia(query).matches;
}

function initTheme(root: ParentNode) {
  const toggles = Array.from(root.querySelectorAll<HTMLButtonElement>('[data-theme-toggle]'));
  const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
  let theme: Theme = stored === 'light' || stored === 'dark' ? stored : 'system';

  const apply = () => {
    const resolved: ResolvedTheme =
      theme === 'system' ? (matches('(prefers-color-scheme: dark)') ? 'dark' : 'light') : theme;
    const html = document.documentElement;
    html.classList.toggle('dark', resolved === 'dark');
    html.classList.toggle('light', resolved === 'light');
    html.style.colorScheme = resolved;
    for (const toggle of toggles) {
      toggle.dataset.theme = resolved;
      toggle.dataset.nextTheme = resolved === 'dark' ? 'light' : 'dark';
    }
    return resolved;
  };

  apply();
  for (const toggle of toggles) {
    toggle.addEventListener('click', () => {
      theme = toggle.dataset.nextTheme === 'dark' ? 'dark' : 'light';
      window.localStorage.setItem(THEME_STORAGE_KEY, theme);
      apply();
    });
  }
  window.matchMedia?.('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (theme === 'system') apply();
  });
}

function initLanguageSwitches(root: ParentNode, pathname: string) {
  const locale = extractLocaleFromPath(pathname);
  if (locale) writePreferredLocale(locale);

  const groups = Array.from(root.querySelectorAll<HTMLElement>('[data-language-switch]'));
  const position = () => {
    for (const group of groups) {
      const indicator = group.querySelector<HTMLElement>('[data-testid="language-switch-indicator"]');
      const active = group.querySelector<HTMLElement>(
        `[data-language-option="${indicator?.dataset.activeLocale ?? ''}"]`,
      );
      if (!indicator || !active) continue;
      const groupRect = group.getBoundingClientRect();
      const optionRect = active.getBoundingClientRect();
      indicator.style.width = `${optionRect.width}px`;
      indicator.style.transform = `translateX(${optionRect.left - groupRect.left - INDICATOR_INSET_PX}px)`;
      indicator.style.opacity = '1';
      active.querySelector('[aria-current="true"]')?.classList.add(ACTIVE_OPTION_CLASS);
    }
  };
  position();
  window.addEventListener('resize', position);
}

function initMobileMenu(root: ParentNode) {
  const opener = root.querySelector<HTMLButtonElement>('[data-mobile-menu-open]');
  const template = root.querySelector<HTMLTemplateElement>('template[data-mobile-menu-template]');
  if (!opener || !template) return;

  let overlay: HTMLElement | null = null;
  let enterTimer: number | undefined;
  let exitTimer: number | undefined;
  let previousOverflow = '';
  const desktop = typeof window.matchMedia === 'function' ? window.matchMedia('(min-width: 1280px)') : null;

  const setState = (state: 'open' | 'closed') => {
    overlay?.setAttribute('data-state', state);
    overlay?.querySelector('[data-mobile-menu-panel]')?.setAttribute('data-state', state);
  };
  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') close();
  };
  const onDesktop = () => {
    if (desktop?.matches) close();
  };

  function unmount() {
    overlay?.remove();
    overlay = null;
    document.body.style.overflow = previousOverflow;
    window.removeEventListener('keydown', onKeyDown);
    desktop?.removeEventListener('change', onDesktop);
  }

  function close() {
    if (!overlay || overlay.getAttribute('aria-hidden') === 'true') return;
    window.clearTimeout(enterTimer);
    opener?.setAttribute('aria-expanded', 'false');
    overlay.setAttribute('aria-hidden', 'true');
    setState('closed');
    if (matches('(prefers-reduced-motion: reduce)')) unmount();
    else exitTimer = window.setTimeout(unmount, MENU_ANIMATION_MS);
  }

  function open() {
    window.clearTimeout(exitTimer);
    if (!overlay) {
      const fragment = template?.content.cloneNode(true) as DocumentFragment;
      overlay = fragment.querySelector<HTMLElement>('[data-mobile-menu-overlay]');
      if (!overlay) return;
      // Mounted on <body>: the header's backdrop-filter would otherwise become the fixed overlay's containing block.
      document.body.append(overlay);
      previousOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      overlay.addEventListener('click', close);
      overlay.querySelector('[data-mobile-menu-panel]')?.addEventListener('click', (event) => event.stopPropagation());
      overlay.querySelector('[data-mobile-menu-close]')?.addEventListener('click', close);
      for (const link of overlay.querySelectorAll('nav a')) {
        // Safari aborts the navigation when the link is removed before it fires, so close one tick later.
        link.addEventListener('click', () => window.setTimeout(close, 0));
      }
      window.addEventListener('keydown', onKeyDown);
      desktop?.addEventListener('change', onDesktop);
    }
    opener?.setAttribute('aria-expanded', 'true');
    overlay.setAttribute('aria-hidden', 'false');
    if (matches('(prefers-reduced-motion: reduce)')) setState('open');
    else enterTimer = window.setTimeout(() => setState('open'), MENU_ENTER_DELAY_MS);
    onDesktop();
  }

  opener.addEventListener('click', open);
}

function initIconMotion(root: ParentNode) {
  const icon = root.querySelector<HTMLElement>('[data-testid="header-personal-icon"]');
  if (!icon) return;
  if (matches('(prefers-reduced-motion: reduce)')) {
    icon.style.transform = STILL_ICON_TRANSFORM;
    return;
  }
  const update = () => {
    icon.style.transform = getScrollIconTransform(window.scrollY);
  };
  update();
  window.addEventListener('scroll', update, { passive: true });
}

export function initHeader(root: ParentNode = document) {
  const header = root.querySelector<HTMLElement>('[data-site-header]');
  if (!header) return;
  initTheme(header);
  initLanguageSwitches(header, header.dataset.currentPath ?? '');
  initMobileMenu(header);
  initIconMotion(header);
}
