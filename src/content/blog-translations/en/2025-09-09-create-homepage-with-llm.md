---
title: Building This Website Together with an LLM
summary: A short walkthrough of how I created this site through vibe coding.
headerAlt: Illustration of vibe coding
---

## Introduction

I had been vaguely wanting to build a personal introduction site, but I never had enough time to start. Recently, "vibe coding," a development style based on conversation and momentum with tools such as Claude Code and Codex, has become a popular topic. When I finally had some time, I tried building this personal site with that approach.

## Process

The rough process was:

1. Define requirements
2. Ask Codex to implement them
3. Give feedback on the generated code several times
4. Write the self-introduction text myself, then ask AI to polish it

### Requirements Definition

Because I use ChatGPT Plus, I started from there. I gave GPT a bullet list of routing ideas and the technical stack, then asked it to turn them into requirements.

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
- Use GitHub Pages for a static site to reduce operating cost.
- I do not want to touch code every time I update the blog, so writing Markdown should be enough to build automatically.
- Pages other than Markdown-generated blog pages, such as the home page, should support both Japanese and English.
- The route name "articles" may not be ideal because it will include papers and external technical posts.
```
</details>

<details>
<summary>Requirements Output</summary>

```plaintext
# Overview

A requirements definition for a personal website. It uses TypeScript + Next.js for a modern UI/UX, deploys statically on GitHub Pages, and minimizes update cost by rebuilding from Markdown content.

## 1. Purpose / Deliverables

* Purpose: consolidate self-introduction, external links, publication/article references, and blog operations into a static site with minimal maintenance.
* Deliverables: repository, design/components, CI/CD, content templates, and documentation.

## 2. Information Architecture / Routing

* `/`: self-introduction, JP/EN switching, links to major sections
* `/links`: external URLs such as SNS, GitHub, and slides
* `/publications`: papers, external technical posts, and other published work
* `/blogs`: Markdown-based blog index and detail pages

The typo `/articls` should be fixed. For the section name, `/publications` is recommended because it can include papers, contributed posts, and external articles.

## 3. Non-functional Requirements

* Fast rendering with Core Web Vitals in mind
* Accessibility with WCAG 2.1 AA as a target
* SEO with OGP, Twitter Card, structured data, sitemap, and robots
* Responsive design
* Easy operation through Markdown updates

## 4. Stack / Implementation Policy

* TypeScript and Next.js App Router
* Static export for GitHub Pages
* Tailwind CSS and custom UI components
* Markdown parsing with gray-matter, remark/rehype, and zod
* Client-side search and filters where needed

## 5. i18n

* Static UI such as the home page should support Japanese and English.
* Use a URL prefix or similar mechanism to preserve language.
* Japanese is the default language.

## 6. Content Design

Blog frontmatter should include `title`, `date`, `updated`, `tags`, `summary`, `thumbnail`, and `draft`.

Publication frontmatter should include `title`, `type`, `publishedAt`, `venue`, `publisher`, `authors`, `links`, `tags`, and `abstract`.

## 7. Build / Deploy

Use GitHub Actions to build on push to the main branch and deploy the `out/` directory to GitHub Pages.

## 8. Acceptance Criteria

* Adding a Markdown article and merging to `main` automatically builds and deploys the site.
* `/` supports ja/en switching, and `/blogs` can publish articles from Markdown only.
* `/publications` filtering and search work on the client.
* LCP/CLS/INP goals are checked in lab tests.
* Basic accessibility checks pass.
```
</details>

### Asking Codex

After setting up Codex, I gave it the requirements above and moved forward with development. I used the following article as a reference while setting things up:

https://zenn.dev/dely_jp/articles/codex-cli-matome#%E3%81%AA%E3%81%9C%E4%BB%8A%E3%80%81codex-cli%E3%81%8C%E8%A9%B1%E9%A1%8C%E3%81%AA%E3%81%AE%E3%81%8B%EF%BC%9F

### Feedback on the Generated Site

I repeatedly ran the site, pointed out anything that felt off, and asked for improvements.

## Impressions

Even without implementing most of the site myself, I was able to build something practical in a short time. I kept Reasoning Effort at high in ChatGPT Plus, and the development process remained comfortable without hitting rate limits.

I felt that coding agents can be very effective as long as you have enough hands-on experience to evaluate the result. Working together with AI made the process much less stressful.
