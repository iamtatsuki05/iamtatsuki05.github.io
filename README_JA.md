# iamtatsuki05.com

[English](README.md) | [日本語](README_JA.md)

Astro、React islands、Tailwind CSS で作った個人サイトです。スクリプトは Bun で実行します。`out/` に出力した静的ファイルを Cloudflare Pages に配信しています。

## セットアップ

```shell
bun install
```

## コマンド

```shell
bun dev                  # ブログ用データを生成してから http://localhost:3000 で Astro の開発サーバーを起動
bun run build            # ブログ用データと画像を生成し、out/ にビルドしてからエージェント向け Markdown を出力
bun run start            # out/ を http://localhost:3000 で配信
bun run lint             # Biome
bun run vitest:run       # 単体テスト (tests/components, tests/lib)
bun run e2e:run          # Playwright の E2E テストを Chromium で実行
bun run e2e:open         # Playwright の UI モード
bun run test             # vitest:run と e2e:run
bun run storybook        # http://localhost:6006 で Storybook
bun run storybook:build  # storybook-static/ に静的ビルド
bun run translate:blogs:prompt -- --help  # ブログ翻訳をエージェントに頼むプロンプトを出力
```

Storybook のテレメトリを止めるときは `STORYBOOK_DISABLE_TELEMETRY=1` を設定します。

## 環境変数

すべて任意です。詳細は `src/lib/config/env.ts` を参照してください。

```shell
NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX  # PUBLIC_GOOGLE_ANALYTICS_ID でも可
SITE_URL=https://iamtatsuki05.com             # 既定値は開発時 localhost:3000、それ以外は iamtatsuki05.com
NEXT_PUBLIC_BASE_PATH=                        # PUBLIC_BASE_PATH でも可
INCLUDE_DRAFTS=true                           # draft: true のブログ記事も含める
```

## Docker

```shell
docker compose up -d --build app      # http://localhost:3000 でホットリロード付きの開発サーバー
docker compose up -d --build preview  # 本番ビルドを http://localhost:3001 で配信
docker compose exec app sh            # コンテナに入る (exit で抜ける)
docker compose stop                   # 停止 (docker compose start で再開)
```

## コンテンツ

- ブログ記事: `src/content/blogs/*.md` (日本語の原文)。翻訳は `src/content/blog-translations/{en,zh,fr}/` に置きます。
- 発表・論文: `src/content/publications/*.md`。frontmatter のスキーマは `src/lib/content/types.ts` の `PublicationFrontmatter` です。`paper` には `venueType`、`region`、`refereed` が必須です。
- CV: `src/data/cv.yaml` (学歴、奨学金、受賞)。使えるフィールドはファイル冒頭のコメントにあります。
- リンク集: `src/data/links.yaml`

## ディレクトリ構成

```text
.
├── .github/workflows   # CI、バンドルサイズ、Lighthouse、Cloudflare Pages へのデプロイ
├── .storybook
├── e2e                 # Playwright のテスト
├── functions           # Cloudflare Pages Functions (Markdown のコンテンツネゴシエーション)
├── public
├── scripts             # ビルド時の生成スクリプトと静的サーバー
├── src
│   ├── components
│   ├── content         # blogs, blog-translations, publications
│   ├── data            # cv.yaml, links.yaml, 生成された画像メタデータ
│   ├── layouts
│   ├── lib
│   ├── locales         # ja, en, zh, fr
│   ├── pages
│   ├── stories
│   └── styles
├── tests               # Vitest のテスト
├── astro.config.mjs
├── biome.json
├── compose.yml
├── Dockerfile
├── package.json
├── playwright.config.ts
└── vitest.config.mts
```

## ルーティングとフィード

- ページは Home、Blog、Publications、CV、Hobbies、Links です。日本語はルートで配信し、各ページに ja、en、zh、fr のロケール付きルートもあります。
- `/sitemap.xml`、`/robots.txt`、`/rss.xml` はビルド時に生成します。

## デプロイ

- 作業ブランチは `develop` にマージし、その後「Sync: Develop to Main」PR で `develop` を `main` にマージします。
- `.github/workflows/deploy-cloudflare.yml` は `main` と `develop` への push ごとに動きます。PR 用のテストワークフローを実行し、サイトと Storybook (`/storybook` で配信) をビルドして、`out/` を push されたブランチ名で Cloudflare Pages に公開します。
- `main` のときだけ、https://iamtatsuki05.com が Markdown の `Link` ヘッダーを返すことを確かめてから、isitagentready.com のエージェント対応レベルで合否を判定します。プレビュー環境は Cloudflare Access の内側にあるため、`develop` ではこの確認を省きます。
- `.github/workflows/deploy-github-redirect.yml` は `main` への push のたびに、https://iamtatsuki05.github.io へ転送専用のサイトを出します。`scripts/build-github-redirect.ts` が sitemap の URL ごとにページを作り、https://iamtatsuki05.com の同じパスへ転送します。
