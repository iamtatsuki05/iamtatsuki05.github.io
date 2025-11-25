import type { OGData } from './types';

function escapeHtml(s: string) {
  return s
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function prettyUrl(u: string): string {
  try {
    const x = new URL(u);
    let pathname = x.pathname;
    if (/amazon\.(co\.jp|com)$|amzn\.to$/.test(x.hostname)) {
      const m = pathname.match(/\/dp\/[A-Z0-9]{10}/i);
      pathname = m ? m[0] : pathname;
    }
    return `${x.hostname}${pathname}`;
  } catch {
    return u;
  }
}

export function makeCardHTML(u: string, og: OGData | null) {
  const host = (() => {
    try {
      return new URL(u).hostname;
    } catch {
      return u;
    }
  })();
  const title = og?.title || u;
  const desc = og?.description || '';
  const img = og?.image || '';
  const site = og?.siteName || host;
  const esc = (s?: string) => (s ? escapeHtml(s) : '');
  const noimg = !img;
  const imgTag = img
    ? `<div class="og-card__thumb"><img src="${esc(img)}" alt="" loading="lazy" referrerpolicy="no-referrer" /></div>`
    : '';
  const urlText = prettyUrl(u);
  return (
    `<a class="og-card card ${noimg ? 'og-card--noimg' : ''}" href="${esc(u)}" target="_blank" rel="noopener noreferrer">
      ${imgTag}
      <div class="og-card__body">
        <div class="og-card__site">${esc(site)}</div>
        <div class="og-card__title">${esc(title)}</div>
        ${desc ? `<div class=\"og-card__desc\">${esc(desc)}</div>` : ''}
        <div class="og-card__url">${esc(urlText)}</div>
      </div>
    </a>`
  );
}
