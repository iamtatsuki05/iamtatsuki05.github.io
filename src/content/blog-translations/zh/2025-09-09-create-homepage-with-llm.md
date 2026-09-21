---
title: 和 LLM 一起制作这个网站的过程
summary: 介绍我如何通过 Vibe Coding 制作这个网站。
headerAlt: Vibe Coding 的示意图
---

## 前言

我一直想做一个自我介绍页面，但总没有时间开始。最近，通过对话驱动 Claude Code 和 Codex 等工具的 Vibe Coding 很受关注。正好有了时间，于是我用这种方式做了这个网站。

## 制作过程

我做的事情如下：

- 定义需求
- 交给 Codex
- 多次给生成代码反馈
- 自己写自我介绍等文字，再让 AI 润色

### 需求定义

因为我使用 ChatGPT Plus，所以这次从它开始。我用项目符号告诉 GPT 页面路由和技术栈，然后请它整理成需求文档。

<details>
<summary>请求内容</summary>

```plaintext
我想制作自己的网页。
请帮我一起整理需求。
现在不需要具体实现，请先写一份可以交给 Codex 的需求定义书。

## 页面路由草案
- 结构
    - /
        - 写自我介绍和路由说明
        - /links
            - 外部 URL
        - /articls
            - 文章、论文等
        - /blogs
            - 从 Markdown 渲染的文章

## 实现要求
- 使用 TypeScript 和 Next.js，做成基于 React 的现代 UI/UX。
- 使用 GitHub Pages 自动构建静态站点，降低运维成本。
- 博客更新时不想每次都改代码，所以希望只写 Markdown 就能自动构建。
- Markdown 生成页面以外的首页等页面，希望支持日语和英语。
- articles 这个路由名可能不太合适，因为里面会写自己撰写的论文和外部站点的技术博客。

```
</details>

<details>
<summary>需求定义结果</summary>

