#!/usr/bin/env bun
import path from 'node:path';
import { spawn } from 'node:child_process';
import { access, readdir, readFile } from 'node:fs/promises';

const SOURCE_DIR = path.join(process.cwd(), 'src', 'content', 'blogs');
const TRANSLATION_DIR = path.join(process.cwd(), 'src', 'content', 'blog-translations');
const TRANSLATION_LOCALES = ['en', 'zh', 'fr'] as const;

type TranslationLocale = (typeof TRANSLATION_LOCALES)[number];

type MissingTranslation = {
  locale: TranslationLocale;
  filename: string;
};

async function existsNonEmpty(filePath: string) {
  try {
    await access(filePath);
    return (await readFile(filePath, 'utf8')).trim().length > 0;
  } catch {
    return false;
  }
}

async function listSourceFiles() {
  const entries = await readdir(SOURCE_DIR, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isFile() && /\.md$/i.test(entry.name))
    .map((entry) => entry.name)
    .sort();
}

async function findMissingTranslations() {
  const files = await listSourceFiles();
  const missing: MissingTranslation[] = [];
  for (const filename of files) {
    for (const locale of TRANSLATION_LOCALES) {
      const translatedPath = path.join(TRANSLATION_DIR, locale, filename);
      if (!(await existsNonEmpty(translatedPath))) {
        missing.push({ locale, filename });
      }
    }
  }
  return missing;
}

function summarize(missing: MissingTranslation[]) {
  return missing
    .map(({ locale, filename }) => `- ${locale}: src/content/blog-translations/${locale}/${filename}`)
    .join('\n');
}

async function printAgentPrompt() {
  const { code, stdout } = await runCommand('bun', ['scripts/print-blog-translation-agent-prompt.ts'], {
    inherit: false,
  });
  if (code !== 0) {
    throw new Error(`failed to print blog translation agent prompt; exit code ${code}`);
  }
  return stdout;
}

async function runCodex(prompt: string) {
  const { code } = await runCommand('codex', [
    'exec',
    '--full-auto',
    '--sandbox',
    'workspace-write',
    '--cd',
    process.cwd(),
    prompt,
  ]);
  return code;
}

function runCommand(command: string, args: string[], options: { inherit?: boolean } = {}) {
  return new Promise<{ code: number | null; stdout: string }>((resolve, reject) => {
    const proc = spawn(command, args, {
      cwd: process.cwd(),
      stdio: options.inherit === false ? ['ignore', 'pipe', 'inherit'] : ['ignore', 'inherit', 'inherit'],
    });
    let stdout = '';
    proc.stdout?.on('data', (chunk) => {
      stdout += chunk.toString();
    });
    proc.on('error', reject);
    proc.on('close', (code) => resolve({ code, stdout }));
  });
}

async function main() {
  const initialMissing = await findMissingTranslations();
  if (initialMissing.length === 0) {
    console.log('blog translation sources are complete');
    return;
  }

  console.warn(`missing blog translation sources:\n${summarize(initialMissing)}`);
  console.warn('running Codex via .agent/skills/blog-translation/SKILL.md to generate missing translations...');

  const prompt = await printAgentPrompt();
  const code = await runCodex(prompt);
  if (code !== 0) {
    throw new Error(`Codex translation generation failed with exit code ${code}`);
  }

  const remainingMissing = await findMissingTranslations();
  if (remainingMissing.length > 0) {
    throw new Error(`Codex finished but translations are still missing:\n${summarize(remainingMissing)}`);
  }

  console.log('blog translation sources are complete after Codex generation');
}

main().catch((error) => {
  console.error('[ensure-blog-translations] failed', error);
  process.exitCode = 1;
});
