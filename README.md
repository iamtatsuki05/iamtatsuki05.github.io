# Next.js Static Site

[English](README.md) | [日本語](README_JA.md)

## How to operate Bun
### setup
1. Clone the repository with `git clone`

### Bun configuration
1. Install dependencies: `bun install`

### run script
```shell
bun dev                       # start dev server at http://localhost:3000
INCLUDE_DRAFTS=false NEXT_PUBLIC_BASE_PATH='' bun run build
bun run start                 # serve static out/ on :3000
```

## How to operate Docker
### setup
1. Clone the repository with `git clone`

### docker configuration
1. Dev (hot reload): `docker compose up -d --build app`
2. Prod preview: `docker compose up -d --build preview`

### Connect to and disconnect from docker
1. Connect: `docker compose exec app sh`
2. Disconnect: `exit`

### Starting and Stopping Containers
1. Starting: `docker compose start`
2. Stopping: `docker compose stop`

## Directory structure
```text
./
├── .dockerignore
├── .github
├── .gitignore
├── compose.yml
├── Dockerfile
├── README.md
├── README_JA.md
├── app
├── components
├── cypre
├── content
│   ├── blogs
│   └── publications
├── data
│   └── links.yaml
├── lib
├── locales
├── pages
├── public
│   └── images
├── scripts
│   └── generate-sitemap.ts
├── tests
├── types
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

## Notes
- i18n: ja/en routes for Home/Links/Publications/Blog index.
- Feeds/SEO: `/sitemap.xml`, `/robots.txt`, `/rss.xml` generated at build.
- GitHub Pages: CI config in `.github/workflows/deploy.yml` sets `SITE_URL` and base path automatically.
