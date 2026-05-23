---
title: I Let AI Handle Almost the Entire Migration from Next.js to Astro
summary: A record of letting Codex handle the migration of this site from Next.js to Astro, from implementation through verification.
headerAlt: A screen showing code
---

## Introduction

This site originally ran as a static export from Next.js. It was a typical personal site: blog posts, links, publications, Japanese/English language switching, and dark mode.

In practice, though, it was almost entirely static. Next.js was not causing a serious problem, but App Router, static export, image optimization, and the Cloudflare Pages setup started to feel heavier than the site needed.

So I migrated it to Astro. This time I asked Codex to handle not only the implementation, but also the investigation, before-and-after measurements, tests, and review follow-up.

Saying "I let AI do everything" sounds rough, but the actual process was more like giving it detailed completion criteria and letting it keep working inside those boundaries. This article is a record of that process.

## How I Asked

The first instruction I gave Codex was not just "migrate this to Astro."

I specified that the existing appearance, URLs, SEO, accessibility, and Cloudflare Pages deployment path had to be preserved. I also asked it to compare build time, output size, and Lighthouse scores before and after the migration; to pass lint, typecheck, Vitest, E2E, and preview smoke checks; and finally to ask a separate read-only reviewer to inspect the result.

When delegating to AI, it is risky to provide only an implementation direction. Framework migrations can look fine in the browser while silently breaking sitemap entries or OGP metadata. This time I constrained the work by defining what "done" meant up front.

## Measuring the Baseline First

At the start, Codex measured the existing Next.js version.

It ran `bun run build`, checked output size, inspected representative HTML sizes, ran lint, Vitest, Playwright E2E, and collected Lighthouse results for mobile and desktop.

This is not glamorous, but it was worth doing. Migration is not about fixing something broken; it is about replacing something that works without losing behavior. Without a baseline, there is nothing concrete to compare against.

## What Changed

The implementation removed the Next.js App Router under `src/app/**` and replaced it with Astro routes under `src/pages/**`. The shared layout moved into `BaseLayout.astro`, and existing React components stayed as Astro islands only where they were still needed.

It was not a full rewrite. In fact, most UI components remained as close as possible to the original versions. The main changes were at the framework boundary.

For example, small local wrappers replaced `next/link`, `next/image`, and `next/navigation`. `next-themes` and `nuqs` were also removed, with only the behavior this site needed reimplemented locally.

RSS, sitemap, robots, metadata, OGP, and JSON-LD are now generated from the Astro side. The Cloudflare Pages workflow was updated for the Astro build as well.

## Where It Was Not Smooth

The biggest issue was hydration.

Components that had naturally run as client components in Next.js did not work in Astro unless directives such as `client:load` were set explicitly. The first E2E run failed in ordinary ways.

For example, the language switch active state was wrong on English pages, the theme toggle stayed in a placeholder state, and the Publications filter did not work. When entering a blog detail page from an English page, the date still appeared in Japanese format.

Codex fixed these while reading the E2E failure logs and inspecting the DOM. It passed the current pathname from Astro to the Header, placed the theme provider inside the Header island, and hydrated the Publications page itself.

If I had done the migration by hand, I would probably have gone through the same loop of reading Playwright logs and inspecting the DOM. Codex made that loop much faster.

## What the Review Caught

After the site was working, I asked a separate read-only reviewer to inspect the diff. That caught several important details.

The sitemap still contained publication detail URLs that did not actually exist. Article OGP metadata such as `article:published_time` had disappeared. Cloudflare headers still targeted `/_next/static/*` instead of Astro's `/_astro/*`.

These issues are hard to catch with ordinary E2E tests. The page displays, links work, and the UI feels fine, but SEO and deployment details can still be broken.

After the review, Codex fixed the sitemap, article metadata, cache headers, and base path handling. At the end it inspected the generated HTML directly to confirm that the meta tags were actually present.

## Numbers

In the final state, the following checks passed:

- TypeScript
- lint
- Vitest: 42 files / 152 tests
- Chromium E2E: 50 tests
- Storybook build
- Astro build
- Visual smoke checks with Playwright

| Item | Next.js | Astro |
| --- | ---: | ---: |
| build time | 26.74s | 3.41s |
| static output | 11M | 5.5M |
| framework cache/output | `.next` 184M | `.astro` 12K |

Build time became much shorter, and the output size was almost cut in half.

Lighthouse improved on every checked desktop route. Mobile improved on almost every route as well. The blog detail performance score dropped by one point, from `72` to `71`, but LCP improved from `11040ms` to `8836ms` and TBT improved from `65ms` to `28ms`, so the score difference looked more like Lighthouse variance than a real user-visible regression.

For a personal site of this size, that is more than good enough.

## What I Learned

Even if you say you are delegating everything to AI, you cannot simply walk away.

The most important human work here was not implementation. It was deciding what must not break: URLs, SEO, deployment, performance, and tests. If you write those down first, AI can keep working surprisingly persistently.

If you skip that, you are likely to end up with a migration that only looks correct.

Taking a baseline is also worth the trouble. After the migration, you can say not just that the site feels faster, but where and by how much. In this case, the build time and output size improvements were especially clear.

Using a separate reviewer also helped. Just as humans miss issues in their own code, AI misses issues in its own work. A different perspective caught the sitemap and OGP problems.

## Closing

This migration was largely AI-led. Still, it was not that AI magically handled everything. The process was: define detailed conditions, make it read logs, fix failures, and then review the result from another angle.

For a personal site with a solid build and test loop, AI-led framework migration feels very realistic.

Next time, I would add snapshot tests for SEO metadata and sitemap URLs before starting the migration. Since the reviewer caught those issues this time, they should be guarded mechanically from the beginning.
