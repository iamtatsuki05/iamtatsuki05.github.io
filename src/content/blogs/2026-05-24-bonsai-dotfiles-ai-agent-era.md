---
title: AI Agent 時代の盆栽 dotfiles
date: 2026-05-24
tags: [dotfiles, nix, mise, ai, codex]
summary: Nix、mise、chezmoi、AI agent 設定を dotfiles に寄せながら、変化の速い開発環境を盆栽のように手入れしていく話です。
headerImage: https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=1600&q=80
headerAlt: 鉢植えの植物
aiAssisted: true
---

## はじめに

dotfiles が好きです。

好きというか、放っておけないものになっています。昔は shell alias と Neovim の設定が入っていれば十分でした。今はそうではありません。PC を増やす、Linux 環境を触る、AI Agent を入れ替える、CLI ツールの更新を追う。そのたびに、環境の差分がじわじわ効いてきます。

その感覚は、最近の `dotfiles` の commit にもそのまま出ています。2026-04-25 に chezmoi への移行と Nix 周辺の整理を入れてから、Nix、mise、AI Agent 設定、skill、eval、hook まわりを続けて触っています。

これはもう、設定ファイル置き場というより生活基盤です。

本稿では、最近の dotfiles の手入れを「AI Agent 時代の盆栽 dotfiles」という見方で整理します。大きな思想というより、実際に複数台の PC と複数の agent を触っているうちに、こうしないとすぐ荒れるなと思った話です。

## 問題設定

まず、今の開発環境で何が面倒なのかを整理します。

自分の場合、環境は一つではありません。普段使いの macOS があり、Linux の CLI 環境があり、研究や授業の作業ディレクトリがあり、AI Agent も Codex だけではありません。`codex`、`claude-code`、`copilot`、`cursor-agent`、`devin`、`hermes`、`opencode` など、道具が増えるほど「同じつもりで作業しているのに前提が違う」ことが起きます。

ナイーブにやるなら、各 PC と各 tool の設定をその場で直せばよいです。動きます。しかし、すぐに破綻します。どの PC に何を入れたか分からなくなる。どの agent がどの prompt を読んでいるか分からなくなる。新しい tool を入れたつもりが、別の環境では古いままになる。

人間だけが使う環境なら、多少は記憶で補えます。AI Agent に作業を任せるようになると、そうもいきません。agent はその場で読める設定とファイルにかなり強く引っ張られます。つまり、環境のブレはそのまま作業のブレになります。

そこで、最近の dotfiles は三つの方向に寄っています。

1. OS や machine の差分は Nix でなるべく吸収する。
2. AI Agent の prompt、skill、hook は `.agent` に集める。
3. 変化の速い CLI tool は mise で管理する。

どれも単体では普通の話です。しかし、この三つが揃うと dotfiles の意味が変わります。単なる便利設定ではなく、作業環境の再現性を支える根になります。

## Nix で揃える部分を決める

まず Nix です。

今の dotfiles では、macOS は `full`、Linux は `cli` という profile に分けています。`full` には nix-darwin、Home Manager、GUI アプリ、macOS defaults、設定ファイル、mise、Neovim まで入れています。一方の `cli` は、Ubuntu などでも使いやすい CLI 中心の profile です。

この分け方がかなり重要です。

macOS と Linux を完全に同じにする必要はありません。むしろ無理に同じにしようとすると、GUI アプリや OS 固有設定のところで苦しくなります。しかし、CLI の手触りは揃えたい。`zsh`、`git`、`rg`、`mise`、`uv`、Neovim あたりが揃っているだけで、別 machine に入ったときの違和感はかなり減ります。

そのため `flake.nix` では `aarch64-darwin`、`x86_64-darwin`、`aarch64-linux`、`x86_64-linux` を扱っています。macOS では nix-darwin と Home Manager、Linux では Home Manager を使います。

ただ、全部を Nix に入れたいわけではありません。

zsh や Neovim のように宣言的に固定したいものは Nix 側に寄せる。一方で、ターミナル設定、bash 起動ファイル、`mise` config、ローカル設定のひな形のように、ホームディレクトリへ自然に置きたいものは chezmoi に任せる。この分担があるので、変更するときに「これはどこに書くべきか」で迷いにくいです。

自分の場合、Nix は「毎回同じように入ってほしいもの」を置く場所です。逆に、少し手触りを残したい設定まで全部そこへ寄せると、変更するたびに重く感じます。

## `.agent` は AI に渡す前提である

次に AI Agent まわりです。

