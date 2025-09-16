export type RehypeExternalLinksOptions = {
  target?: string;
  rel?: string[];
  isExternal?: (href: string) => boolean;
};

type HastNode = {
  type?: string;
  tagName?: string;
  properties?: Record<string, unknown> & { rel?: string | string[]; href?: string };
  children?: HastNode[];
};

function mergeRel(existing: string | string[] | undefined, additions: string[]): string[] {
  const base = Array.isArray(existing)
    ? existing
    : typeof existing === 'string'
      ? existing.split(/\s+/).filter(Boolean)
      : [];
  const set = new Set([...base.map((s) => s.toLowerCase()), ...additions.map((s) => s.toLowerCase())]);
  return Array.from(set);
}

export default function rehypeExternalLinks(options: RehypeExternalLinksOptions = {}) {
  const {
    target = '_blank',
    rel = ['noopener', 'noreferrer'],
    isExternal = (href: string) => /^https?:\/\//i.test(href),
  } = options;

  return (tree: HastNode) => {
    const visit = (node?: HastNode) => {
      if (!node || typeof node !== 'object') return;
      if (node.type === 'element' && node.tagName === 'a') {
        const props = (node.properties ||= {});
        const anyProps = props as Record<string, any>;
        const href = typeof anyProps.href === 'string' ? anyProps.href : undefined;
        if (href && isExternal(href)) {
          anyProps.target = target;
          anyProps.rel = mergeRel(anyProps.rel as string | string[] | undefined, rel);
        }
      }
      const children = node.children || [];
      for (const child of children) {
        visit(child);
      }
    };

    visit(tree);
  };
}
