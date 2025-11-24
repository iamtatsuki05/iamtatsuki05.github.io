import type { Root } from 'hast';

// rehype プラグイン: <img> にデフォルト属性を付与
// - loading="lazy"
// - decoding="async"
// - 外部画像には referrerpolicy="no-referrer"
export default function rehypeImgDefaults() {
  return (tree: Root) => {
    const visit = (node: any) => {
      if (!node) return;
      if (node.type === 'element' && node.tagName === 'img') {
        const props = (node.properties ||= {} as Record<string, any>);
        if (!props.loading) props.loading = 'lazy';
        if (!props.decoding) props.decoding = 'async';
        const src = String(props.src || '');
        try {
          const isHttp = /^https?:\/\//i.test(src);
          if (isHttp && !props.referrerpolicy) props.referrerpolicy = 'no-referrer';
        } catch {}
      }
      (node.children || []).forEach(visit);
    };
    visit(tree as any);
  };
}

