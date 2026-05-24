#!/usr/bin/env bun
import path from 'node:path';
import { mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises';
import matter from 'gray-matter';
import type { Locale } from '@/lib/i18n';

const SOURCE_DIR = path.join(process.cwd(), 'src', 'content', 'blogs');
const TRANSLATION_DIR = path.join(process.cwd(), 'src', 'content', 'blog-translations');
const OUTPUT_DIR = path.join(process.cwd(), 'src', 'content', 'generated', 'blogs');
const TRANSLATION_LOCALES = ['en', 'zh', 'fr'] satisfies Locale[];

type Frontmatter = Record<string, unknown>;

async function readMarkdown(filePath: string) {
  const raw = await readFile(filePath, 'utf8');
  return matter(raw);
}

function pickSourceMetadata(frontmatter: Frontmatter) {
  return compact({
    date: frontmatter.date,
    updated: frontmatter.updated,
    tags: frontmatter.tags,
    thumbnail: frontmatter.thumbnail,
    headerImage: frontmatter.headerImage,
    aiAssisted: frontmatter.aiAssisted,
    draft: frontmatter.draft,
  });
}

function compact<T extends Record<string, unknown>>(input: T): T {
  return Object.fromEntries(Object.entries(input).filter(([, value]) => value !== undefined)) as T;
}

async function listSourceFiles() {
  const entries = await readdir(SOURCE_DIR, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isFile() && /\.md$/i.test(entry.name))
    .map((entry) => entry.name)
    .sort();
}

async function resetLocaleDir(locale: Locale) {
  const targetDir = path.join(OUTPUT_DIR, locale);
  await rm(targetDir, { recursive: true, force: true });
  await mkdir(targetDir, { recursive: true });
  return targetDir;
}

async function generateLocale(locale: Locale, files: string[]) {
  const targetDir = await resetLocaleDir(locale);

  for (const filename of files) {
    const slug = filename.replace(/\.md$/i, '');
    const source = await readMarkdown(path.join(SOURCE_DIR, filename));
    const translatedPath = path.join(TRANSLATION_DIR, locale, filename);
    const translated = await readMarkdown(translatedPath);

    const data = compact({
      ...pickSourceMetadata(source.data),
      title: translated.data.title,
      summary: translated.data.summary,
      headerAlt: translated.data.headerAlt ?? source.data.headerAlt,
      aiTranslated: true,
      originalLocale: 'ja',
      originalSlug: slug,
    });

    await writeFile(
      path.join(targetDir, filename),
      matter.stringify(translated.content.trimStart(), data),
      'utf8',
    );
  }
}

async function main() {
  const files = await listSourceFiles();
  await Promise.all(TRANSLATION_LOCALES.map((locale) => generateLocale(locale, files)));
  console.log(`generated blog translations for ${TRANSLATION_LOCALES.join(', ')}`);
}

main().catch((error) => {
  console.error('[generate-blog-translations] failed', error);
  process.exitCode = 1;
});
