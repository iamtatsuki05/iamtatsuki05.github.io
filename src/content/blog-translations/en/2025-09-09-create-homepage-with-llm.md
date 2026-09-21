---
title: Building This Website Together with an LLM
summary: A short walkthrough of how I created this site through vibe coding.
headerAlt: Illustration of vibe coding
---

## Introduction

I had wanted to build a personal introduction site for a while, but I never had enough time to start. Recently, vibe coding, where you drive tools such as Claude Code and Codex through conversation, has become a popular topic. When I finally had some time, I built this site that way.

## Process

Here is what I did:

- Define requirements
- Ask Codex to implement them
- Give feedback on the generated code several times
- Write the self-introduction text myself, then ask AI to polish it

### Requirements Definition

I use ChatGPT Plus, so I started from there. I gave GPT a bullet list of routing ideas and the technical stack, then asked it to turn them into requirements.

<details>
<summary>Prompt</summary>

```plaintext
I want to create my own web page.
Please help me think through the requirements.
I do not need implementation yet. Please create a requirements document that I can give to Codex.

## Routing idea
- Structure
    - /
        - Self-introduction and routing overview
        - /links
            - External URLs
        - /articls
            - Articles, papers, and similar items
        - /blogs
            - Articles rendered from Markdown

## Implementation requirements
- Use TypeScript and Next.js for a modern React-based UI/UX.
- Use GitHub Pages to build the static site automatically and keep operating cost down.
- I do not want to touch code every time I update the blog, so writing Markdown should be enough to build automatically.
- Pages other than the ones generated from Markdown, such as the home page, should support both Japanese and English.
- The route name "articles" may not be ideal, because I will write about papers I have authored and technical blog posts on external sites.

```
</details>

<details>
<summary>Requirements Output</summary>

