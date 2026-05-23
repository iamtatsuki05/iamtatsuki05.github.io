---
title: Next.js から Astro への移行を AI にほぼ丸投げした
date: 2026-05-24
tags: [astro, nextjs, ai, codex, migration]
summary: このサイトを Next.js から Astro へ移行する作業を、実装から検証まで Codex にほぼ任せてみた記録です。
headerImage: https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=1600&q=80
headerAlt: コードが表示された画面
---

## はじめに

このサイトは、もともと Next.js の静的エクスポートで動かしていました。
ブログを書けて、リンク集があって、公開物一覧があって、日英切り替えやダークモードもある、よくある個人サイトです。

ただ、実態としてはほぼ静的サイトです。
Next.js で困っていたわけではないのですが、App Router、静的 export、画像最適化、Cloudflare Pages まわりの設定が少し大げさに感じるようになっていました。

そこで Astro に移行しました。
しかも今回は、実装だけでなく、調査、移行前後の計測、テスト、レビュー対応までほぼ Codex に任せました。

「AI に全部やらせた」と言うと雑ですが、実際にはかなり細かい完了条件を渡して、その範囲で走らせた感じです。
この記事はその記録です。

## 依頼の出し方

最初に Codex に渡したのは、単なる「Astro に移行して」ではありません。

既存の見た目、URL、SEO、アクセシビリティ、Cloudflare Pages のデプロイ経路を維持すること。
移行前後で build time、出力サイズ、Lighthouse の値を比較すること。
lint、型チェック、Vitest、E2E、preview の smoke check まで通すこと。
最後に別の read-only reviewer に見てもらうこと。

このあたりを全部書きました。

AI に任せる時、実装方針だけ渡すと危ないです。
特に framework migration は、画面が表示されていても sitemap や OGP が壊れていることがあります。
なので今回は「何をしたら完了か」を先に縛りました。

## まず移行前の状態を測る

作業の最初に、Next.js 版の baseline を取りました。

`bun run build`、出力サイズ、主要 HTML のサイズ、lint、Vitest、Playwright E2E、Lighthouse mobile / desktop です。

これは地味ですが、やっておいて良かったです。
移行作業は「動かないものを直す」ではなく、「動いているものを壊さずに置き換える」作業なので、比較対象がないと何も判断できません。

## 何が変わったか

実装としては、Next.js App Router の `src/app/**` をなくして、Astro の `src/pages/**` に置き換えました。
共通 layout は `BaseLayout.astro` に移し、既存の React component は必要なところだけ Astro island として残しました。

全部を書き直したわけではありません。
むしろ、UI component はできるだけそのまま使っています。
変えたのは framework 依存の境界です。

たとえば `next/link`、`next/image`、`next/navigation` の代わりに、小さな local wrapper を置きました。
`next-themes` や `nuqs` も外して、このサイトで必要な分だけを local 実装にしています。

RSS、sitemap、robots、metadata、OGP、JSON-LD も Astro 側で生成するようにしました。
Cloudflare Pages の workflow も Astro build 前提に変更しています。

## すんなりはいかなかったところ

一番引っかかったのは hydration でした。

Next.js では自然に client component として動いていたものも、Astro では `client:load` などを明示しないと動きません。
最初の E2E では普通に落ちました。

具体的には、英語ページで language switch の active state がずれたり、theme toggle が placeholder のままになったり、Publications の filter が動かなかったりしました。
英語ページから blog detail に入った時に、日付だけ日本語表記になる問題もありました。

このへんは、Codex が E2E の failure log を読みながら直していきました。
Header に現在の pathname を Astro から渡したり、theme provider を Header island の中に置いたり、Publications page 自体を hydrate したりしています。

自分でやっていたら、たぶん同じように Playwright のログと DOM を見て直していたと思います。
その作業をかなり速く回してくれたのは良かったです。

## レビューで拾えたもの

一通り動くようになったあと、別の read-only reviewer に差分を見てもらいました。
ここで出た指摘がけっこう大事でした。

sitemap に、実際には存在しない publication detail URL が残っていました。
また、blog article の `article:published_time` などの OGP meta が落ちていました。
Cloudflare の headers も `/_next/static/*` のままで、Astro の `/_astro/*` に効いていませんでした。

これは、普通の E2E では落ちにくいところです。
画面は表示されるし、リンクも押せる。
でも SEO や deploy の細部は壊れている、というタイプの問題です。

指摘後に、sitemap、article meta、cache header、base path 対応を直しました。
最後は生成された HTML を直接見て、meta tag が本当に出ていることまで確認しました。

## 数字

最終的には、以下が通りました。

- TypeScript
- lint
- Vitest: 42 files / 152 tests
- Chromium E2E: 50 tests
- Storybook build
- Astro build
- Playwright での visual smoke

| 項目 | Next.js | Astro |
| --- | ---: | ---: |
| build time | 26.74s | 3.41s |
| static output | 11M | 5.5M |
| framework cache/output | `.next` 184M | `.astro` 12K |

build time はかなり短くなりました。
出力サイズも半分くらいになっています。

Lighthouse は desktop だと全対象 route で改善しました。
mobile もほとんど改善しています。
blog detail だけ performance score が `72 -> 71` と 1 点下がりましたが、LCP は `11040ms -> 8836ms`、TBT は `65ms -> 28ms` に改善していました。

この規模の個人サイトとしては十分です。

## やってみて思ったこと

AI に丸投げするといっても、完全に放置できるわけではありません。

今回、人間側でやった一番大きな仕事は、実装ではなく「何を壊してはいけないか」を決めることでした。
URL、SEO、deploy、performance、テスト。
このあたりを先に書いておくと、AI はかなり粘ってくれます。

逆に、そこを書かないと、見た目だけ動いている移行になりそうです。

あと、baseline は面倒でも取った方が良いです。
移行後に「速くなった気がする」ではなく、数字で見られるようになります。
今回は build time と出力サイズがかなり分かりやすく改善したので、やった意味が見えやすかったです。

それから、reviewer を別に立てるのは効きました。
自分で書いたコードを自分で見ると見落とすように、AI も自分の作業を見落とします。
別視点で sitemap や OGP を拾えたのは良かったです。

## おわりに

今回の移行は、かなり AI に任せました。
ただ、AI が勝手に良い感じにやってくれたというより、細かい条件を渡して、ログを読ませて、失敗したら直させて、最後に別視点で見直した、という感じです。

個人サイトくらいの規模で、テストや build がちゃんと回るなら、AI 主導の framework migration はかなり現実的だと思います。

次にやるなら、SEO metadata の snapshot test と sitemap URL の検証を先に入れてから移行を始めたいです。
今回 reviewer が拾ってくれたところなので、そこは最初から機械的に守れるようにしておくと安心そうです。
