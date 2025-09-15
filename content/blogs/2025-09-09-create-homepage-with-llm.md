---
title: このサイトをLLMと一緒に作成した話
date: 2025-09-09
tags: [intro, nextjs, vibecoding]
summary: このサイトを Vibe Coding で作成した流れを紹介します。
headerImage: https://www.technologyreview.jp/wp-content/uploads/sites/2/2025/04/vibecoding-scaled.jpg
headerAlt: Vibe Coding のイメージ
---

## はじめに
なんとなく自分の紹介ページを作りたいと思っていたものの、時間に余裕がなく着手できていませんでした。
最近、Claude Code や Codex を活用した「Vibe Coding（ヴァイブ・コーディング）」という“ノリと対話で進める”開発手法が話題になっています。ちょうど時間が取れたので、自己紹介サイトを Vibe Coding で実際に作ってみました。

## 作成過程

作成手順は以下のとおりです。
1. 要件定義
2. Codexに依頼
3. 生成されたコードにフィードバックを複数回与える
4. 自己紹介文などは自分で記載し、AIに添削してもらう

### 要件定義
ChatGPT Plus を使っているため、今回はこれをベースに開発を進めました。
GPT に箇条書きでページルーティングや技術スタックを伝え、要件定義を依頼しました。


<details>
<summary>依頼文</summary>

```plaintext
自分のWebページを作りたいと思っています。
要件を決めるための壁打ちを手伝ってください。
今は具体の実装は良いので、Codexに依頼するための要件定義書を作ってください。

## ページルーティング案
- 構成
    - /
        - 自己紹介やルーティングについて記載
        - /links
            - 外部URL
        - /articls
            - 記事, 論文など
        - /blogs
            - mdからレンダリングされた記事

## 実装要件
- 言語はTypeScriptでNext.jsを使ったReactベースのモダンなUI、UX
- GitHub Pagesを使って静的なサイトを自動でビルドして運用コストを下げたい
- ブログなどの更新はいちいちコードを触る面倒なので基本的にmarkdownに記述したら自動的にビルドされるようにしたい
- Markdownから生成されるページ以外のトップページは日本語と英語の両方に対応する形にしてほしいです。
- articlesというルーティング名は執筆した論文や外部サイトの技術ブログについて書くので微妙かもしれません。

```
</details>

<details>
<summary>要件定義結果</summary>

