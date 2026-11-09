import { useEffect } from 'react';
import { createRoot, type Root } from 'react-dom/client';

type EmbedModule = typeof import('react-social-media-embed');

const EMBED_SELECTOR = '.rse-embed[data-provider][data-url]';

function renderEmbed(provider: string, url: string, { XEmbed, InstagramEmbed, YouTubeEmbed }: EmbedModule) {
  if (provider === 'twitter') return <XEmbed url={url} width={440} />;
  if (provider === 'instagram') return <InstagramEmbed url={url} width={440} />;
  if (provider === 'youtube') return <YouTubeEmbed url={url} />;
  return null;
}

export function EmbedsClient({ enabled = true }: { enabled?: boolean } = {}) {
  useEffect(() => {
    if (!enabled) return;
    let disposed = false;
    const roots: Root[] = [];

    const mountAll = async () => {
      if (disposed) return;
      const targets = Array.from(document.querySelectorAll<HTMLElement>(EMBED_SELECTOR));
      if (targets.length === 0) return; // 使うページだけ動的 import

      const mod = await import('react-social-media-embed');
      if (disposed) return;
      targets.forEach((el) => {
        if (el.dataset.mounted === '1') return;
        const embed = renderEmbed(el.dataset.provider!, el.dataset.url!, mod);
        if (!embed) return;
        const root = createRoot(el);
        roots.push(root);
        el.dataset.mounted = '1';
        root.render(<div style={{ display: 'flex', justifyContent: 'center' }}>{embed}</div>);
      });
    };

    // 直下に埋め込みがある場合のみロード。視認範囲で初回ロードする最適化。
    const first = document.querySelector<HTMLElement>(EMBED_SELECTOR);
    if (first) {
      const io = new IntersectionObserver(
        (entries) => {
          const hit = entries.some((e) => e.isIntersecting);
          if (hit) {
            mountAll();
            io.disconnect();
          }
        },
        { rootMargin: '600px 0px' },
      );
      io.observe(first);
    }
    let idleId: number | undefined;
    let timeoutId: number | undefined;

    if (typeof window.requestIdleCallback === 'function') {
      idleId = window.requestIdleCallback(() => mountAll(), { timeout: 5000 });
    } else {
      timeoutId = window.setTimeout(() => mountAll(), 5000);
    }

    return () => {
      disposed = true;
      if (idleId !== undefined && typeof window.cancelIdleCallback === 'function') {
        window.cancelIdleCallback(idleId);
      }
      if (timeoutId !== undefined) window.clearTimeout(timeoutId);
      for (const root of roots) root.unmount();
    };
  }, [enabled]);

  return null;
}
