---
title: AI Agent 时代的盆栽 dotfiles
summary: 这篇文章讲述我如何把 Nix、mise、chezmoi 和 AI agent 配置收进 dotfiles，并像照料盆栽一样维护变化很快的开发环境。
headerAlt: 盆栽植物
---

## 前言

我喜欢 dotfiles。

与其说喜欢，不如说已经不能放着不管了。以前只要有 shell alias 和 Neovim 设置就足够了。现在不是这样。增加一台 PC、使用 Linux 环境、切换 AI Agent、追 CLI 工具更新，每一次都会让环境差异慢慢显现出来。

这种感觉也直接出现在最近的 `dotfiles` commit 里。2026-04-25 加入向 chezmoi 的迁移和 Nix 周边整理之后，我又持续修改了 Nix、mise、AI Agent 设置、skill、eval、hook 周边。

这已经不只是配置文件的存放处了。更接近日常工作的基础设施。

这篇文章把最近对 dotfiles 的维护，比作打理盆栽来整理。它来自实际接触多台 PC 和多个 agent 后的体会：不持续维护，环境很快就会变乱。

## 问题设定

首先，当前开发环境到底哪里麻烦？

对我来说，环境不止一个。有日常使用的 macOS，有 Linux CLI 环境，有研究和课程的工作目录，AI Agent 也不只是 Codex。`codex`、`claude-code`、`copilot`、`cursor-agent`、`devin`、`hermes`、`opencode`，工具越多，就越容易在不同的前提下做着自以为相同的工作。

最朴素的做法，是在每台 PC 和每个 tool 上当场修设置。这样可以动起来。但很快会坏掉。哪台 PC 装了什么会变得不清楚。哪个 agent 读的是哪个 prompt 会变得不清楚。以为更新了工具，但另一个环境仍然是旧版本。

如果只有人类使用环境，还可以靠记忆补一部分。开始让 AI Agent 做工作后，这就不够了。agent 会很强地受它当场能读到的设置和文件影响。环境的偏差会直接变成工作的偏差。

所以，最近的 dotfiles 向这些方向靠拢：

- OS 和 machine 的差异尽量用 Nix 吸收
- AI Agent 的 prompt、skill、hook 集中到 `.agent`
- 变化快的 CLI tool 用 mise 管理

单独看都很普通。不过合在一起，dotfiles 就成了支撑工作可复现性的根。

## 用 Nix 决定要对齐的部分

首先是 Nix。

现在我的 dotfiles 里，macOS 用 `full`，Linux 用 `cli` 这两个 profile 来分。`full` 包括 nix-darwin、Home Manager、GUI 应用、macOS defaults、配置文件、mise 和 Neovim。`cli` 则以 CLI 为中心，更容易在 Ubuntu 等环境中使用。

这种划分是关键。

macOS 和 Linux 不需要完全一样。硬要完全一样，GUI 应用和 OS 固有设置会很痛苦。但是，CLI 的手感应该尽量一致。`zsh`、`git`、`rg`、`mise`、`uv`、Neovim 这些东西一致时，进入另一台 machine 的违和感会小很多。

因此 `flake.nix` 处理 `aarch64-darwin`、`x86_64-darwin`、`aarch64-linux` 和 `x86_64-linux`。macOS 上我使用 nix-darwin 和 Home Manager，Linux 上使用 Home Manager。

不过，我并不想把所有东西都放进 Nix。

像 zsh 和 Neovim 这样想声明式固定的东西放到 Nix 侧。终端设置、bash 启动文件、`mise` config、本地配置模板等更自然地放在 home 里的东西，则交给 chezmoi。有这个分工后，修改时就更容易判断应该写在哪里。

对我来说，Nix 是放那些每次都希望以同样方式安装的东西的地方。反过来，如果把仍然想轻松调整的设置也全部放进去，每次修改都会显得太重。

## `.agent` 是交给 AI 的前提

接着是 AI Agent。

我把 AI CLI agent 相关文件集中放在 `dotfiles/.agent/`。这里有共通 prompt `AGENTS.md`、agent 别设置 `apps/`、共通 hook `hooks/`、供 Codex 兼容 agent 和 Waza 使用的 `skills/`，以及每个 skill 的 `evals/`。

