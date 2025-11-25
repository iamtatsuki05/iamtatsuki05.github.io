import path from 'node:path';
import { getOgCacheTtlMs } from '@/lib/config/env';
import { fetchOG } from './og/fetch';
import { hasPreview, isFresh, readCache, upsertCache, writeCache } from './og/cache';
import { embedHtmlFor, providerOf } from './og/provider';
import { makeCardHTML } from './og/template';
import type { OGData } from './og/types';

type Options = {
  allowDomains?: string[]; // 指定時は許可リスト方式。未指定なら自動判定（OG/Twitter Cardがあるときのみカード化）
  cacheFile?: string; // workspace-relative
  ttlMs?: number; // キャッシュの有効期限（既定: 7日）
};

const DEFAULT_CACHE = path.join(process.cwd(), 'src', 'data', 'og-cache.json');

function isAllowed(url: string, allow: string[]) {
  try {
    const u = new URL(url);
    return allow.includes(u.hostname);
  } catch {
    return false;
  }
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
    const outNodes: { html: string; parent: any; index: number; url: string }[] = [];

    for (const t of targets) {
      const provider = providerOf(t.url);
      const embed = embedHtmlFor(provider, t.url);
      if (embed) {
        outNodes.push({ html: embed, parent: t.parent, index: t.index, url: t.url });
        continue;
      }

      const cached = cache[t.url];
      let og: OGData | null = null;
      const fresh = isFresh(cached, ttlMs);
      const cachedHasPreview = hasPreview(cached);
      if (cached && fresh && cachedHasPreview) {
        og = cached;
      } else {
        const fetched = await fetchOG(t.url);
        if (fetched) {
          og = fetched;
          const changed = upsertCache(cache, t.url, fetched);
          cacheChanged = cacheChanged || changed;
        } else if (cached) {
          // フェッチ失敗時は古いキャッシュで代替
          og = cached;
        }
      }
      // OGP/Twitter Cardが検出できた場合のみカード化（少なくとも title or image）
      const hasCard = hasPreview(og);
      if (hasCard) {
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
