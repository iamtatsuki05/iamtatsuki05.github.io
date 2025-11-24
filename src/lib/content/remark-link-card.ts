import fs from 'node:fs/promises';
import path from 'node:path';
import { getOgCacheTtlMs, shouldDisableOgFetch } from '@/lib/config/env';

type OGData = {
  url: string;
  title?: string;
  description?: string;
  image?: string;
  siteName?: string;
  fetchedAt?: number;
};

type Options = {
  allowDomains?: string[]; // 指定時は許可リスト方式。未指定なら自動判定（OG/Twitter Cardがあるときのみカード化）
  cacheFile?: string; // workspace-relative
  ttlMs?: number; // キャッシュの有効期限（既定: 7日）
};

const DEFAULT_CACHE = path.join(process.cwd(), 'src', 'data', 'og-cache.json');

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

async function readCache(file: string): Promise<Record<string, OGData>> {
  try {
    const raw = await fs.readFile(file, 'utf8');
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

async function writeCache(file: string, data: Record<string, OGData>) {
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, JSON.stringify(data, null, 2), 'utf8');
}

// Extract meta tags from HTML head, attribute-order agnostic
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

function providerFallback(url: string): OGData | null {
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
      // 画像URLは安定しないため付けない
      return { url, title: asin ? `Amazon: ${asin}` : undefined, siteName: 'Amazon' };
    }
  } catch {}
  return null;
}

// Provider専用取得（oEmbed等）。成功したらメタより優先
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

async function fetchOG(url: string): Promise<OGData | null> {
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

function isAllowed(url: string, allow: string[]) {
  try {
    const u = new URL(url);
    return allow.includes(u.hostname);
  } catch {
    return false;
  }
}

function makeCardHTML(u: string, og: OGData | null) {
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

// naive walk over mdast
function walk(node: any, fn: (n: any, parent: any, index: number) => void, parent: any = null) {
  const children = (node && node.children) || [];
  for (let i = 0; i < children.length; i++) {
    fn(children[i], node, i);
    walk(children[i], fn, node);
  }
}

function isBareLinkParagraph(node: any) {
  if (!node || node.type !== 'paragraph' || !Array.isArray(node.children)) return false;
  const ch = node.children.filter((c: any) => c.type !== 'text' || (c.value || '').trim() !== '');
  if (ch.length !== 1) return false;
  return ch[0].type === 'link' && typeof ch[0].url === 'string';
}

export default function remarkLinkCard(options?: Options) {
  const allow = options?.allowDomains || null;
  const cacheFile = options?.cacheFile || DEFAULT_CACHE;
  const ttlMs = Number.isFinite(options?.ttlMs as number)
    ? (options?.ttlMs as number)
    : getOgCacheTtlMs();
  return async function transformer(tree: any) {
    const targets: { parent: any; index: number; url: string }[] = [];
    walk(tree, (node, parent, index) => {
      if (!parent) return;
      if (isBareLinkParagraph(node)) {
        const link = node.children.find((c: any) => c.type === 'link');
        const url = String(link.url || '');
        // http/https のみ対象
        if (!/^https?:\/\//i.test(url)) return;
        // 許可リストが指定されている場合のみ制限
        if (Array.isArray(allow) && allow.length > 0) {
          if (!isAllowed(url, allow)) return;
        }
        targets.push({ parent, index, url });
      }
    });

    if (targets.length === 0) return;

    const cache = await readCache(cacheFile);
    let cacheChanged = false;
    const updateCache = (url: string, data: OGData) => {
      const prev = cache[url];
      const same = prev && JSON.stringify(prev) === JSON.stringify(data);
      if (!same) {
        cache[url] = data;
        cacheChanged = true;
      }
    };
    const outNodes: { html: string; parent: any; index: number; url: string }[] = [];

    const providerOf = (u: string) => {
      try {
        const x = new URL(u);
        if (x.hostname === 'youtu.be' || x.hostname.endsWith('youtube.com')) return 'youtube';
        if (x.hostname === 'x.com' || x.hostname === 'twitter.com') return 'twitter';
        if (x.hostname.endsWith('instagram.com')) return 'instagram';
      } catch {}
      return 'other';
    };

    const ytIdFrom = (u: string) => {
      try {
        const x = new URL(u);
        if (x.hostname === 'youtu.be') return x.pathname.slice(1);
        if (x.hostname.endsWith('youtube.com')) {
          if (x.pathname.startsWith('/watch')) return x.searchParams.get('v') || '';
          if (x.pathname.startsWith('/shorts/')) return x.pathname.split('/')[2] || '';
        }
      } catch {}
      return '';
    };

    const mkYouTube = (id: string) => {
      const canonical = `https://www.youtube.com/watch?v=${id}`;
      return `<div class="rse-embed embed-video embed-youtube" data-provider="youtube" data-url="${canonical}"></div>`;
    };

    const mkTwitter = (u: string) => {
      try {
        const x = new URL(u);
        const canonical = x.hostname === 'twitter.com' ? u : `https://twitter.com${x.pathname}`;
        return `<div class="rse-embed embed-social embed-twitter" data-provider="twitter" data-url="${canonical}"></div>`;
      } catch {
        return `<div class="rse-embed embed-social embed-twitter" data-provider="twitter" data-url="${u}"></div>`;
      }
    };

    const mkInstagram = (u: string) =>
      `<div class="rse-embed embed-social embed-instagram" data-provider="instagram" data-url="${u}"></div>`;

    for (const t of targets) {
      const provider = providerOf(t.url);
      if (provider === 'youtube') {
        const id = ytIdFrom(t.url);
        if (id) {
          outNodes.push({ html: mkYouTube(id), parent: t.parent, index: t.index, url: t.url });
          continue;
        }
      }
      if (provider === 'twitter') {
        outNodes.push({ html: mkTwitter(t.url), parent: t.parent, index: t.index, url: t.url });
        continue;
      }
      if (provider === 'instagram') {
        outNodes.push({ html: mkInstagram(t.url), parent: t.parent, index: t.index, url: t.url });
        continue;
      }

      const cached = cache[t.url];
      let og: OGData | null = null;
      const fresh = cached && cached.fetchedAt && Date.now() - (cached.fetchedAt || 0) < ttlMs;
      const cachedHasPreview = !!(
        cached && (cached.title || cached.image || cached.description || cached.siteName)
      );
      if (cached && fresh && cachedHasPreview) {
        og = cached;
      } else {
        const fetched = await fetchOG(t.url);
        if (fetched) {
          updateCache(t.url, fetched);
          og = fetched;
        } else if (cached) {
          // フェッチ失敗時は古いキャッシュで代替
          og = cached;
        }
      }
      // OGP/Twitter Cardが検出できた場合のみカード化（少なくとも title or image）
      const hasPreview = !!(og && (og.title || og.image || og.description || og.siteName));
      if (hasPreview) {
        outNodes.push({ html: makeCardHTML(t.url, og), parent: t.parent, index: t.index, url: t.url });
      }
    }
    // Write back cache best-effort
    if (cacheChanged) {
      try {
        await writeCache(cacheFile, cache);
      } catch {}
    }

    // Replace nodes
    for (const n of outNodes) {
      n.parent.children[n.index] = { type: 'html', value: n.html } as any;
    }
  };
}
