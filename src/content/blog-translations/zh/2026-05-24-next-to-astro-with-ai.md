---
title: 我几乎把从 Next.js 迁移到 Astro 的工作都交给了 AI
summary: 这篇文章记录了我如何让 Codex 负责把本站从 Next.js 迁移到 Astro，并完成实现、验证和后续修正。
headerAlt: 显示代码的屏幕
---

## 前言

这个网站原本使用 Next.js 的静态导出运行。它是一个常见的个人网站：可以写博客，有链接集和公开成果列表，也有日英切换和深色模式。

不过从实际情况看，它几乎就是一个静态网站。Next.js 本身并没有造成严重问题，但 App Router、静态 export、图片优化以及 Cloudflare Pages 周边配置，对这个网站来说开始显得有些重。

于是我把它迁移到了 Astro。这一次，我不仅把实现交给 Codex，也让它负责调查、迁移前后的测量、测试和 review 后的修正。

说成“全部交给 AI 做”听起来很粗糙，但实际做法是先给出非常具体的完成条件，再让它在这个范围内持续推进。本文就是这次过程的记录。

## 我是怎么下指令的

最初给 Codex 的并不是简单一句“迁移到 Astro”。

我要求它保持现有外观、URL、SEO、可访问性和 Cloudflare Pages 的部署路径；比较迁移前后的 build time、输出大小和 Lighthouse 指标；通过 lint、类型检查、Vitest、E2E 和 preview smoke check；最后再让另一个 read-only reviewer 检查。

让 AI 做事时，只给实现方向是危险的。尤其是 framework migration，有时页面看起来能显示，但 sitemap 或 OGP 已经坏了。所以这次我先把“做到什么才算完成”写清楚。

## 先测量迁移前状态

作业一开始，Codex 先测量了 Next.js 版本的 baseline。

它执行了 `bun run build`，检查输出大小和主要 HTML 的大小，并运行 lint、Vitest、Playwright E2E，以及 mobile / desktop 的 Lighthouse。

这一步很朴素，但很有价值。迁移不是“修好坏掉的东西”，而是“不破坏已经正常工作的东西，并把底层替换掉”。没有 baseline，就没有判断依据。

## 改了什么

实现上，`src/app/**` 下的 Next.js App Router 被移除，改成了 `src/pages/**` 下的 Astro routes。共通 layout 移到 `BaseLayout.astro`，现有 React component 只在需要的地方作为 Astro island 保留。

这不是完全重写。相反，UI component 尽量保持原样。真正改变的是 framework 边界。

例如，`next/link`、`next/image`、`next/navigation` 被很小的 local wrapper 替代。`next-themes` 和 `nuqs` 也被移除，只在本网站需要的范围内做了本地实现。

RSS、sitemap、robots、metadata、OGP 和 JSON-LD 也改由 Astro 侧生成。Cloudflare Pages 的 workflow 也调整为 Astro build 前提。

## 没有那么顺利的地方

最卡的是 hydration。

在 Next.js 里自然作为 client component 运行的东西，在 Astro 里如果不显式写 `client:load` 等 directive，就不会运行。第一次 E2E 很正常地失败了。

具体来说，英文页面上的 language switch active state 错了，theme toggle 停留在 placeholder 状态，Publications 的 filter 也不能工作。从英文页面进入 blog detail 时，日期仍然显示成日文格式。

Codex 一边读 E2E failure log，一边查看 DOM，然后逐步修复。它从 Astro 把当前 pathname 传给 Header，把 theme provider 放进 Header island，并让 Publications page 本身 hydrate。

如果我自己手动迁移，大概也会做同样的事情：看 Playwright 日志、看 DOM、修正。Codex 让这个循环快了很多。

## Review 发现了什么

基本能运行之后，我让另一个 read-only reviewer 看了差分。这里发现了几个重要问题。

sitemap 里还残留了实际上不存在的 publication detail URL。blog article 的 `article:published_time` 等 OGP meta 也丢了。Cloudflare 的 headers 仍然是 `/_next/static/*`，没有改成 Astro 的 `/_astro/*`。

这些问题普通 E2E 很难发现。页面会显示，链接也能点，但 SEO 和部署细节可能已经坏了。

收到指摘后，Codex 修复了 sitemap、article meta、cache header 和 base path 支持。最后还直接检查生成后的 HTML，确认 meta tag 确实输出了。

## 数字

最终通过了以下检查：

- TypeScript
- lint
- Vitest: 42 files / 152 tests
- Chromium E2E: 50 tests
- Storybook build
- Astro build
- Playwright visual smoke

| 项目 | Next.js | Astro |
| --- | ---: | ---: |
| build time | 26.74s | 3.41s |
| static output | 11M | 5.5M |
| framework cache/output | `.next` 184M | `.astro` 12K |

build time 明显缩短，输出大小也差不多减半。

Lighthouse 在 desktop 的所有对象 route 上都有改善。mobile 也几乎都改善了。只有 blog detail 的 performance score 从 `72` 到 `71` 少了 1 分，但 LCP 从 `11040ms` 改善到 `8836ms`，TBT 从 `65ms` 改善到 `28ms`，所以这更像 Lighthouse 的权重或运行波动，而不是用户能感受到的退步。

对这个规模的个人网站来说，这已经足够。

## 做完之后的想法

即使说把工作交给 AI，也不是完全放着不管。

这次人类这边最重要的工作不是实现，而是决定“什么不能坏”。URL、SEO、部署、performance、测试。先把这些写清楚，AI 就能相当坚持地推进。

反过来，如果不写这些，很容易变成只是看起来能动的迁移。

baseline 也麻烦但值得做。迁移之后可以不只是说“感觉变快了”，而是用数字说明哪里变快、变了多少。这次 build time 和输出大小的改善尤其明显。

另外，让另一个 reviewer 看也很有效。就像人会漏看自己写的代码，AI 也会漏看自己的工作。另一个视点发现了 sitemap 和 OGP 的问题。

## 结语

这次迁移很大程度上由 AI 主导。不过并不是 AI 自动“感觉很好”地做完，而是先给细致条件，让它读日志，失败就修，最后再从另一个视角检查。

对于有 build 和 test loop 的个人网站来说，AI 主导的 framework migration 已经相当现实。

下次再做的话，我会先加入 SEO metadata 和 sitemap URL 的 snapshot test，再开始迁移。因为这次 reviewer 发现了这些问题，所以之后应该从一开始就用机器检查守住。
