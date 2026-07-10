---
title: I Let AI Handle Almost the Entire Migration from Next.js to Astro
summary: A record of letting Codex handle the migration of this site from Next.js to Astro, from implementation through verification.
headerAlt: A screen showing code
---

## Introduction

I moved this site from Next.js to Astro.

It was not because I had started to hate Next.js. I was not in serious trouble either. But when I looked at what this site actually does, Next.js had begun to feel a little too large for it. It has a blog, links, publications, language switching, and dark mode. Most of it is a static site.

Still, I was carrying App Router, static export, image optimization, and Cloudflare Pages configuration. It worked, of course, but the site had more baggage than its size called for.

So I moved it to Astro.

This time I stopped rewriting things by hand and handed almost all of the work to Codex. Not only the implementation, but also before-and-after measurements, tests, fixes for failed checks, and review follow-up.

"I let AI do it" sounds a bit sloppy. What I actually did was give it a detailed list of things it must not break, then let it run to the end.

## What I Wanted to Change

The goal was not to jump onto a fashionable framework.

Most pages on this site are decided at build time. There is no login. There is almost no need to return dynamic content from a server. There are React components, but they do not all need to run on the client all the time.

If so, it makes sense to treat the site as a static site.

With Astro, pages live under `src/pages/**`, and the shared layout can be owned by Astro. Only the React components that need client-side behavior stay as islands. That split fit this site well.

But a framework migration is not done just because the page looks right. URLs, SEO, OGP, sitemap, RSS, Cloudflare Pages, accessibility, language switching, and the theme toggle are all easy places to miss things.

So before anything else, I gave Codex a detailed list of what it was not allowed to break.

## How I Asked Codex

I did not simply tell Codex, "migrate this to Astro."

I told it to preserve the existing appearance, URLs, SEO, accessibility, and Cloudflare Pages deployment path. I told it to compare build time, output size, and Lighthouse results before and after the migration. I also asked it to pass lint, typecheck, Vitest, E2E, and preview smoke checks, then have a separate read-only reviewer inspect the result.

That was the shape of the request.

When delegating to AI, an implementation direction alone is not enough. This is especially true for migrations. A page can display correctly while the sitemap is wrong, OGP metadata is missing, or Cloudflare cache headers still point at the old path.

So this time, I constrained the definition of done before I cared about the implementation details.

## Taking a Baseline First

Before the migration, Codex measured the existing Next.js version.

It ran `bun run build`, checked output size, inspected representative HTML sizes, ran lint, Vitest, Playwright E2E, and collected Lighthouse results for mobile and desktop.

Plain work, but it may have mattered most. Migration replaces something that already works, so without a baseline it is hard to tell whether the result is better, broken, or merely lucky.

In this case, build time and output size improved clearly, so I was glad the baseline existed.

## What Actually Changed

The Next.js App Router under `src/app/**` disappeared and was replaced by Astro routes under `src/pages/**`.
The shared layout moved to `BaseLayout.astro`, and the existing React components remained only where they were needed as Astro islands.

It was not a full rewrite; I kept the UI components as much as possible. What I wanted to change was the boundary with the framework.

Small local wrappers replaced `next/link`, `next/image`, and `next/navigation`. I also removed `next-themes` and `nuqs`, and kept only the behavior this site actually needs as local code.

RSS, sitemap, robots, metadata, OGP, and JSON-LD are now generated on the Astro side. The Cloudflare Pages workflow was updated for the Astro build too.

None of this is flashy. But removing framework assumptions one by one mostly looks like this kind of steady replacement.

## Where It Got Stuck

The biggest issue was hydration.

Things that naturally ran as client components in Next.js do not run in Astro unless directives such as `client:load` are set explicitly. The first E2E run failed normally.

The active state of the language switch was wrong on English pages. The theme toggle stayed as a placeholder. The Publications filter did not work. When entering a blog detail page from an English page, the date was still formatted in Japanese.

These are exactly the kind of problems that are easy to miss if you only glance at the page.

Codex fixed them while reading the E2E failure logs. It passed the current pathname from Astro to the Header, put the theme provider inside the Header island, and hydrated the Publications page itself. The work was the same kind of thing I would have done by hand.

The difference was the speed of the loop. It kept reading logs, making a hypothesis, fixing the code, and running the tests again.

## What the Reviewer Caught

After the site worked end to end, I asked a separate read-only reviewer to inspect the diff.
That caught several important details.

The sitemap still contained publication detail URLs that did not actually exist. Blog article OGP metadata such as `article:published_time` had disappeared. Cloudflare headers still targeted `/_next/static/*` instead of Astro's `/_astro/*`.

These are hard to notice by just using the site. The page displays. Links work. But SEO and deployment details are still broken.

After the review, Codex fixed the sitemap, article metadata, cache headers, and base path handling. At the end, it inspected the generated HTML directly and confirmed the meta tags were present.

That review was worth adding. When AI reviews what AI wrote, it can miss things under the same assumptions. A separate perspective changes what gets caught.

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

Build time dropped to an eighth of what it was. Output size is half.

Lighthouse improved on every checked desktop route. Mobile improved on almost every route too. The blog detail performance score dropped by one point, from `72` to `71`, but LCP improved from `11040ms` to `8836ms`, and TBT improved from `65ms` to `28ms`.

For a personal site of this size, that is a good result.

## Closing

What I felt from this migration is that the more I delegate to AI, the more clearly I need to write the completion criteria.

If I had only said "migrate this to Astro," it probably would have reached the point where the site appeared to work. But once URLs, SEO, deployment, performance, E2E, and review are included, defining the conditions first matters a lot.

The biggest human job was deciding what must not break. I barely wrote any code.

For a personal site of this size, if the build and test loop already exists, AI-led framework migration is realistic. But if the human side does not own the definition of done, the migration can easily stop at "it looks fine."

Next time I do a similar migration, I would add snapshot tests for SEO metadata and sitemap URLs before starting. Those were the points the reviewer caught this time, so I want them guarded mechanically from the beginning.
