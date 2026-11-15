// Imported by src/pages/llms.txt.ts. Format: https://llmstxt.org/ (H1, blockquote summary, H2 link lists).

export type LlmsTxtInput = {
  site: string;
  owner: string;
  summary: string;
  contactEmail: string;
  posts: { slug: string; title: string; summary: string; date: string }[];
  publications: { title: string; type: string; venue?: string; publishedAt?: string }[];
};

const PAGES: [path: string, label: string, contents: string][] = [
  ['/', 'Home', 'profile, affiliation, contact email, and latest posts'],
  ['/cv/', 'CV', 'education, papers, and work history'],
  ['/publications/', 'Publications', 'papers, articles, talks, slides, media, and apps with links'],
  ['/blogs/', 'Blog', 'all blog posts, newest first'],
  ['/links/', 'Links', 'social and external profiles'],
  ['/hobbies/', 'Hobbies', 'personal interests'],
];

const markdownUrl = (site: string, path: string) => `${site}${path}index.md`;
const oneLine = (text: string) => text.replace(/\s+/g, ' ').trim();

export function buildLlmsTxt({ site, owner, summary, contactEmail, posts, publications }: LlmsTxtInput): string {
  const lines = [
    `# ${owner}`,
    '',
    `> ${oneLine(summary)}`,
    '',
    '## When to use this site',
    '',
    `- Questions about ${owner}: profile, affiliation, education and work history (CV), research publications, and contact email (${contactEmail}).`,
    `- What ${owner} has written: blog posts on software development and AI coding tools, in Japanese with English, Chinese, and French translations.`,
    '- Every page has a Markdown version: append `index.md` to its URL, or request the page with `Accept: text/markdown`.',
    `- Japanese is the default language. Translated pages live under \`/en-US/\`, \`/zh-CN/\`, and \`/fr-FR/\` (for example \`${site}/en-US/cv/\`).`,
    '',
    '## Pages',
    '',
    ...PAGES.map(([path, label, contents]) => `- [${label}](${markdownUrl(site, path)}): ${contents}`),
    '',
    '## Blog posts',
    '',
    ...posts.map(
      (post) =>
        `- [${oneLine(post.title)}](${markdownUrl(site, `/blogs/${post.slug}/`)}): ${post.date.slice(0, 10)}${post.summary ? `. ${oneLine(post.summary)}` : ''}`,
    ),
    '',
    '## Publications',
    '',
    ...publications.map((item) => {
      const details = [item.type, item.venue, item.publishedAt?.slice(0, 7)].filter(Boolean).join(', ');
      return `- ${oneLine(item.title)} (${details})`;
    }),
    '',
    '## Optional',
    '',
    `- [Sitemap](${site}/sitemap.xml)`,
    `- [RSS feed](${site}/rss.xml)`,
    '',
  ];
  return lines.join('\n');
}
