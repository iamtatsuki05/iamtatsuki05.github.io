#!/usr/bin/env bun

const DEFAULT_LOCALES = ['en', 'zh', 'fr'];

function usage() {
  return `Usage: bun scripts/print-blog-translation-agent-prompt.ts [--slug <blog-slug>] [--locales en,zh,fr]

Prints a prompt for Codex or another coding agent to generate translated blog source Markdown through the repo-local blog-translation skill.`;
}

function parseArgs(argv: string[]) {
  let slug = '';
  let locales = DEFAULT_LOCALES;
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--help' || arg === '-h') {
      console.log(usage());
      process.exit(0);
    }
    if (arg === '--slug') {
      slug = argv[i + 1] ?? '';
      i += 1;
      continue;
    }
    if (arg === '--locales') {
      locales = (argv[i + 1] ?? '')
        .split(',')
        .map((locale) => locale.trim())
        .filter(Boolean);
      i += 1;
      continue;
    }
    throw new Error(`Unknown argument: ${arg}\n${usage()}`);
  }
  return { slug, locales };
}

const { slug, locales } = parseArgs(process.argv.slice(2));
const target = slug
  ? `the Japanese source post \`src/content/blogs/${slug}.md\``
  : 'all Japanese source posts under `src/content/blogs/*.md` that do not have complete translations';

console.log(`Use the repo-local skill at \`.agent/skills/blog-translation/SKILL.md\`.

Task: Generate or update translated blog source Markdown for ${target}.

Target locales: ${locales.join(', ')}

Requirements:
- Read the Japanese original first and treat it as the source of truth.
- Write translation source files under \`src/content/blog-translations/{locale}/<slug>.md\`.
- Do not edit \`src/content/generated/\` directly.
- Keep the source translation frontmatter limited to \`title\`, \`summary\`, and \`headerAlt\` when applicable.
- Preserve commands, URLs, paths, code identifiers, package names, product names, numbers, dates, and measured values exactly.
- Use natural English, Simplified Chinese for zh, and natural standard French with accents.
- Do not add build-time external API calls, secrets, billing dependencies, telemetry, or unrelated refactors.
- After writing translations, run \`bun scripts/generate-blog-translations.ts\`.
- Then run \`bun run vitest:run:core -- tests/lib/content.blog.test.ts tests/lib/routing.test.ts tests/lib/seo.test.ts\`.
- If generated routes or metadata may be affected, run \`bun run build\` too.

確認や質問は不要です。具体的な翻訳ファイルの作成・更新、検証結果、残リスクまで自主的に出力してください。`);
