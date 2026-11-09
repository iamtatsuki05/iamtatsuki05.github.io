import type { Root, RootContent } from 'hast';

export default function rehypeImgDefaults() {
  return (tree: Root) => {
    const visit = (node: Root | RootContent) => {
      if (node.type === 'element' && node.tagName === 'img') {
        const props = node.properties;
        if (!props.loading) props.loading = 'lazy';
        if (!props.decoding) props.decoding = 'async';
        const isHttp = /^https?:\/\//i.test(String(props.src || ''));
        if (isHttp && !props.referrerpolicy) props.referrerpolicy = 'no-referrer';
      }
      if ('children' in node) node.children.forEach(visit);
    };
    visit(tree);
  };
}