AI CLI agent 関連のファイルは `dotfiles/.agent/` に集めています。共通 prompt の `AGENTS.md`、agent 別設定の `apps/`、共通 hook の `hooks/`、Codex 互換 agent と Waza で使う `skills/`、skill ごとの `evals/` などです。

AI Agent を使うとき、モデル性能やプロンプトの書き方に目が行きがちです。もちろんそれも重要です。しかし、実際に何度も使っていると、もっと地味な問題が効いてきます。

ある agent には最近の注意書きが入っているが、別の agent は古いまま。ある PC には必要な skill があるが、別の PC では使えない。hook の挙動が tool ごとに違い、同じつもりの依頼でも作業ログや検証の残り方が変わる。

これは人間が見ると些細な差です。しかし agent にとっては、読める前提が違うということです。前提が違えば、出てくる作業も違います。

そこで、prompt や skill を tool ごとの設定ディレクトリに直接置くのをやめて、dotfiles 側を正にしました。`dotfiles/.agent/sync.sh` から `scripts/setup_agent_files.sh` を呼び、各 tool home に symlink を張っています。

これはかなり地味ですが、効きます。AI Agent を単発の便利ツールではなく、開発環境の一部として扱うなら、agent に渡す前提も version control されているべきです。

## mise で速い変化を追う

Nix と `.agent` だけでは足りません。

AI Agent 周辺の CLI は変化が速すぎます。`codex`、`claude-code`、`opencode`、`cursor-agent`、`devin` などは、少し放っておくとすぐ状況が変わります。OS の package manager に任せるには速すぎるし、毎回手で入れるには忘れやすい。

ここで mise が効きます。

`config/mise/config.toml` には、`bun`、`node`、`go`、`python`、`uv`、`rust`、`chezmoi` などの開発ツールに加えて、AI CLI も並んでいます。`codex`、`claude-code`、`opencode`、`npm:@github/copilot`、`npm:openclaw`、Hermes Agent の `pipx` install、`http:devin`、`http:cursor-agent` などです。

mise に寄せると、どの tool をどの release line で使うかをファイルに残せます。さらに `home/.chezmoitemplates/mise-config.toml` と揃えることで、ホームに展開される実設定とも対応します。

更新も分けています。`mise run nix-update` は Nix 管理 tool の更新、`mise run mise-update` は mise 管理 tool の更新、`mise run package-update` は Nix / mise をまとめた更新です。`node@22` のように major line 自体を上げるときは、先に `config/mise/config.toml` を明示的に変えることにしています。

この距離感がちょうどよいです。

AI Agent 周辺の CLI は、更新を止めるとすぐ古くなります。一方で、何も考えずに更新すると、昨日まで動いていた前提が変わります。mise に書いておくと、その変化を少なくとも diff として見られます。

## 盆栽としての dotfiles

結局、dotfiles は盆栽に近いと思っています。

盆栽は、一度形を作ったら終わりではありません。伸びたところを切ったり、鉢を替えたり、少しずつ手を入れ続けます。

dotfiles も同じです。

新しい tool を足すだけではすぐに混み合います。使わなくなった GUI アプリは package list から外す。Homebrew から Nix に移せるものは移す。agent prompt を変えたら sync と test も見る。外部 skill を入れるなら、`upstreams.json` に由来と固定 commit を残し、review してから更新する。

最近も、そういう手入れをいくつも入れました。Nix の user 解決を動的にする、nix-darwin の primary user を直す、managed apps から Discord、Cinebench、Bitwarden を外す、agent logging や local wiki の運用を明文化する、といった変更です。

どれも一つずつ見ると小さいです。派手な新機能ではありません。しかし、こういう小さい整理が積み重なると、環境が今の生活に合ってきます。

dotfiles も、完成させるというより手入れし続けるものだと思っています。

## おわりに

AI Agent に任せる作業が増えるほど、人間が直接書くコードは減るかもしれません。しかし、環境をどう作るかの重要性は下がりません。むしろ上がります。

Agent が読む prompt はどこから来るのか。skill はどの revision なのか。hook は別の PC でも同じように動くのか。CLI tool はどの単位で更新され、必要なら戻せるのか。Nix、mise、chezmoi の責務はどこで分けるのか。

ここが曖昧だと、AI に任せた作業の再現性も曖昧になります。逆にここが整っていると、AI Agent はかなり安定した道具になります。

自分にとって dotfiles は、もう shell alias 集ではありません。複数台の PC、Nix package set、mise tool、chezmoi source state、AI Agent prompt、skill、hook、eval をまとめて育てる場所です。

たまに見直して、今の生活に合わなくなった設定を外し、必要になったものを足す。

そのくらいの普通の手入れを、これからも続けていきたいです。
