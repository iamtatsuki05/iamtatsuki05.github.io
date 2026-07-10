---
title: 我几乎把从 Next.js 迁移到 Astro 的工作都交给了 AI
summary: 记录我把这个网站从 Next.js 迁移到 Astro 的过程，从实现到验证基本都交给了 Codex。
headerAlt: 显示代码的屏幕
---

## 开始

我把这个网站从 Next.js 迁移到了 Astro。

这不是因为我讨厌 Next.js。也不是因为 Next.js 让我遇到了多严重的问题。只是重新看这个网站实际在做什么时，我觉得它有点太重了。博客、链接集、公开成果列表、语言切换、深色模式。说到底，它基本上是一个静态网站。

但我还背着 App Router、static export、图片优化、Cloudflare Pages 的配置。它当然能工作，只是相对于网站规模来说，随身行李有点多。

所以我迁到了 Astro。

这次我不再自己一点点改，而是几乎都交给了 Codex。实现、迁移前后的测量、测试、失败点修复、reviewer 的反馈处理，作为一整段工作交给了它。

说「交给 AI」听起来有点粗糙。我实际做的，是把不能弄坏的东西细细列出来，然后让它一直跑到结束。

## 我想改变什么

这次迁移的目的不是追逐流行框架。

这个网站的大部分页面都在构建时确定。没有登录，也几乎不需要服务器动态返回内容。确实有 React component，但并不是所有东西都需要一直在 client-side 运行。

既然如此，把静态网站当作静态网站来处理会更自然。

换成 Astro 后，页面放在 `src/pages/**`，共用 layout 由 Astro 侧持有。只有确实需要客户端行为的 React component 继续作为 island 保留。这个分法很适合我的网站。

不过，framework migration 并不是画面看起来一样就结束了。URL、SEO、OGP、sitemap、RSS、Cloudflare Pages、accessibility、语言切换、theme toggle，这些地方都很容易漏。

所以一开始，我就把「不能弄坏什么」比较细地交给了 Codex。

## 我怎么让 Codex 做

我没有只对 Codex 说「迁移到 Astro」。

我要求它保留现有外观、URL、SEO、accessibility、Cloudflare Pages 的部署路径。还要求比较迁移前后的 build time、输出大小、Lighthouse 结果；通过 lint、typecheck、Vitest、E2E、preview smoke check；最后再让另一个 read-only reviewer 看一遍。

大概就是这样交代的。

把工作交给 AI 时，只给实现方向是危险的。尤其是迁移工作。页面能显示，并不代表 sitemap 正确、OGP meta 没掉、Cloudflare 的 cache header 没指向旧路径。

所以这次我先约束的是完成条件，而不是具体实现方法。

## 先取 baseline

迁移前，Codex 先测了 Next.js 版的状态。

它跑了 `bun run build`，检查输出大小、代表性 HTML 的大小，运行 lint、Vitest、Playwright E2E，并收集 mobile / desktop 的 Lighthouse 结果。

这一步不华丽，但可能是最有用的。迁移是替换一个已经能工作的东西，没有 baseline 就很难判断结果到底是变好了、坏了，还是只是刚好能动。

结果 build time 和输出大小改善得很清楚，所以提前取 baseline 很值得。

## 实际改变了什么

Next.js App Router 的 `src/app/**` 消失了，换成了 Astro 的 `src/pages/**`。
共用 layout 移到了 `BaseLayout.astro`，已有的 React component 只在需要的地方作为 Astro island 留下。

这不是一次完全重写，UI component 尽量保留了下来。我想改变的是和 framework 的边界。

我放了小的 local wrapper 来替代 `next/link`、`next/image`、`next/navigation`。`next-themes` 和 `nuqs` 也移除了，只留下这个网站实际需要的行为，用 local 实现处理。

RSS、sitemap、robots、metadata、OGP、JSON-LD 也改成在 Astro 侧生成。Cloudflare Pages 的 workflow 也改成以 Astro build 为前提。

这些变化不花哨。但要把 framework 的前提一个个拆掉，中心工作本来就是这种朴素的替换。

## 卡住的地方

最麻烦的是 hydration。

在 Next.js 中自然作为 client component 运行的东西，到了 Astro 里，如果不显式加上 `client:load` 之类的 directive，就不会运行。最初的 E2E 很正常地失败了。

英文页面里 language switch 的 active state 会错。theme toggle 一直停在 placeholder。Publications 的 filter 不工作。从英文页面进入 blog detail 时，日期还是日语格式。

这些都是只粗略看画面时很容易漏掉的问题。

Codex 一边读 E2E 的 failure log 一边修。把当前 pathname 从 Astro 传给 Header，把 theme provider 放进 Header island，让 Publications page 自身 hydrate。做的事情和我自己手动迁移时会做的基本一样。

不同的是这个循环很快。读日志，提出假设，修改，再跑测试，它一直比较耐心地重复这套流程。

## reviewer 捡到的东西

整体能跑之后，我让另一个 read-only reviewer 看了差分。
这里捡到的东西很关键。

sitemap 里还残着实际并不存在的 publication detail URL。blog article 的 `article:published_time` 等 OGP meta 也掉了。Cloudflare headers 仍然指向 `/_next/static/*`，没有作用到 Astro 的 `/_astro/*`。

这些只靠普通地操作页面很难发现。页面能显示，链接也能点。但 SEO 和部署细节已经坏了。

收到指摘后，Codex 修了 sitemap、article meta、cache header、base path 对应。最后还直接看了生成后的 HTML，确认 meta tag 真的存在。

这个 review 加得很好。AI 写的东西再让 AI 看，也可能沿着同一套前提漏掉同样的地方。换一个视角，能捡到的东西会变。

## 数字

最终通过了这些检查。

- TypeScript
- lint
- Vitest: 42 files / 152 tests
- Chromium E2E: 50 tests
- Storybook build
- Astro build
- Playwright 的 visual smoke

| 项目 | Next.js | Astro |
| --- | ---: | ---: |
| build time | 26.74s | 3.41s |
| static output | 11M | 5.5M |
| framework cache/output | `.next` 184M | `.astro` 12K |

build time 缩到了原来的八分之一。输出大小也减半了。

Lighthouse 在 desktop 的所有检查 route 上都有改善。mobile 也几乎都改善了。只有 blog detail 的 performance score 从 `72` 到 `71`，降了 1 分，但 LCP 从 `11040ms` 到 `8836ms`，TBT 从 `65ms` 到 `28ms`，实际指标是改善的。

对这个规模的个人网站来说，结果已经足够好。

## 结束

这次迁移让我觉得，越是把工作交给 AI，越需要把完成条件写清楚。

如果只说「迁移到 Astro」，大概也能到网站看起来能动的程度。可是把 URL、SEO、deploy、performance、E2E、review 都算进去，最开始写清楚条件就很有意义。

人这边做的最大工作，是决定什么不能坏。代码我几乎没写。

个人网站这种规模，只要 build 和 test 的循环已经存在，AI 主导的 framework migration 是现实的。只是如果人没有掌握「怎样才算完成」，它很容易停在「看起来能动」。

下次再做类似迁移，我会先加 SEO metadata 和 sitemap URL 的 snapshot test。因为这次 reviewer 捡到的正是这些地方，所以一开始就应该让机器守住。