```plaintext
# Overview

Requirements definition for a personal website. A modern UI/UX built with TypeScript + Next.js. It is built and hosted automatically on GitHub Pages, and the site is regenerated whenever Markdown is updated.

---

## 1. Purpose / Deliverables

* **Purpose**: build a static site that brings the self-introduction, the external link collection, the article/paper listing, and blog operation together in one place and keeps the update cost minimal.
* **Deliverables**: a repository that follows these requirements, the design and component set, CI/CD (GitHub Actions), content templates, and a full set of documentation.

---

## 2. Information Architecture / Routing

### 2.1 Route structure (proposal)

* `/`

  * Self-introduction (supports JP/EN switching)
  * Entry points into the main sections
* `/links`

  * List of external URLs (social accounts, GitHub, talk slides, and so on)
* `/publications` (name under review, see §2.2 for details)

  * Collected metadata for authored papers, technical blog posts on external sites, and similar work (card list + detail)
* `/blogs`

  * List of blog articles generated from Markdown + detail

> ※ `/articls` → fix the typo. `/articles` is too generic, so consider the naming options below.

### 2.2 Alternatives to the "articles" name

* **/publications**: broadly covers "published work" such as peer-reviewed papers, contributed posts, and external technical blogs (recommended)
* **/writings**: written work in general (a little vague)
* **/notes**: notes and observations (suited to lighter content)
* **/library**: a collection-like framing (a little abstract)

**Selection criterion**: if the targets are "own papers + contributions to external sites + explanatory articles", make `/publications` the first choice.

### 2.3 Global navigation

* Home | Links | Publications | Blogs
* Footer: copyright, license, sitemap, RSS (for the blog)

---

## 3. Non-functional Requirements

* Fast rendering (Core Web Vitals targets: LCP < 2.5s, CLS < 0.1, INP < 200ms)
* Accessibility (targeting WCAG 2.1 AA conformance)
* SEO (OGP/Twitter Card/structured data, sitemap.xml/robots.txt)
* Responsive (mobile first)
* Easy operation (updating Markdown is all it takes, with automatic deployment from CI)

---

## 4. Implementation Stack / Policy

* **Language/framework**: TypeScript, Next.js (App Router)

  * `output: 'export'` in `next.config.js` (static export)
* **Styling**: Tailwind CSS + in-house UI components (light/dark themes)
* **Markdown processing**: use `.md` (remark/rehype based, extensible to MDX if needed)
* **Highlighting**: Shiki or rehype-prism-plus
* **Image optimization**: statically generated images (watch how `next/image` behaves on export)
* **Icons**: lucide-react recommended
* **State management**: minimal (essentially static, no more than search/filter)

---

## 5. Internationalization (i18n)

* **Scope**: static UI such as the top page, excluding Markdown-generated pages, must be switchable between **Japanese and English**.
* **Approach**: adopt `next-intl` or `next-i18next`. Manage dictionaries under `/locales/ja|en/*.json`.
* **Language switch UI**: a toggle in the header (ja/en). Keep the language in a cookie or a URL prefix (/ja, /en).
* **Default language**: Japanese (ja).

---

## 6. Content Design

### 6.1 Directory structure (example)

/content
  /blogs
    yyyy-mm-dd-slug.md
  /publications
    item-*.md
/data
  links.yaml
/public
  /images

### 6.2 Frontmatter definitions

* **Blog (/blogs)**

  * `title` (string, required)
  * `date` (ISO string, required)
  * `updated` (ISO string, optional)
  * `tags` (string\[])
  * `summary` (string)
  * `thumbnail` (path)
  * `draft` (boolean)
* **Published work (/publications)**

  * `title` (string, required)
  * `type` (enum: paper | article | talk | slide | media)
  * `publishedAt` (ISO string)
  * `venue` (string) / `publisher` (string)
  * `authors` (string\[])
  * `links` ({ kind: 'pdf'|'doi'|'post'|'slides'|'video'|'code', url: string }\[])
  * `tags` (string\[])
  * `abstract` (string, optional)

### 6.3 Links page data

* Define `{ title, url, desc, icon? }[]` in `/data/links.yaml`. Categories are allowed.

### 6.4 List/detail UI

* Shared card layout, tags/search (client side)
* Pagination (blog)
* Drafts are excluded from the build (previewable only on PRs in CI)

---

## 7. Build / Deploy (GitHub Pages)

* **Repository**: `<user>/<user>.github.io`, or any repository plus a `gh-pages` branch
* **CI/CD**: GitHub Actions workflow

  1. Runs on `push` to `main`
  2. `bun install` / `bun build` (`next build && next export`)
  3. Deploy `out/` to Pages
* **Custom domain** (optional): configure `CNAME`
* **Routing note**: generate `404.html`/`index.html` correctly for the static export

---

## 8. Developer Experience (DX)

* Package manager: `bun`
* Lint/Format: ESLint + Prettier + stylelint (as needed)
* Type safety: strict mode, frontmatter validation with `zod`
* Tests: basic snapshots (Vitest + Testing Library)
* Commit convention: Conventional Commits + Changeset (optional)

---

## 9. Per-page Requirements

### 9.1 `/` (top page, i18n target)

* Self-introduction (title, short bio, photo)
* Highlights of the latest blog posts and published work
* Language switch, theme switch

### 9.2 `/links`

* Link cards grouped by category (with icons and descriptions)

### 9.3 `/publications` (equivalent to the former `articles`)

* List: filters (type, year, tag) and search
* Detail: metadata + external links (DOI, PDF, and so on)

### 9.4 `/blogs`

* List: newest first, tags/search, pagination
* Detail: table of contents (auto-generated), footnotes, code blocks, OGP generation

---

## 10. Security/Privacy

* Load external embeds only after consent (YouTube and similar)
* CSP header (meta-based where possible)

---

## 11. Acceptance Criteria (excerpt)

* Adding an article .md on GitHub → merging into `main` builds and deploys automatically, and it goes live within a few minutes
* `/` can switch between ja/en, and `/blogs` articles can be published from Markdown alone
* Filtering and search on `/publications` work on the client
* The LCP/CLS/INP targets are met in lab tests
* Basic accessibility checks (keyboard operation, contrast, labels) pass

---

## 12. Implementation Notes (specifics for Codex)

* **Markdown processing idea**: parse with `gray-matter` + `remark/rehype`, together with `zod` for type safety
* **OGP**: statically generate dynamic images at `/blogs/[slug]/opengraph-image` (Satori + html-to-image)
* **Search**: simple full-text search with `Fuse.js` on the client
* **Theme**: dark mode with `next-themes`

---

## 13. Future Extensions (optional)

* Automatic feed generation (RSS/Atom)
* Automatic updates for the feed and sitemap
* Comments (external: Giscus and similar)
* Contact form (integration with an external form)

---

## 14. Undecided Items / Open Questions

* Final decision on the formal name of `/publications`
* Design direction for the top page (minimal, bold, photo-heavy, and so on)
* Policy for generating eyecatch images (manual or automatic)
* Wording for the English top page (how to express any differences from the Japanese)

---

## Appendix: Sample `links.yaml`

```yaml
- title: GitHub
  url: https://github.com/yourname
  desc: Source code and projects
  icon: github
- title: X (Twitter)
  url: https://x.com/yourname
  desc: Day-to-day updates
  icon: x
```
</details>

### Asking Codex

I set up Codex using the article below as a reference. Then I gave it the requirements above and moved forward with development.

https://zenn.dev/dely_jp/articles/codex-cli-matome#%E3%81%AA%E3%81%9C%E4%BB%8A%E3%80%81codex-cli%E3%81%8C%E8%A9%B1%E9%A1%8C%E3%81%AA%E3%81%AE%E3%81%8B%EF%BC%9F

### Feedback on the Generated Site

I ran the site, pointed out anything that felt off in a few words, and let Codex fix it. I repeated that a few times.

## Impressions

I barely implemented anything myself, yet a practical site came together in a short time. I kept Reasoning Effort at high in ChatGPT Plus and never hit a rate limit.

Development with a coding agent works well enough with only minimal hands-on experience. There was not much stress, either.
