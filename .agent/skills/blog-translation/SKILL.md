---
name: blog-translation
description: Use when generating or updating translated blog Markdown for this Astro site from Japanese original posts, especially en/zh/fr files under src/content/blog-translations and the derived generated blog output.
---

# Blog Translation

Use this skill to create or update translated blog source Markdown for `iamtatsuki05.github.io`.

## Source and Output

- Japanese originals: `src/content/blogs/*.md`
- Translation source files: `src/content/blog-translations/{en,zh,fr}/*.md`
- Generated files: `src/content/generated/blogs/{en,zh,fr}/*.md`

Do not edit `src/content/generated/` directly. It is derived output from `scripts/generate-blog-translations.ts`.

## Translation Workflow

1. Read the Japanese original from `src/content/blogs/<slug>.md`.
2. Create or update matching files:
   - `src/content/blog-translations/en/<slug>.md`
   - `src/content/blog-translations/zh/<slug>.md`
   - `src/content/blog-translations/fr/<slug>.md`
3. Translation source frontmatter should contain only translated content metadata:
   - `title`
   - `summary`
   - `headerAlt` when the original has a header image or useful alt text
4. Translate the Markdown body below the frontmatter.
5. Run `bun scripts/generate-blog-translations.ts` to regenerate derived Markdown.
6. Run focused validation. Prefer:
   - `bun run vitest:run:core -- tests/lib/content.blog.test.ts tests/lib/routing.test.ts tests/lib/seo.test.ts`
   - `bun run build` when route generation, metadata, RSS, or sitemap behavior could be affected

## Translation Rules

- Use the Japanese original as the source of truth.
- English should be natural and idiomatic, not a word-by-word translation.
- Chinese should be Simplified Chinese suitable for the `zh-CN` route.
- French should be natural standard French with correct accents and punctuation.
- Preserve meaning, scope, chronology, numbers, URLs, command names, file paths, package names, product names, and code identifiers exactly.
- Preserve Markdown structure unless a small heading or paragraph change makes the translation more natural.
- Preserve code fences and inline code exactly unless the code comment itself is natural-language prose that clearly should be translated.
- Do not invent facts, metrics, links, claims, or personal details that are not in the original.
- Do not add `date`, `updated`, `tags`, `thumbnail`, `headerImage`, `draft`, `aiTranslated`, `originalLocale`, or `originalSlug` to translation source files. The generator copies or adds those.
- Keep the AI-translation disclosure in page rendering, not in each translation Markdown body.

## Quality Checklist

Before finishing:

- Each supported locale has a matching translation source file for the slug.
- Frontmatter parses as YAML.
- `title`, `summary`, and `headerAlt` are in the target language.
- Markdown headings are translated and remain valid Markdown.
- Commands, URLs, paths, dates, and measured values match the Japanese original.
- `bun scripts/generate-blog-translations.ts` succeeds.
- If build output is checked, translated pages show the automatic AI notice and Japanese original link.

## External AI/API Policy

The normal repo build must not depend on any external translation API, billing, or network call. It is fine for an interactive agent such as Codex to author translation source files while following this skill, but do not add build-time API calls unless the user explicitly asks for that architecture.

## Build-Time Fallback

`bun run build` runs `scripts/ensure-blog-translations.ts` before the deterministic generator. If every translation source exists, it is a no-op. If one or more translation source files are missing, it invokes:

```bash
codex exec --full-auto --sandbox workspace-write --cd <repo> "<prompt from scripts/print-blog-translation-agent-prompt.ts>"
```

This fallback should only create missing files under `src/content/blog-translations/{en,zh,fr}/`. It must not edit `src/content/generated/` directly.
