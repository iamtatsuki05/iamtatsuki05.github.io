import fs from 'node:fs/promises';
import path from 'node:path';

type Options = {
  sourceDir?: string;
  targetDir?: string;
};

const MARKDOWN_FILE_PATTERN = /\.mdx?$/i;

export async function syncPublicBlogMarkdown({
  sourceDir = path.join(process.cwd(), 'src', 'content', 'blogs'),
  targetDir = path.join(process.cwd(), 'public', 'blogs'),
}: Options = {}) {
  await fs.mkdir(targetDir, { recursive: true });

  const [sourceEntries, targetEntries] = await Promise.all([
    fs.readdir(sourceDir, { withFileTypes: true }),
    fs.readdir(targetDir, { withFileTypes: true }),
  ]);

  const sourceFiles = sourceEntries
    .filter((entry) => entry.isFile() && MARKDOWN_FILE_PATTERN.test(entry.name))
    .map((entry) => entry.name);
  const sourceFileSet = new Set(sourceFiles);

  await Promise.all(
    targetEntries
      .filter((entry) => entry.isFile() && MARKDOWN_FILE_PATTERN.test(entry.name) && !sourceFileSet.has(entry.name))
      .map((entry) => fs.rm(path.join(targetDir, entry.name))),
  );

  await Promise.all(
    sourceFiles.map((filename) =>
      fs.copyFile(path.join(sourceDir, filename), path.join(targetDir, filename)),
    ),
  );
}
