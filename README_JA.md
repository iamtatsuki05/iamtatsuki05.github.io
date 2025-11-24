# Next.js 静的サイト

[English](README.md) | [日本語](README_JA.md)

## Bun の操作方法
### setup
1. `git clone` で取得

### Bun のセットアップ
1. 依存をインストール: `bun install`

### スクリプト実行
```shell
bun dev                       # http://localhost:3000 で開発
INCLUDE_DRAFTS=false NEXT_PUBLIC_BASE_PATH='' bun run build
bun run start                 # :3000 で out/ を配信
bun run storybook             # http://localhost:6006 で Storybook
bun run storybook:build       # storybook-static/ に静的ビルド
# テレメトリ: 参加したくない場合は STORYBOOK_DISABLE_TELEMETRY=1 を設定
```

## Docker の操作方法
### setup
1. `git clone` で取得

### docker 構成
1. 開発（ホットリロード）: `docker compose up -d --build app`
2. 本番プレビュー: `docker compose up -d --build preview`

### コンテナへの接続/切断
1. 接続: `docker compose exec app sh`
2. 切断: `exit`

### コンテナの開始・停止
1. 開始: `docker compose start`
2. 停止: `docker compose stop`

## ディレクトリ構成
```text
./ 
├── Dockerfile
├── README.md
├── README_JA.md
├── bunfig.toml
├── compose.yml
├── cypress
├── node_modules
├── public
│   └── images
├── scripts
│   ├── ensure-favicon.ts
│   ├── generate-rss.ts
│   ├── inspect-content.ts
│   ├── optimize-images.ts
│   └── utils
├── src
│   ├── app
│   ├── components
│   ├── content
│   │   ├── blogs
│   │   └── publications
│   ├── data
│   │   └── links.yaml
│   ├── lib
│   ├── locales
│   └── types
├── tests
├── package.json
├── eslint.config.mjs
├── next.config.mjs
├── next-sitemap.config.mts
├── postcss.config.js
├── tsconfig.json
└── vitest.config.mts
```

## 補足
- i18n: Home/Links/Publications/Blog index は ja/en の言語ルート対応
- SEO/フィード: ビルド時に `/sitemap.xml` `/robots.txt` `/rss.xml` を生成
- GitHub Pages: `.github/workflows/deploy.yml` で `SITE_URL` と basePath を自動設定
