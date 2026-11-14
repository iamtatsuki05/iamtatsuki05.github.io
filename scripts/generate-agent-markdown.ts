#!/usr/bin/env bun
import { readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { htmlToMarkdown } from '@/lib/agent/htmlToMarkdown';
import { getSiteUrlWithBasePath } from '@/lib/config/env';

const outDir = path.join(process.cwd(), 'out');
const SKIPPED_DIRS = new Set(['_astro', 'images', 'storybook']);

async function findPages(dir: string): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true });
  const nested = await Promise.all(
    entries
      .filter((entry) => entry.isDirectory() && !SKIPPED_DIRS.has(entry.name))
      .map((entry) => findPages(path.join(dir, entry.name))),
  );
  const own = entries.some((entry) => entry.isFile() && entry.name === 'index.html') ? [dir] : [];
  return [...own, ...nested.flat()];
}

async function main() {
  const site = getSiteUrlWithBasePath();
  const pageDirs = await findPages(outDir);
  await Promise.all(
    pageDirs.map(async (dir) => {
      const relative = path.relative(outDir, dir).split(path.sep).join('/');
      const html = await readFile(path.join(dir, 'index.html'), 'utf8');
      const markdown = await htmlToMarkdown(html, { url: `${site}/${relative ? `${relative}/` : ''}` });
      await writeFile(path.join(dir, 'index.md'), markdown);
    }),
  );
  console.log(`generated ${pageDirs.length} markdown pages for agents`);
}

main().catch((error) => {
  console.error('[generate-agent-markdown] failed', error);
  process.exitCode = 1;
});
