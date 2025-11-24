"use client";
import { useEffect } from 'react';
import { createRoot, Root } from 'react-dom/client';

// Twitter公式推奨スニペット（catnose99さんの記事の方針）を動的注入
// ref: https://zenn.dev/catnose99/articles/329d7d61968efb
function ensureTwitterSnippet() {
  const w = window as any;
  if (w.twttr && typeof w.twttr.ready === 'function') return w.twttr;
  // 既に widgets.js が入っているならスキップ
  if (document.getElementById('twitter-wjs')) return (w.twttr ||= { _e: [], ready: (f: any) => w.twttr._e.push(f) });
  const loader = document.createElement('script');
  loader.type = 'text/javascript';
  loader.text = `window.twttr = (function(d, s, id) {
  var js, fjs = d.getElementsByTagName(s)[0], t = window.twttr || {};
  if (d.getElementById(id)) return t;
  js = d.createElement(s); js.id = id; js.src = "https://platform.twitter.com/widgets.js";
  fjs.parentNode.insertBefore(js, fjs);
  t._e = []; t.ready = function(f){ t._e.push(f); }; return t;
}(document, "script", "twitter-wjs"));`;
  document.head.appendChild(loader);
  return (w.twttr ||= { _e: [], ready: (f: any) => w.twttr._e.push(f) });
}

function loadOnce(src: string, globalReady: () => boolean) {
  if (globalReady()) return Promise.resolve();
  return new Promise<void>((resolve) => {
    const existing = Array.from(document.scripts).find((s) => s.src === src);
    if (existing) {
      const onload = () => resolve();
      existing.addEventListener('load', onload, { once: true });
      // Safari
      if ((existing as any).readyState === 'complete') resolve();
      return;
    }
    const s = document.createElement('script');
    s.async = true;
    s.src = src;
    s.onload = () => resolve();
    document.body.appendChild(s);
  });
}

export function EmbedsClient({ enabled = true }: { enabled?: boolean } = {}) {
  if (!enabled) return null;
  useEffect(() => {
    let disposed = false;
    const roots = new WeakMap<Element, Root>();

    const mountAll = async () => {
      if (disposed) return;
      const targets = Array.from(
        document.querySelectorAll<HTMLElement>('.rse-embed[data-provider][data-url]'),
      );
      if (targets.length === 0) return; // 使うページだけ動的 import

      const mod: any = await import('react-social-media-embed');
      if (disposed) return;
      targets.forEach((el) => {
        if (el.dataset.mounted === '1') return;
        const url = el.dataset.url!;
        const provider = el.dataset.provider!;
        const TwitterComp = mod.TwitterEmbed || mod.TwitterTweetEmbed || mod.XEmbed;
        const InstaComp = mod.InstagramEmbed || mod.InstagramPostEmbed;
        const YtComp = mod.YouTubeEmbed || mod.YoutubeEmbed;
        let Comp: any = null;
        if (provider === 'twitter') Comp = TwitterComp;
        else if (provider === 'instagram') Comp = InstaComp;
        else if (provider === 'youtube') Comp = YtComp;
        if (!Comp) return;
        const root = createRoot(el);
        roots.set(el, root);
        el.dataset.mounted = '1';
        const compProps: any = { url };
        if (provider === 'twitter') compProps.width = 440;
        if (provider === 'instagram') compProps.width = 440;

        root.render(
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Comp {...compProps} />
          </div>,
        );
      });
    };

    const reflow = () => {
      document.querySelectorAll<HTMLElement>('.rse-embed[data-provider][data-url]').forEach((el) => {
        if (el.dataset.mounted !== '1') return;
        const root = roots.get(el);
        if (!root) return;
        const url = el.dataset.url!;
        const provider = el.dataset.provider!;
        import('react-social-media-embed').then((mod: any) => {
          const TwitterComp = mod.TwitterEmbed || mod.TwitterTweetEmbed || mod.XEmbed;
          const InstaComp = mod.InstagramEmbed || mod.InstagramPostEmbed;
          const YtComp = mod.YouTubeEmbed || mod.YoutubeEmbed;
          let Comp: any = null;
          if (provider === 'twitter') Comp = TwitterComp;
          else if (provider === 'instagram') Comp = InstaComp;
          else if (provider === 'youtube') Comp = YtComp;
          if (!Comp) return;
          const compProps: any = { url };
          if (provider !== 'twitter') compProps.width = '100%';
          root.render(
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Comp {...compProps} />
            </div>
          );
        });
      });
    };

    // 直下に埋め込みがある場合のみロード。視認範囲で初回ロードする最適化。
    const first = document.querySelector<HTMLElement>('.rse-embed[data-provider][data-url]');
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
    // 念のため遅延実行（埋め込みが下部にあるケース）
    const t = window.setTimeout(() => mountAll(), 5000);
    const onResize = () => reflow();
    window.addEventListener('resize', onResize);
    return () => {
      disposed = true;
      window.removeEventListener('resize', onResize);
      window.clearTimeout(t);
    };
  }, []);

  return null;
}