```plaintext
# 概要

個人Webサイトの要件定義。TypeScript + Next.js を用いたモダンなUI/UX。GitHub Pagesで自動ビルド・ホスティングし、Markdown更新をトリガにサイトを再生成する。

---

## 1. 目的 / 成果物

* **目的**: 自己紹介、外部リンク集、記事/論文紹介、ブログ運用を一元化し、更新コストを最小化する静的サイトを構築する。
* **成果物**: 本要件に沿ったリポジトリ、デザイン/コンポーネント群、CI/CD（GitHub Actions）、コンテンツ雛形、ドキュメント一式。

---

## 2. 情報設計 / ルーティング

### 2.1 ルート構成（提案）

* `/`

  * 自己紹介（JP/ENの切替対応）
  * 主要セクションへの導線
* `/links`

  * 外部URLの一覧（SNS、GitHub、登壇資料等）
* `/publications`（名称検討、詳細は §2.2）

  * 執筆した論文、外部サイトの技術ブログ等のメタ情報集約（カード一覧 + 詳細）
* `/blogs`

  * Markdown から生成されるブログ記事一覧 + 詳細

> ※ `/articls` → タイポ修正。`/articles` は汎用的すぎるため、以下の命名案を検討。

### 2.2 「articles」命名の代替案

* **/publications**: 査読論文・寄稿・外部技術ブログなど“公表物”を広く包含（推奨）
* **/writings**: 執筆物全般（やや曖昧）
* **/notes**: メモ・考察（軽めの内容向け）
* **/library**: コレクション的表現（やや抽象）

**採用基準**: 対象が「自著論文 + 外部サイト寄稿 + 解説記事」であれば `/publications` を第一候補に。

### 2.3 グローバルナビ

* Home | Links | Publications | Blog
* フッター: コピーライト、ライセンス、サイトマップ、RSS（ブログ用）

---

## 3. 非機能要求

* 高速表示（Core Web Vitals 目標: LCP < 2.5s, CLS < 0.1, INP < 200ms）
* アクセシビリティ（WCAG 2.1 AA準拠を目標）
* SEO（OGP/Twitter Card/構造化データ、sitemap.xml/robots.txt）
* レスポンシブ（モバイルファースト）
* 運用容易性（Markdown更新のみで完結、CIで自動デプロイ）

---

## 4. 実装スタック / 方針

* **言語/フレームワーク**: TypeScript, Next.js (App Router)

  * `next.config.js` にて `output: 'export'`（静的エクスポート）
* **スタイル**: Tailwind CSS + 自作UIコンポーネント（ライト/ダークテーマ）
* **Markdown処理**: `.md` を採用（remark/rehypeベース、必要ならMDX対応に拡張可能）
* **ハイライト**: Shiki or rehype-prism-plus
* **画像最適化**: 静的生成画像（`next/image` はエクスポート時の挙動に留意）
* **アイコン**: lucide-react 推奨
* **状態管理**: 最小限（基本的に静的、検索/フィルタ程度）

---

## 5. 多言語対応 (i18n)

* **対象範囲**: Markdown生成ページを除くトップページ等の静的UIは **日本語/英語** 切替可能に。
* **手法**: `next-intl` または `next-i18next` を採用。`/locales/ja|en/*.json` で辞書管理。
* **言語切替UI**: ヘッダーにトグル（ja/en）。言語はクッキー or URL 前置（/ja, /en）で保持。
* **既定言語**: 日本語（ja）。

---

## 6. コンテンツ設計

### 6.1 ディレクトリ構成（例）

/content
  /blogs
    yyyy-mm-dd-slug.md
  /publications
    item-*.md
/data
  links.yaml
/public
  /images

### 6.2 フロントマター定義

* **ブログ（/blogs）**

  * `title` (string, required)
  * `date` (ISO string, required)
  * `updated` (ISO string, optional)
  * `tags` (string\[])
  * `summary` (string)
  * `thumbnail` (path)
  * `draft` (boolean)
* **公開物（/publications）**

  * `title` (string, required)
  * `type` (enum: paper | article | talk | slide | media)
  * `publishedAt` (ISO string)
  * `venue` (string) / `publisher` (string)
  * `authors` (string\[])
  * `links` ({ kind: 'pdf'|'doi'|'post'|'slides'|'video'|'code', url: string }\[])
  * `tags` (string\[])
  * `abstract` (string, optional)

### 6.3 Links ページデータ

* `/data/links.yaml` に `{ title, url, desc, icon? }[]` を定義。カテゴリ分け可。

### 6.4 一覧/詳細UI

* 共通カードレイアウト、タグ/検索（クライアントサイド）
* ページネーション（ブログ）
* Draft はビルド除外（CIでPR時のみプレビュー可）

---

## 7. ビルド / デプロイ（GitHub Pages）

* **リポジトリ**: `<user>/<user>.github.io` または任意 + `gh-pages` ブランチ
* **CI/CD**: GitHub Actions ワークフロー

  1. `push` to `main` で実行
  2. `bun install` / `bun build`（`next build && next export`）
  3. `out/` を Pages へデプロイ
* **カスタムドメイン**（任意）：`CNAME` 設定
* **ルーティング注意**: 静的エクスポートで `404.html`/`index.html` を適切に生成

---

## 8. 開発体験（DX）

* パッケージマネージャ: `bun`
* Lint/Format: ESLint + Prettier + stylelint（必要に応じ）
* 型安全: strictモード、`zod` でフロントマター検証
* テスト: 基本スナップショット（Vitest + Testing Library）
* コミット規約: Conventional Commits + Changeset（任意）

---

## 9. ページ詳細要件

### 9.1 `/`（トップ, i18n対象）

* 自己紹介（肩書・略歴・写真）
* 最新ブログ/公開物のハイライト
* 言語切替、テーマ切替

### 9.2 `/links`

* カテゴリ別リンクカード（アイコン/説明付き）

### 9.3 `/publications`（旧`articles`相当）

* 一覧: フィルタ（type, year, tag）と検索
* 詳細: メタデータ + 外部リンク（DOI/PDFなど）

### 9.4 `/blogs`

* 一覧: 発行日降順、タグ/検索、ページネーション
* 詳細: 目次（自動生成）、脚注、コードブロック、OGP生成

---

## 10. セキュリティ/プライバシー

* 外部埋め込みは Consent（同意）後にロード（YouTube等）
* CSP ヘッダ（可能な範囲でmetaベース）

---

## 11. 受け入れ条件（抜粋）

* GitHubに記事.mdを追加 → `main` へマージで自動ビルド/デプロイされ、数分で公開される
* `/` は ja/en 切替可能、`/blogs` 記事はMarkdownのみで公開可能
* `/publications` の絞り込み/検索がクライアントで動作
* LCP/CLS/INP の目標値をLabテストで満たす
* アクセシビリティ基本チェック（キーボード操作、コントラスト、ラベル）をクリア

---

## 12. 実装メモ（Codex向け具体化）

* **Markdown処理案**: `gray-matter` + `remark/rehype` 系でパース、型安全化に`zod`を併用
* **OGP**: `/blogs/[slug]/opengraph-image` で動的画像を静的化（Satori + html-to-image）
* **Search**: クライアント側で `Fuse.js` による簡易全文検索
* **テーマ**: `next-themes` でダークモード

---

## 13. 今後の拡張（任意）

* フィード（RSS/Atom）自動生成
* フィード/サイトマップの自動更新
* コメント（外部：Giscusなど）
* 連絡フォーム（外部フォーム連携）

---

## 14. 未確定事項 / オープンクエスチョン

* `/publications` の正式名称最終決定
* トップのデザインテイスト（ミニマル/大胆/写真多め等）
* アイキャッチの生成方針（手動/自動）
* 英語版トップの文言（和英で差分がある場合の表現）

---

## 付録: サンプル `links.yaml`

```yaml
- title: GitHub
  url: https://github.com/yourname
  desc: ソースコードとプロジェクト
  icon: github
- title: X (Twitter)
  url: https://x.com/yourname
  desc: 日々の発信
  icon: x
```
</details>


### Codexに依頼
Codex を導入し、以下の記事を参考に設定したうえで、要件定義の結果を渡して開発を進めました。

https://zenn.dev/dely_jp/articles/codex-cli-matome#%E3%81%AA%E3%81%9C%E4%BB%8A%E3%80%81codex-cli%E3%81%8C%E8%A9%B1%E9%A1%8C%E3%81%AA%E3%81%AE%E3%81%8B%EF%BC%9F

### 生成物へのフィードバック
実際に動かして「気になった点」を簡潔に指摘し、改善を繰り返しました。


## 感想
ほとんど自分で実装せずとも、実用的なレベルのページを短時間で構築できました。
ChatGPT Plus では常に Reasoning Effort = high にしていましたが、レートリミットにかからず快適に開発できました。
Coding Agent を使った開発は、最低限のハンズオン経験があれば十分に効果を発揮し、AI と協調してストレス少なく進められると実感しました。
