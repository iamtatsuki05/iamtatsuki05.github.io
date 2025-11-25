import type { OGData } from './types';

export type Provider = 'youtube' | 'twitter' | 'instagram' | 'other';

export function providerOf(u: string): Provider {
  try {
    const x = new URL(u);
    if (x.hostname === 'youtu.be' || x.hostname.endsWith('youtube.com')) return 'youtube';
    if (x.hostname === 'x.com' || x.hostname === 'twitter.com') return 'twitter';
    if (x.hostname.endsWith('instagram.com')) return 'instagram';
  } catch {}
  return 'other';
}

export function ytIdFrom(u: string): string {
  try {
    const x = new URL(u);
    if (x.hostname === 'youtu.be') return x.pathname.slice(1);
    if (x.hostname.endsWith('youtube.com')) {
      if (x.pathname.startsWith('/watch')) return x.searchParams.get('v') || '';
      if (x.pathname.startsWith('/shorts/')) return x.pathname.split('/')[2] || '';
    }
  } catch {}
  return '';
}

export function providerFallback(url: string): OGData | null {
  try {
    const u = new URL(url);
    // X (Twitter)
    if (u.hostname === 'x.com' || u.hostname === 'twitter.com') {
      const m = u.pathname.match(/^\/(?:i\/web|home)?\/?([^\/]+)\/status\/(\d+)/);
      const user = m?.[1];
      return { url, title: user ? `Tweet by @${user}` : 'Tweet', siteName: 'X (Twitter)' };
    }
    // YouTube
    if (u.hostname === 'youtu.be' || u.hostname.endsWith('youtube.com')) {
      let id = '';
      if (u.hostname === 'youtu.be') id = u.pathname.slice(1);
      else if (u.pathname.startsWith('/watch')) id = u.searchParams.get('v') || '';
      else if (u.pathname.startsWith('/shorts/')) id = u.pathname.split('/')[2] || '';
      if (id) {
        return {
          url,
          title: 'YouTube Video',
          siteName: 'YouTube',
          image: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
        };
      }
      return { url, siteName: 'YouTube' };
    }
    // Amazon (JP/Global)
    if (
      u.hostname.endsWith('amazon.co.jp') ||
      u.hostname.endsWith('amazon.com') ||
      u.hostname === 'amzn.to'
    ) {
      const asinMatch = u.pathname.match(/\/dp\/([A-Z0-9]{10})/i);
      const asin = asinMatch?.[1];
      return { url, title: asin ? `Amazon: ${asin}` : undefined, siteName: 'Amazon' };
    }
  } catch {}
  return null;
}

export function embedHtmlFor(provider: Provider, url: string): string | null {
  if (provider === 'youtube') {
    const id = ytIdFrom(url);
    if (!id) return null;
    const canonical = `https://www.youtube.com/watch?v=${id}`;
    return `<div class="rse-embed embed-video embed-youtube" data-provider="youtube" data-url="${canonical}"></div>`;
  }
  if (provider === 'twitter') {
    try {
      const x = new URL(url);
      const canonical = x.hostname === 'twitter.com' ? url : `https://twitter.com${x.pathname}`;
      return `<div class="rse-embed embed-social embed-twitter" data-provider="twitter" data-url="${canonical}"></div>`;
    } catch {
      return `<div class="rse-embed embed-social embed-twitter" data-provider="twitter" data-url="${url}"></div>`;
    }
  }
  if (provider === 'instagram') {
    return `<div class="rse-embed embed-social embed-instagram" data-provider="instagram" data-url="${url}"></div>`;
  }
  return null;
}
