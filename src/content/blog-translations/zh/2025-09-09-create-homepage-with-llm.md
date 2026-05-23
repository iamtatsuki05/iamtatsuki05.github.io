---
title: 和 LLM 一起制作这个网站的过程
summary: 介绍我如何通过 Vibe Coding 制作这个网站。
headerAlt: Vibe Coding 的示意图
---

## 前言

我一直隐约想做一个自我介绍页面，但总觉得没有时间开始。最近，利用 Claude Code 和 Codex 等工具，通过对话和势头推进开发的 “Vibe Coding” 很受关注。正好有了时间，于是我实际用这种方式制作了个人介绍网站。

## 制作过程

大致步骤如下：

1. 定义需求
2. 交给 Codex
3. 多次给生成代码反馈
4. 自己写自我介绍等文章，再让 AI 润色

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
- 使用 GitHub Pages，以静态站点形式降低运维成本。
- 博客更新时不想每次都改代码，所以希望只写 Markdown 就能自动构建。
- Markdown 生成页面以外的首页等页面，希望支持日语和英语。
- articles 这个路由名可能不太合适，因为里面会放论文和外部技术博客等内容。
```
</details>

<details>
<summary>需求定义结果</summary>

```plaintext
# 概要

个人网站需求定义。使用 TypeScript + Next.js 构建现代 UI/UX，通过 GitHub Pages 进行静态托管，并通过 Markdown 更新降低维护成本。

## 1. 目的 / 交付物

* 目的：把自我介绍、外部链接、论文和文章介绍、博客运营整合到一个维护成本低的静态网站中。
* 交付物：代码仓库、设计和组件、CI/CD、内容模板和文档。

## 2. 信息架构 / 路由

* `/`：自我介绍、日英切换、主要页面入口
* `/links`：SNS、GitHub、演讲资料等外部链接
* `/publications`：论文、外部技术文章和其他公开成果
* `/blogs`：Markdown 博客列表和详情

`/articls` 是拼写错误，应修正。命名上推荐 `/publications`，因为它能涵盖论文、投稿文章和外部文章。

## 3. 非功能要求

* 关注 Core Web Vitals 的高速显示
* 以 WCAG 2.1 AA 为目标的可访问性
* OGP、Twitter Card、结构化数据、sitemap、robots 等 SEO
* 响应式设计
* 通过 Markdown 更新实现易运维

## 4. 技术栈 / 实现方针

* TypeScript 和 Next.js App Router
* GitHub Pages 用静态导出
* Tailwind CSS 和自制 UI component
* 使用 gray-matter、remark/rehype、zod 解析 Markdown
* 必要处使用客户端搜索和筛选

## 5. 多语言

* 首页等静态 UI 支持日语和英语。
* 使用 URL 前缀等方式保存语言。
* 默认语言为日语。

## 6. 内容设计

博客 frontmatter 包含 `title`、`date`、`updated`、`tags`、`summary`、`thumbnail` 和 `draft`。

公开成果 frontmatter 包含 `title`、`type`、`publishedAt`、`venue`、`publisher`、`authors`、`links`、`tags` 和 `abstract`。

## 7. 构建 / 部署

通过 GitHub Actions 在 main 分支 push 时构建，并把 `out/` 部署到 GitHub Pages。

## 8. 验收条件

* 添加 Markdown 文章并 merge 到 `main` 后，会自动构建并部署。
* `/` 可以切换 ja/en，`/blogs` 可以只通过 Markdown 发布文章。
* `/publications` 的筛选和搜索在客户端工作。
* LCP/CLS/INP 的目标值通过 lab test 检查。
* 通过基本可访问性检查。
```
</details>

### 交给 Codex

导入 Codex 后，我参考下面的文章进行设置，然后把需求定义结果交给它推进开发。

https://zenn.dev/dely_jp/articles/codex-cli-matome#%E3%81%AA%E3%81%9C%E4%BB%8A%E3%80%81codex-cli%E3%81%8C%E8%A9%B1%E9%A1%8C%E3%81%AA%E3%81%AE%E3%81%8B%EF%BC%9F

### 对生成物的反馈

我实际运行页面，把觉得不自然或在意的点简短指出，然后反复改善。

## 感想

即使几乎不亲自实现，也能在短时间内做出实用级别的页面。使用 ChatGPT Plus 时我一直把 Reasoning Effort 设为 high，但没有遇到 rate limit，开发过程很顺畅。

我感觉，只要有最低限度的实际开发经验，coding agent 就能发挥足够效果。和 AI 协作开发可以明显降低压力。
