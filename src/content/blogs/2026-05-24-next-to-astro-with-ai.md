---
title: Next.js から Astro への移行を AI にほぼ丸投げした
date: 2026-05-24
tags: [astro, nextjs, ai, codex, migration]
summary: このサイトを Next.js から Astro へ移行する作業を、実装から検証まで Codex にほぼ任せてみた記録です。
headerImage: https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=1600&q=80
headerAlt: コードが表示された画面
aiAssisted: true
---

## はじめに

このサイトを Next.js から Astro に移しました。

Next.js が嫌になったわけではありません。困っていたというほどでもありません。ただ、このサイトの実態を考えると、少し大げさになっていました。ブログ、リンク集、公開物一覧、言語切り替え、ダークモード。やっていることはほぼ静的サイトです。

それなのに、App Router、静的 export、画像最適化、Cloudflare Pages の設定を抱えていました。もちろん動いてはいましたが、サイトの規模に対して持ち物が多い感じがありました。

そこで Astro に移しました。

今回は、自分で少しずつ書き換えるのではなく、Codex にかなり任せました。実装だけでなく、移行前後の計測、テスト、失敗した箇所の修正、reviewer の指摘対応まで、ほぼ一連の作業として渡しています。

AI に丸投げした、というと少し雑です。実際には、丸投げというより「壊してはいけないものを細かく渡して、最後まで走らせた」に近いです。

## 何を変えたかったのか

移行の目的は、流行りの framework に乗り換えることではありません。

このサイトは、ほとんどのページがビルド時に決まります。ログインもなければ、サーバ側で動的に返す必要もほぼありません。React component はありますが、全部が常に client-side で動く必要もありません。

なら、静的サイトを静的サイトとして扱いやすい形にした方がよいです。

Astro にすると、ページは `src/pages/**` に置き、共通 layout は Astro 側で持てます。必要な React component だけ island として残せます。自分のサイトにはこの分け方が合っていました。

ただし、framework migration は見た目だけ合っていればよいわけではありません。URL、SEO、OGP、sitemap、RSS、Cloudflare Pages、アクセシビリティ、言語切り替え、theme toggle など、見落としやすいものが多いです。

なので、最初に Codex へ「何を壊してはいけないか」をかなり細かく渡しました。

## Codex への頼み方

Codex には、単に「Astro に移行して」とは頼みませんでした。

既存の見た目、URL、SEO、アクセシビリティ、Cloudflare Pages のデプロイ経路を維持すること。移行前後で build time、出力サイズ、Lighthouse の値を比較すること。lint、型チェック、Vitest、E2E、preview の smoke check まで通すこと。最後に別の read-only reviewer に見てもらうこと。

このあたりをまとめて渡しました。

AI に任せるとき、実装方針だけ渡すと危ないです。特に移行作業では、画面が表示されているだけでは安心できません。sitemap が変だったり、OGP meta が落ちていたり、Cloudflare の cache header が古い path のままだったりします。

だから今回は、実装の細かい方法よりも、完了条件を先に縛りました。

## まず baseline を取る

移行前に、Next.js 版の状態を測りました。

`bun run build`、出力サイズ、主要 HTML のサイズ、lint、Vitest、Playwright E2E、Lighthouse mobile / desktop です。

これは地味ですが、かなり大事でした。移行は、壊れているものを直す作業ではありません。動いているものを置き換える作業です。比較対象がないと、良くなったのか、壊したのか、たまたま動いているだけなのか判断できません。

今回は結果として build time と出力サイズがかなり分かりやすく改善したので、baseline を取っておいて良かったです。

## 実際に変わったところ

Next.js App Router の `src/app/**` はなくなり、Astro の `src/pages/**` に置き換わりました。
共通 layout は `BaseLayout.astro` に移し、既存の React component は必要なところだけ Astro island として残しています。

全部を書き直したわけではありません。むしろ、UI component はできるだけ残しています。変えたかったのは見た目ではなく、framework との境界です。

`next/link`、`next/image`、`next/navigation` の代わりに、小さな local wrapper を置きました。`next-themes` や `nuqs` も外して、このサイトで必要な分だけ local 実装にしています。

RSS、sitemap、robots、metadata、OGP、JSON-LD も Astro 側で生成するようにしました。Cloudflare Pages の workflow も Astro build 前提に変えています。

このあたりは、派手な変更ではありません。でも、依存していた framework の前提を一つずつ外す作業としては、こういう地味な置き換えが中心でした。

## 詰まったところ

一番引っかかったのは hydration でした。

Next.js では自然に client component として動いていたものも、Astro では `client:load` などを明示しないと動きません。最初の E2E では普通に落ちました。

英語ページで language switch の active state がずれる。theme toggle が placeholder のままになる。Publications の filter が動かない。英語ページから blog detail に入ったとき、日付だけ日本語表記になる。

こういう、画面をざっと見るだけだと見落としそうなところで落ちました。

Codex は E2E の failure log を読みながら直していました。Header に現在の pathname を Astro から渡す。theme provider を Header island の中に置く。Publications page 自体を hydrate する。やっていることは、自分でやる場合と同じです。

違ったのは、そのループが速かったことです。ログを読む、仮説を立てる、直す、もう一度テストする、という作業をかなり粘って回してくれました。

## reviewer が拾ったもの

一通り動いたあと、別の read-only reviewer に差分を見てもらいました。
ここで拾えたものがかなり大事でした。

sitemap に、実際には存在しない publication detail URL が残っていました。blog article の `article:published_time` などの OGP meta も落ちていました。Cloudflare の headers も `/_next/static/*` のままで、Astro の `/_astro/*` に効いていませんでした。

どれも、普通にページを触っているだけでは気づきにくいです。画面は表示されます。リンクも押せます。でも SEO や deploy の細部は壊れています。

指摘後に、sitemap、article meta、cache header、base path 対応を直しました。最後は生成された HTML を直接見て、meta tag が本当に出ているところまで確認しています。

この review は入れて良かったです。AI が書いたものを AI が見直しても、同じ前提のまま見落とすことがあります。別の視点を挟むだけで、拾える種類が変わります。

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

build time はかなり短くなりました。出力サイズも半分くらいになっています。

Lighthouse は desktop だと全対象 route で改善しました。mobile もほとんど改善しています。blog detail だけ performance score が `72 -> 71` と 1 点下がりましたが、LCP は `11040ms -> 8836ms`、TBT は `65ms -> 28ms` に改善していました。

この規模の個人サイトとしては、十分な結果です。

## おわりに

今回の移行で思ったのは、AI に任せるほど、完了条件をちゃんと書いた方がよいということです。

「Astro に移行して」だけだと、おそらく見た目が表示されるところまでは行けます。しかし、URL、SEO、deploy、performance、E2E、review まで含めると、最初に条件を書いておく意味がかなり大きいです。

人間側でやった一番大きな仕事は、コードを書くことではありませんでした。何を壊してはいけないかを決めることでした。

個人サイトくらいの規模で、build と test がちゃんと回るなら、AI 主導の framework migration はかなり現実的です。ただし、何をもって終わりにするかを人間が持っていないと、たぶん見た目だけ動いている移行になります。

次に同じような移行をするなら、SEO metadata と sitemap URL の snapshot test を先に入れてから始めます。今回 reviewer が拾ってくれたところなので、最初から機械的に守れるようにしておきたいです。
