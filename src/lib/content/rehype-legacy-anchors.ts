export type LegacyAnchorMap = Record<string, string>;

export type RehypeLegacyAnchorsOptions = {
  aliases: LegacyAnchorMap;
  sourcePath?: string;
};

type HastNode = {
  type?: string;
  tagName?: string;
  properties?: Record<string, unknown>;
  children?: HastNode[];
};

const HEADING_TAGS = new Set(['h1', 'h2', 'h3', 'h4', 'h5', 'h6']);
const NOT_A_SLUG = /[A-Z\s#]/;

function describeSource(sourcePath?: string) {
  return sourcePath ? ` (${sourcePath})` : '';
}

/**
 * frontmatter の `legacyAnchors` を検証して返す。
 * 形が違うものを黙って捨てると、リンク切れを直したつもりで直っていない状態になるため throw する。
 */
export function parseLegacyAnchors(value: unknown, sourcePath?: string): LegacyAnchorMap {
  if (value === undefined || value === null) return {};
  if (typeof value !== 'object' || Array.isArray(value)) {
    throw new Error(`legacyAnchors must be a mapping of "old anchor" to "current anchor"${describeSource(sourcePath)}`);
  }
  const entries = Object.entries(value as Record<string, unknown>);
  for (const [legacyId, currentId] of entries) {
    if (typeof currentId !== 'string' || !legacyId || !currentId) {
      throw new Error(
        `legacyAnchors["${legacyId}"] must be a non-empty string naming the current anchor${describeSource(sourcePath)}`,
      );
    }
    // github-slugger は必ず小文字化し、空白を `-` にし、`#` を落とす。
    // それらを含むキーは実在した旧アンカーではないので、書き間違いとして弾く。
    if (NOT_A_SLUG.test(legacyId)) {
      throw new Error(
        `legacyAnchors["${legacyId}"] is not a slug: an old anchor has no uppercase letters, spaces, or "#"${describeSource(sourcePath)}`,
      );
    }
  }
  return Object.fromEntries(entries) as LegacyAnchorMap;
}

/**
 * 見出しの文言を変えるとアンカーが変わり、外部からの `#...` 直リンクが切れる。
 * 旧アンカーを id だけ持つ空の span として見出しの先頭に足し、同じ節へ着地させる。
 * rehype-slug より後に置くこと。
 */
export default function rehypeLegacyAnchors(options: RehypeLegacyAnchorsOptions) {
  const { aliases, sourcePath } = options;
  const entries = Object.entries(aliases);

  return (tree: HastNode) => {
    if (entries.length === 0) return;

    const legacyIdsByCurrentId = new Map<string, string[]>();
    for (const [legacyId, currentId] of entries) {
      const list = legacyIdsByCurrentId.get(currentId) || [];
      list.push(legacyId);
      legacyIdsByCurrentId.set(currentId, list);
    }

    // 1 周目は読むだけ。挿入しながら数えると、足したばかりの span を衝突として数えてしまう。
    const existingIds = new Set<string>();
    const targets: HastNode[] = [];

    const collect = (node?: HastNode) => {
      if (!node || typeof node !== 'object') return;
      if (node.type === 'element') {
        const nodeId = node.properties?.id;
        if (typeof nodeId === 'string') {
          existingIds.add(nodeId);
          if (node.tagName && HEADING_TAGS.has(node.tagName) && legacyIdsByCurrentId.has(nodeId)) {
            targets.push(node);
          }
        }
      }
      for (const child of node.children || []) {
        collect(child);
      }
    };

    collect(tree);

    const resolved = new Set(targets.map((node) => node.properties?.id as string));
    const missing = [...legacyIdsByCurrentId.keys()].filter((currentId) => !resolved.has(currentId));
    if (missing.length > 0) {
      throw new Error(
        `legacyAnchors points at headings that do not exist: ${missing.join(', ')}${describeSource(sourcePath)}`,
      );
    }

    const clashing = entries.map(([legacyId]) => legacyId).filter((legacyId) => existingIds.has(legacyId));
    if (clashing.length > 0) {
      throw new Error(
        `legacyAnchors would duplicate ids already used by the page: ${clashing.join(', ')}${describeSource(sourcePath)}`,
      );
    }

    for (const node of targets) {
      const legacyIds = legacyIdsByCurrentId.get(node.properties?.id as string) || [];
      node.children = [
        ...legacyIds.map((legacyId) => ({
          type: 'element',
          tagName: 'span',
          properties: { id: legacyId, className: ['legacy-anchor'] },
          children: [],
        })),
        ...(node.children || []),
      ];
    }
  };
}
