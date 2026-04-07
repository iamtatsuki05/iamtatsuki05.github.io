import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { syncPublicBlogMarkdown } from '@/lib/content/syncPublicBlogMarkdown';

const tempDirs: string[] = [];

afterEach(async () => {
  await Promise.all(tempDirs.splice(0).map((dir) => fs.rm(dir, { recursive: true, force: true })));
});

describe('syncPublicBlogMarkdown', () => {
  it('copies markdown files and removes stale generated files', async () => {
    const rootDir = await fs.mkdtemp(path.join(os.tmpdir(), 'blog-markdown-sync-'));
    const sourceDir = path.join(rootDir, 'src');
    const targetDir = path.join(rootDir, 'public');
    tempDirs.push(rootDir);

    await fs.mkdir(sourceDir, { recursive: true });
    await fs.mkdir(targetDir, { recursive: true });
    await fs.writeFile(path.join(sourceDir, 'hello.md'), '---\ntitle: hello\n---\n\nbody\n', 'utf8');
    await fs.writeFile(path.join(sourceDir, 'note.mdx'), '# mdx', 'utf8');
    await fs.writeFile(path.join(sourceDir, 'ignore.txt'), 'ignore', 'utf8');
    await fs.writeFile(path.join(targetDir, 'stale.md'), 'stale', 'utf8');

    await syncPublicBlogMarkdown({ sourceDir, targetDir });

    await expect(fs.readFile(path.join(targetDir, 'hello.md'), 'utf8')).resolves.toContain('title: hello');
    await expect(fs.readFile(path.join(targetDir, 'note.mdx'), 'utf8')).resolves.toBe('# mdx');
    await expect(fs.access(path.join(targetDir, 'stale.md'))).rejects.toThrow();
    await expect(fs.access(path.join(targetDir, 'ignore.txt'))).rejects.toThrow();
  });
});
