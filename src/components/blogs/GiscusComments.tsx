'use client';
import { useEffect, useRef } from 'react';
import type { Locale } from '@/lib/i18n';

// giscus (GitHub Discussions ベースのコメント) の埋め込み。
// 設定値は https://giscus.app/ja で生成したもの。
const GISCUS_REPO = 'iamtatsuki05/iamtatsuki05.github.io';
const GISCUS_REPO_ID = 'R_kgDOPsXdHg';
const GISCUS_CATEGORY = 'Announcements';
const GISCUS_CATEGORY_ID = 'DIC_kwDOPsXdHs4DA5tE';

const GISCUS_LANG: Record<Locale, string> = {
  ja: 'ja',
  en: 'en',
  zh: 'zh-CN',
  fr: 'fr',
};

function currentGiscusTheme() {
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
}

export function GiscusComments({ term, locale = 'ja' }: { term: string; locale?: Locale }) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || container.querySelector('script')) return;

    const script = document.createElement('script');
    script.src = 'https://giscus.app/client.js';
    script.async = true;
    script.crossOrigin = 'anonymous';
    script.setAttribute('data-repo', GISCUS_REPO);
    script.setAttribute('data-repo-id', GISCUS_REPO_ID);
    script.setAttribute('data-category', GISCUS_CATEGORY);
    script.setAttribute('data-category-id', GISCUS_CATEGORY_ID);
    // 全 locale で同じ記事は同じ discussion を共有する
    script.setAttribute('data-mapping', 'specific');
    script.setAttribute('data-term', `blog:${term}`);
    script.setAttribute('data-strict', '0');
    script.setAttribute('data-reactions-enabled', '1');
    script.setAttribute('data-emit-metadata', '0');
    script.setAttribute('data-input-position', 'bottom');
    script.setAttribute('data-theme', currentGiscusTheme());
    script.setAttribute('data-lang', GISCUS_LANG[locale]);
    script.setAttribute('data-loading', 'lazy');
    container.appendChild(script);

    // サイトのテーマ切替 (html.dark の付け外し) に giscus iframe を追従させる
    const observer = new MutationObserver(() => {
      const iframe = container.querySelector<HTMLIFrameElement>('iframe.giscus-frame');
      iframe?.contentWindow?.postMessage(
        { giscus: { setConfig: { theme: currentGiscusTheme() } } },
        'https://giscus.app',
      );
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    return () => {
      observer.disconnect();
    };
  }, [term, locale]);

  return <div ref={containerRef} className="giscus not-prose mt-4" data-testid="blog-comments" />;
}
