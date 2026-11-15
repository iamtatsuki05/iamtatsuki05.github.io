# iamtatsuki05.com

[English](README.md) | [日本語](README_JA.md)

Personal site built with Astro, React islands, and Tailwind CSS. Bun runs the scripts. The static output in `out/` is deployed to Cloudflare Pages.

## Setup

```shell
bun install
```

## Commands

```shell
bun dev                  # generate blog data, then start the Astro dev server at http://localhost:3000
bun run build            # generate blog data and images, build into out/, then write Markdown copies for agents
bun run start            # serve out/ at http://localhost:3000
bun run lint             # Biome
bun run vitest:run       # unit tests (tests/components, tests/lib)
bun run e2e:run          # Playwright E2E tests on Chromium
bun run e2e:open         # Playwright UI mode
bun run test             # vitest:run + e2e:run
bun run storybook        # Storybook at http://localhost:6006
bun run storybook:build  # static Storybook in storybook-static/
bun run translate:blogs:prompt -- --help  # print a prompt for an agent to translate blog posts
```

Set `STORYBOOK_DISABLE_TELEMETRY=1` to opt out of Storybook telemetry.

## Environment variables

All are optional. See `src/lib/config/env.ts`.

```shell
NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX  # or PUBLIC_GOOGLE_ANALYTICS_ID
SITE_URL=https://iamtatsuki05.com             # default: localhost:3000 in development, iamtatsuki05.com otherwise
NEXT_PUBLIC_BASE_PATH=                        # or PUBLIC_BASE_PATH
INCLUDE_DRAFTS=true                           # include blog posts with draft: true
```

## Docker

```shell
docker compose up -d --build app      # dev server with hot reload at http://localhost:3000
docker compose up -d --build preview  # production build served at http://localhost:3001
docker compose exec app sh            # open a shell (exit to leave)
docker compose stop                   # stop; docker compose start to restart
```

## Content

- Blog posts: `src/content/blogs/*.md` (Japanese source). Translations live in `src/content/blog-translations/{en,zh,fr}/`.
- Publications: `src/content/publications/*.md`. The frontmatter schema is `PublicationFrontmatter` in `src/lib/content/types.ts`. A `paper` must set `venueType`, `region`, and `refereed`.
- CV: `src/data/cv.yaml` (education, grants, awards). The header comment lists the fields.
- Links: `src/data/links.yaml`.

## Directory structure

```text
.
├── .github/workflows   # CI, bundle size, Lighthouse, Cloudflare Pages deploy
├── .storybook
├── e2e                 # Playwright tests
├── functions           # Cloudflare Pages Functions (Markdown content negotiation)
├── public
├── scripts             # build-time generators and the static server
├── src
│   ├── components
│   ├── content         # blogs, blog-translations, publications
│   ├── data            # cv.yaml, links.yaml, generated image metadata
│   ├── layouts
│   ├── lib
│   ├── locales         # ja, en, zh, fr
│   ├── pages
│   ├── stories
│   └── styles
├── tests               # Vitest tests
├── astro.config.mjs
├── biome.json
├── compose.yml
├── Dockerfile
├── package.json
├── playwright.config.ts
└── vitest.config.mts
```

## Routing and feeds

- Pages: Home, Blog, Publications, CV, Hobbies, Links. Japanese is served at the root, and each page also has locale-prefixed routes for ja, en, zh, and fr.
- `/sitemap.xml`, `/robots.txt`, and `/rss.xml` are generated at build time.

## Deployment

- Work happens on branches merged into `develop`. A "Sync: Develop to Main" PR then merges `develop` into `main`.
- `.github/workflows/deploy-cloudflare.yml` runs on every push to `main` and `develop`. It runs the PR test workflow, builds the site and Storybook (served at `/storybook`), and publishes `out/` to Cloudflare Pages under the pushed branch name.
- On `main` only, the same job checks that https://iamtatsuki05.com serves the Markdown `Link` header and then gates on the agent readiness level from isitagentready.com. Preview deployments sit behind Cloudflare Access, so `develop` skips this check.