```plaintext
# 概要

个人网站的需求定义。使用 TypeScript + Next.js 打造现代的 UI/UX。通过 GitHub Pages 自动构建与托管，并以 Markdown 更新为触发条件重新生成网站。

---

## 1. 目的 / 交付物

* **目的**：把自我介绍、外部链接集、文章/论文介绍、博客运营整合到一处，构建一个把更新成本降到最低的静态网站。
* **交付物**：符合本需求的代码仓库、设计/组件、CI/CD（GitHub Actions）、内容模板、整套文档。

---

## 2. 信息架构 / 路由

### 2.1 路由结构（草案）

* `/`

  * 自我介绍（支持 JP/EN 切换）
  * 通往主要板块的入口
* `/links`

  * 外部 URL 列表（SNS、GitHub、演讲资料等）
* `/publications`（名称待定，详见 §2.2）

  * 汇总自己撰写的论文、外部站点技术博客等的元信息（卡片列表 + 详情）
* `/blogs`

  * 由 Markdown 生成的博客文章列表 + 详情

> ※ `/articls` → 修正拼写错误。`/articles` 过于宽泛，因此考虑以下命名方案。

### 2.2 “articles”命名的替代方案

* **/publications**：广泛涵盖同行评审论文、投稿、外部技术博客等“公开成果”（推荐）
* **/writings**：泛指写作产出（略显含糊）
* **/notes**：备忘与思考（适合较轻的内容）
* **/library**：偏收藏集的表达（略显抽象）

**采用标准**：如果对象是“自著论文 + 外部站点投稿 + 解说文章”，则以 `/publications` 为首选。

### 2.3 全局导航

* Home | Links | Publications | Blogs
* 页脚：版权信息、许可证、站点地图、RSS（用于博客）

---

## 3. 非功能需求

* 快速加载（Core Web Vitals 目标：LCP < 2.5s, CLS < 0.1, INP < 200ms）
* 可访问性（以符合 WCAG 2.1 AA 为目标）
* SEO（OGP/Twitter Card/结构化数据、sitemap.xml/robots.txt）
* 响应式（移动优先）
* 易于运维（只更新 Markdown 即可完成，由 CI 自动部署）

---

## 4. 技术栈 / 实现方针

* **语言/框架**：TypeScript, Next.js (App Router)

  * 在 `next.config.js` 中设置 `output: 'export'`（静态导出）
* **样式**：Tailwind CSS + 自制 UI 组件（浅色/深色主题）
* **Markdown 处理**：采用 `.md`（基于 remark/rehype，必要时可扩展支持 MDX）
* **代码高亮**：Shiki or rehype-prism-plus
* **图片优化**：静态生成的图片（注意 `next/image` 在导出时的行为）
* **图标**：推荐 lucide-react
* **状态管理**：最小化（基本是静态的，最多到搜索/筛选的程度）

---

## 5. 多语言支持 (i18n)

* **适用范围**：除 Markdown 生成页面以外的首页等静态 UI，支持 **日语/英语** 切换。
* **方案**：采用 `next-intl` 或 `next-i18next`，用 `/locales/ja|en/*.json` 管理词条。
* **语言切换 UI**：在页眉放置切换开关（ja/en）。语言通过 cookie 或 URL 前缀（/ja, /en）保存。
* **默认语言**：日语（ja）。

---

## 6. 内容设计

### 6.1 目录结构（示例）

/content
  /blogs
    yyyy-mm-dd-slug.md
  /publications
    item-*.md
/data
  links.yaml
/public
  /images

### 6.2 frontmatter 定义

* **博客（/blogs）**

  * `title` (string, required)
  * `date` (ISO string, required)
  * `updated` (ISO string, optional)
  * `tags` (string\[])
  * `summary` (string)
  * `thumbnail` (path)
  * `draft` (boolean)
* **公开成果（/publications）**

  * `title` (string, required)
  * `type` (enum: paper | article | talk | slide | media)
  * `publishedAt` (ISO string)
  * `venue` (string) / `publisher` (string)
  * `authors` (string\[])
  * `links` ({ kind: 'pdf'|'doi'|'post'|'slides'|'video'|'code', url: string }\[])
  * `tags` (string\[])
  * `abstract` (string, optional)

### 6.3 Links 页面数据

* 在 `/data/links.yaml` 中定义 `{ title, url, desc, icon? }[]`。可按分类划分。

### 6.4 列表/详情 UI

* 通用卡片布局、标签/搜索（客户端）
* 分页（博客）
* Draft 不纳入构建（仅在 CI 的 PR 阶段可预览）

---

## 7. 构建 / 部署（GitHub Pages）

* **仓库**：`<user>/<user>.github.io` 或任意仓库 + `gh-pages` 分支
* **CI/CD**：GitHub Actions 工作流

  1. `push` to `main` 时执行
  2. `bun install` / `bun build`（`next build && next export`）
  3. 把 `out/` 部署到 Pages
* **自定义域名**（可选）：设置 `CNAME`
* **路由注意事项**：静态导出时要正确生成 `404.html`/`index.html`

---

## 8. 开发体验（DX）

* 包管理器：`bun`
* Lint/Format：ESLint + Prettier + stylelint（按需）
* 类型安全：strict 模式，用 `zod` 校验 frontmatter
* 测试：基础快照（Vitest + Testing Library）
* 提交规范：Conventional Commits + Changeset（可选）

---

## 9. 页面详细需求

### 9.1 `/`（首页，支持 i18n）

* 自我介绍（头衔、简要经历、照片）
* 最新博客/公开成果的亮点
* 语言切换、主题切换

### 9.2 `/links`

* 按分类展示的链接卡片（带图标/说明）

### 9.3 `/publications`（相当于原 `articles`）

* 列表：筛选（type, year, tag）与搜索
* 详情：元数据 + 外部链接（DOI/PDF 等）

### 9.4 `/blogs`

* 列表：按发布日期降序、标签/搜索、分页
* 详情：目录（自动生成）、脚注、代码块、OGP 生成

---

## 10. 安全/隐私

* 外部嵌入内容在取得 Consent（同意）后再加载（YouTube 等）
* CSP 头（在可行范围内基于 meta）

---

## 11. 验收条件（节选）

* 在 GitHub 上添加文章 .md → 合并到 `main` 后自动构建/部署，几分钟内发布
* `/` 可切换 ja/en，`/blogs` 的文章只用 Markdown 就能发布
* `/publications` 的筛选/搜索在客户端可用
* 通过 Lab 测试满足 LCP/CLS/INP 的目标值
* 通过可访问性基础检查（键盘操作、对比度、标签）

---

## 12. 实现备忘（面向 Codex 的具体化）

* **Markdown 处理方案**：用 `gray-matter` + `remark/rehype` 系列解析，并配合 `zod` 做类型安全
* **OGP**：在 `/blogs/[slug]/opengraph-image` 把动态图片静态化（Satori + html-to-image）
* **Search**：在客户端用 `Fuse.js` 做简易全文搜索
* **主题**：用 `next-themes` 实现深色模式

---

## 13. 今后的扩展（可选）

* 自动生成 Feed（RSS/Atom）
* Feed/站点地图的自动更新
* 评论（外部：Giscus 等）
* 联系表单（对接外部表单服务）

---

## 14. 未定事项 / 开放问题

* `/publications` 正式名称的最终确定
* 首页的设计调性（极简/大胆/多图等）
* 头图的生成方式（手动/自动）
* 英文版首页的文案（日英有差异时的表述）

---

## 附录：`links.yaml` 示例

```yaml
- title: GitHub
  url: https://github.com/yourname
  desc: 源码与项目
  icon: github
- title: X (Twitter)
  url: https://x.com/yourname
  desc: 日常分享
  icon: x
```
</details>

### 交给 Codex

导入 Codex 后，我参考下面的文章做了设置。在此基础上，把需求定义的结果交给它推进开发。

https://zenn.dev/dely_jp/articles/codex-cli-matome#%E3%81%AA%E3%81%9C%E4%BB%8A%E3%80%81codex-cli%E3%81%8C%E8%A9%B1%E9%A1%8C%E3%81%AA%E3%81%AE%E3%81%8B%EF%BC%9F

### 对生成物的反馈

我实际运行页面，把在意的点简短指出，让它修改。这样重复了几次。

## 感想

几乎没有亲自实现，却在短时间内做出了实用级别的页面。在 ChatGPT Plus 上我一直把 Reasoning Effort 设为 high，一次也没有碰到 rate limit。

只要有最低限度的动手经验，用 coding agent 开发就能顺利推进。压力也不大。
