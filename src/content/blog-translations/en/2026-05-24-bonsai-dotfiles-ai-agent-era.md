---
title: Bonsai Dotfiles for the AI Agent Era
summary: How I keep tending a fast-changing development environment by bringing Nix, mise, chezmoi, and AI agent configuration into dotfiles.
headerAlt: A potted plant
legacyAnchors:
  'agent-is-the-assumption-given-to-ai': 'collecting-the-ai-facing-assumptions-in-agent'
---

## Introduction

I like dotfiles.

Or more accurately, I can no longer leave them alone. In the past, shell aliases and Neovim settings were enough. That is no longer true. Add another PC, work in a Linux environment, switch AI agents, or follow updates to CLI tools, and what is installed where starts to drift.

That feeling shows up in recent `dotfiles` commits. I moved to chezmoi and cleaned up the Nix side on 2026-04-25. Since then I have kept touching Nix, mise, AI agent settings, skills, evals, and hooks.

This is no longer just a place to put configuration files. It is closer to daily infrastructure. After working across multiple PCs and multiple agents, I came to see that it gets messy unless I keep tending it. So I want to write about that recent maintenance the way you would talk about a bonsai.

## Problem Setting

In my case, I work in more than one environment. There is my daily macOS machine, Linux CLI environments, research and course directories, and AI agents beyond Codex. As tools such as `codex`, `claude-code`, `copilot`, `cursor-agent`, `devin`, `hermes`, and `opencode` pile up, I end up doing what I think is the same work on different assumptions.

The naive approach is to fix each PC and each tool on the spot. It works, but not for long. You lose track of what is installed where. You stop knowing which prompt each agent is reading. You think you updated a tool, but another environment still has the old one.

If only humans were using the environment, memory could cover some of that. Once I hand work to AI agents, it cannot. An agent's work depends heavily on the settings and files it can read right there. If the environment has drifted, what comes back drifts too.

So my recent dotfiles have been moving in these directions:

- Use Nix to absorb OS and machine differences where possible
- Collect AI agent prompts, skills, and hooks under `.agent`
- Manage fast-moving CLI tools with mise

Each piece is ordinary on its own. Together, though, they let me start from the same assumptions on any machine.

## Deciding What Nix Should Align

In my current dotfiles, I split profiles into `full` for macOS and `cli` for Linux. `full` includes nix-darwin, Home Manager, GUI apps, macOS defaults, configuration files, mise, and Neovim. `cli` focuses on CLI tools and is easier to use in environments such as Ubuntu.

macOS and Linux do not need to be identical. In fact, trying to make them identical becomes painful around GUI apps and OS-specific settings. But I do want the CLI feel to stay aligned. If `zsh`, `git`, `rg`, `mise`, `uv`, and Neovim are consistent, moving to another machine feels much less awkward.

That is why `flake.nix` handles `aarch64-darwin`, `x86_64-darwin`, `aarch64-linux`, and `x86_64-linux`. I use nix-darwin and Home Manager on macOS, and Home Manager on Linux.

I do not want to put everything into Nix, though. Things I want to fix declaratively, such as zsh and Neovim, go to the Nix side. Things that naturally live in the home directory, such as terminal settings, bash startup files, `mise` config, and local configuration templates, stay in chezmoi. This division makes it easier to decide where a change belongs.

For me, Nix is where I put things that should be installed the same way every time. If I move even settings that I still want to tweak casually into Nix, each change starts to feel heavier than necessary.

## Collecting the AI-Facing Assumptions in `.agent`

I keep AI CLI agent files under `dotfiles/.agent/`: the shared prompt `AGENTS.md`, per-agent settings under `apps/`, shared hooks under `hooks/`, `skills/` for Codex-compatible agents and Waza, and per-skill `evals/`.

When using AI agents, it is easy to focus on model capability or prompt wording. Those matter. But after using agents many times, the difference shows up somewhere more boring. One agent has the latest guidance, while another is still on an old prompt. One PC has the required skill, while another does not. Hooks behave differently from tool to tool, so logs and verification traces are left in different ways.

To a human, those look like minor differences. To an agent, they are different assumptions. Different assumptions produce different work.

So I stopped placing prompts and skills directly in each tool's configuration directory, and made dotfiles the source. `dotfiles/.agent/sync.sh` calls `scripts/setup_agent_files.sh` and creates symlinks into each tool home. With that in place, every agent on every PC reads the same prompt and skill files. If AI agents are part of the development environment, the assumptions given to them should be version-controlled too.

## Tracking Fast Changes with mise

Nix and `.agent` are not enough, because the CLIs around agents change so fast. `codex`, `claude-code`, `opencode`, `cursor-agent`, and `devin` all move quickly. They move too fast to leave entirely to the OS package manager, but they are too easy to forget if I install them by hand.

That part I leave to mise. `config/mise/config.toml` lists development tools such as `bun`, `node`, `go`, `python`, `uv`, `rust`, and `chezmoi`, plus AI CLIs such as `codex`, `claude-code`, `opencode`, `npm:@github/copilot`, `npm:openclaw`, Hermes Agent installed through `pipx`, `http:devin`, and `http:cursor-agent`.

With mise, the tools and release lines are written down in a file. Keeping it aligned with `home/.chezmoitemplates/mise-config.toml` also connects it to the configuration rendered into the home directory.

I also separate updates. `mise run nix-update` updates Nix-managed tools, `mise run mise-update` updates mise-managed tools, and `mise run package-update` updates both Nix and mise. When raising a major line such as `node@22`, I change `config/mise/config.toml` first.

That distance feels about right. Stop updating and the tools go stale, but update without thinking and yesterday's working assumptions change. Writing them into mise at least lets me see that change as a diff.

## Dotfiles as Bonsai

In the end, dotfiles feel close to bonsai. A bonsai is not finished once its shape is made. You trim what has grown, change the pot, and keep making small adjustments.

If I only add new tools, the tree gets crowded quickly. Remove GUI apps I no longer use from the package list. Move what can move from Homebrew to Nix. When changing an agent prompt, check sync and tests too. When adding an external skill, record its origin and pinned commit in `upstreams.json`, review it, and then update it.

I have recently made several of these small changes: resolving the Nix user dynamically, fixing the nix-darwin primary user, removing Discord, Cinebench, and Bitwarden from managed apps, and writing down the rules for agent logging and local wiki usage.

Each change is small, and none of them is a flashy new feature. Still, as these small cleanups accumulate, the environment starts to fit my current life better.

## Closing

As I delegate more work to AI agents, I may write fewer lines of code myself. But how the environment is built matters no less. It matters more.

Where does the prompt the agent reads come from? Which revision is the skill on? Will hooks behave the same way on another PC? At what granularity are CLI tools updated, and can they be rolled back? Where do the responsibilities of Nix, mise, and chezmoi begin and end?

If these points are vague, AI-assisted work is hard to reproduce. If they are settled, AI agents become stable tools.

For me, dotfiles are no longer just a collection of shell aliases. They are a place to grow multiple PCs, a Nix package set, mise tools, chezmoi source state, AI agent prompts, skills, hooks, and evals together. Every so often I look at them again, remove settings that no longer fit my life, and add what has become necessary. That kind of ordinary maintenance is what I want to continue.
