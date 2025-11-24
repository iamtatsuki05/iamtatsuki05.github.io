import fs from 'node:fs/promises';
import path from 'node:path';
import matter from 'gray-matter';

const DEFAULT_PRODUCTION_SITE_URL = 'https://iamtatsuki05.github.io';
const DEFAULT_DEVELOPMENT_SITE_URL = 'http://localhost:3000';

function normalize(input) {
  return typeof input === 'string' ? input.trim() : '';
}

function normalizeBasePath(input) {
  const raw = normalize(input);
  if (!raw || raw === '/') return '';
  const stripped = raw.replace(/^\/+|\/+$/g, '');
  return stripped ? `/${stripped}` : '';
}

function getNodeEnv() {
  const raw = normalize(process.env.NODE_ENV);
  if (raw === 'development' || raw === 'test') return raw;
  return 'production';
}

function getSiteUrl() {
  const prefer = normalize(process.env.SITE_URL) || normalize(process.env.NEXT_PUBLIC_SITE_URL);
  if (prefer) {
    try {
      const parsed = new URL(prefer);
      const pathname = parsed.pathname.replace(/\/$/, '');
      return `${parsed.origin}${pathname}`;
    } catch {
      // ignore malformed env values
    }
  }
  return getNodeEnv() === 'development' ? DEFAULT_DEVELOPMENT_SITE_URL : DEFAULT_PRODUCTION_SITE_URL;
}

function getSiteUrlWithBasePath() {
  const origin = getSiteUrl().replace(/\/$/, '');
  const basePath = normalizeBasePath(process.env.NEXT_PUBLIC_BASE_PATH);
  if (!basePath) return origin;
  return origin.endsWith(basePath) ? origin : `${origin}${basePath}`;
}

async function loadBlogMetadata() {
  const includeDrafts = normalize(process.env.INCLUDE_DRAFTS).toLowerCase() === 'true';
  const blogDir = path.join(process.cwd(), 'src', 'content', 'blogs');
  const entries = await fs.readdir(blogDir);
  const posts = [];
  for (const entry of entries) {
    if (!entry.endsWith('.md')) continue;
    const full = path.join(blogDir, entry);
    const raw = await fs.readFile(full, 'utf8');
    const { data } = matter(raw);
    if (!data) continue;
    if (data.draft && !includeDrafts) continue;
    const slug = entry.replace(/\.md$/, '');
    const lastmod = data.updated || data.date || new Date().toISOString();
    posts.push({ slug, lastmod });
  }
  return posts;
}

const siteUrl = getSiteUrlWithBasePath();

/** @type {import('next-sitemap').IConfig} */
const config = {
  siteUrl,
  generateRobotsTxt: true,
  outDir: 'out',
  trailingSlash: true,
  robotsTxtOptions: {
    policies: [{ userAgent: '*', allow: '/' }],
  },
  transform: async (_, path) => {
    const normalizedPath = path.endsWith('/') ? path : `${path}/`;
    const priority = normalizedPath === '/' ? 1.0 : 0.7;
    return {
      loc: `${siteUrl}${normalizedPath}`,
      changefreq: 'weekly',
      priority,
      lastmod: new Date().toISOString(),
    };
  },
  additionalPaths: async () => {
    const posts = await loadBlogMetadata();
    return posts.map((post) => ({
      loc: `${siteUrl}/blogs/${post.slug}/`,
      changefreq: 'weekly',
      priority: 0.8,
      lastmod: new Date(post.lastmod).toISOString(),
    }));
  },
};

export default config;