使用 AI Agent 时，很容易只看模型能力和 prompt 写法。当然这些也重要。但实际反复使用后，更无聊的问题会变得重要。

某个 agent 有最新的注意事项，另一个还在用旧 prompt。某台 PC 有必要的 skill，另一台没有。hook 的行为因 tool 而异，作业日志和验证记录的留下方式也不同。

在人类看来，这些可能只是小差异。但对 agent 来说，这是可读取前提的差异。前提不同，出来的工作也会不同。

所以，我不再把 prompt 和 skill 直接放进每个 tool 的配置目录，而是让 dotfiles 成为源头。`dotfiles/.agent/sync.sh` 调用 `scripts/setup_agent_files.sh`，向各个 tool home 创建 symlink。

很朴素，但有效。如果把 AI Agent 当作开发环境的一部分，那么交给 agent 的前提也应该被 version control。

## 用 mise 追变化快的部分

只有 Nix 和 `.agent` 还不够。

AI Agent 周边的 CLI 变化太快了。`codex`、`claude-code`、`opencode`、`cursor-agent`、`devin` 等都在快速变化。完全交给 OS package manager 太慢，而手动安装又太容易忘。

这时 mise 很有用。

`config/mise/config.toml` 里列出了 `bun`、`node`、`go`、`python`、`uv`、`rust`、`chezmoi` 等开发工具，也列出了 `codex`、`claude-code`、`opencode`、`npm:@github/copilot`、`npm:openclaw`、通过 `pipx` 安装的 Hermes Agent、`http:devin`、`http:cursor-agent` 等 AI CLI。

使用 mise 后，哪些 tool 跟随哪个 release line 会留在文件里。再让它和 `home/.chezmoitemplates/mise-config.toml` 保持一致，就能对应到实际展开到 home 的设置。

更新也分开处理。`mise run nix-update` 更新 Nix 管理的 tool，`mise run mise-update` 更新 mise 管理的 tool，`mise run package-update` 同时更新 Nix 和 mise。如果要把 `node@22` 这样的 major line 往上提，我会先明确修改 `config/mise/config.toml`。

这种距离感正好。

AI agent 周边的 CLI 如果停止更新，很快就会变旧。另一方面，什么都不想就更新，又可能改变昨天还能正常工作的前提。写进 mise 后，至少可以把这种变化作为 diff 看见。

## 作为盆栽的 dotfiles

说到底，dotfiles 很像盆栽。

盆栽不是做出形状就结束。长出来的地方要修剪，盆也会换，还要持续做一些小调整。

dotfiles 也是一样。

如果只是增加新 tool，很快就会变得拥挤。不用的 GUI 应用要从 package list 中移除。能从 Homebrew 迁到 Nix 的就迁过去。修改 agent prompt 时，也要看 sync 和 test。加入外部 skill 时，要在 `upstreams.json` 里记录来源和固定 commit，review 后再更新。

最近我也做了不少这种维护。比如让 Nix 的 user 解析变成动态、修正 nix-darwin 的 primary user、从 managed apps 中移除 Discord、Cinebench、Bitwarden，以及明确 agent logging 和 local wiki 的运用规则。

每个改动单独看都很小。不是华丽的新功能。但这些小整理积累起来，环境就会更贴合现在的生活。

dotfiles 也类似。它不是要一次完成的东西，而是要持续维护的东西。

## 结语

随着交给 AI Agent 的工作增加，我自己直接写的代码行数也许会减少。但环境如何构建的重要性并不会下降。反而会上升。

Agent 读取的 prompt 从哪里来？skill 是哪个 revision？hook 在另一台 PC 上也会同样运行吗？CLI tool 按什么粒度更新，需要时能不能回退？Nix、mise、chezmoi 的职责在哪里分开？

这些点如果模糊，AI 辅助工作的可复现性也会模糊。反过来，如果这些点整理好了，AI Agent 就会成为稳定的工具。

对我来说，dotfiles 已经不只是 shell alias 集合了。它是一起培育多台 PC、Nix package set、mise tool、chezmoi source state、AI Agent prompt、skill、hook 和 eval 的地方。

我想以后也偶尔回头看看，移除已经不适合现在生活的设置，再加入新需要的东西。

这种普通的维护，我想继续做下去。
