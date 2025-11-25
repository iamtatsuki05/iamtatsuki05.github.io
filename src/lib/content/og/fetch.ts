import { getOgCacheTtlMs, shouldDisableOgFetch } from '@/lib/config/env';
import type { OGData } from './types';
import { providerFallback } from './provider';

async function fetchProviderMeta(url: string): Promise<OGData | null> {
  try {
    const u = new URL(url);
    // YouTube oEmbed
    if (u.hostname === 'youtu.be' || u.hostname.endsWith('youtube.com')) {
      let canonical = url;
      if (u.hostname === 'youtu.be') {
        const id = u.pathname.slice(1);
        canonical = `https://www.youtube.com/watch?v=${id}`;
      }
      const o = await fetch(`https://www.youtube.com/oembed?format=json&url=${encodeURIComponent(canonical)}`);
      if (o.ok) {
        const j: any = await o.json();
        return { url, title: j.title, image: j.thumbnail_url, siteName: 'YouTube' };
      }
    }
    // X (Twitter) oEmbed（publish.twitter.com）
    if (u.hostname === 'x.com' || u.hostname === 'twitter.com') {
      const canonical = `https://twitter.com${u.pathname}`;
      const o = await fetch(`https://publish.twitter.com/oembed?omit_script=1&hide_thread=1&align=left&url=${encodeURIComponent(canonical)}`);
      if (o.ok) {
        const j: any = await o.json();
        const html: string = j.html || '';
        const p = html.match(/<p[^>]*>([\s\S]*?)<\/p>/i)?.[1] || '';
        const text = p
          .replace(/<br\s*\/>/gi, '\n')
          .replace(/<[^>]+>/g, '')
          .replace(/&amp;/g, '&')
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>')
          .replace(/&quot;/g, '"')
          .replace(/&#39;/g, "'")
          .trim();
        return { url, title: text || j.author_name || 'Tweet', siteName: 'X (Twitter)' };
      }
      return null;
    }
  } catch {}
  return null;
}

export async function fetchOG(url: string): Promise<OGData | null> {
  if (shouldDisableOgFetch()) {
    return { url };
  }
  try {
    // まずはプロバイダ専用の取得
    const provider = await fetchProviderMeta(url);
    if (provider) return { ...provider, fetchedAt: Date.now() };

    const res = await fetch(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'ja-JP,ja;q=0.9,en-US;q=0.8,en;q=0.7',
      },
      redirect: 'follow',
    });
    if (!res.ok) return providerFallback(url) || { url };
    const text = await res.text();
    const head = text.slice(0, 500_000);
    const data = extractMeta(head, url);
    // Amazon: 本文の productTitle を補助的に利用
    try {
      const u = new URL(url);
      if (/amazon\.(co\.jp|com)$|amzn\.to$/.test(u.hostname)) {
        if (!data.title) {
          const m = text.match(/<span[^>]*id=['"]productTitle['"][^>]*>([\s\S]*?)<\/span>/i);
          const t = m ? m[1].replace(/\s+/g, ' ').trim() : '';
          if (t) data.title = t;
        }
        data.siteName = data.siteName || 'Amazon';
      }
    } catch {}
    data.fetchedAt = Date.now();
    const hasAny = !!(data.title || data.image || data.description || data.siteName);
    return hasAny ? data : providerFallback(url) || data;
  } catch {
    // Provider専用フォールバック（ネットワーク不可/OGなし）
    return providerFallback(url);
  }
}

function extractMeta(html: string, url: string): OGData {
  const metaRe = /<meta\s+[^>]*>/gi;
  const attrRe = /(\w[\w:-]*)\s*=\s*(["'])(.*?)\2/gi;
  const map: Record<string, string> = {};
  const tags = html.match(metaRe) || [];
  for (const tag of tags) {
    let m: RegExpExecArray | null;
    let name: string | undefined;
    let content: string | undefined;
    while ((m = attrRe.exec(tag))) {
      const key = m[1].toLowerCase();
      const val = m[3];
      if (key === 'property' || key === 'name') name = val.toLowerCase();
      if (key === 'content') content = val;
    }
    if (name && content) {
      map[name] = content;
    }
  }
  const pick = (...keys: string[]) => {
    for (const k of keys) {
      if (map[k]) return map[k];
    }
    return undefined;
  };
  const data: OGData = {
    url,
    title: pick('og:title', 'twitter:title'),
    description: pick('og:description', 'twitter:description'),
    image: pick('og:image', 'twitter:image', 'twitter:image:src'),
    siteName: pick('og:site_name', 'twitter:site', 'twitter:domain'),
  };
  return data;
}

export function ogTtlMs(defaultTtl = getOgCacheTtlMs()): number {
  return defaultTtl;
}
