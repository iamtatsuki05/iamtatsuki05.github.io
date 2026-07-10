---
title: Bonsai Dotfiles for the AI Agent Era
summary: How I keep tending a fast-changing development environment by bringing Nix, mise, chezmoi, and AI agent configuration into dotfiles.
headerAlt: A potted plant
---

## Introduction

I like dotfiles.

Or more accurately, I can no longer leave them alone. In the past, shell aliases and Neovim settings were enough. That is no longer true. Add another PC, work in a Linux environment, switch AI agents, or follow updates to CLI tools, and small differences in the environment start to matter.

That feeling shows up directly in recent `dotfiles` commits. After moving to chezmoi and cleaning up the Nix side on 2026-04-25, I kept touching Nix, mise, AI agent settings, skills, evals, and hooks.

This is no longer just a place to put configuration files. It is closer to daily infrastructure.

This article walks through my recent dotfiles maintenance, treating it like tending a bonsai. It comes from working across multiple PCs and multiple agents, and realizing that the environment gets messy quickly unless it is tended.

## Problem Setting

First, what is actually troublesome about the current development environment?

In my case, I work in more than one environment. There is my daily macOS machine, Linux CLI environments, research and course directories, and AI agents beyond Codex. As tools such as `codex`, `claude-code`, `copilot`, `cursor-agent`, `devin`, `hermes`, and `opencode` pile up, I end up doing what I think is the same work on different assumptions.

The naive approach is to fix each PC and each tool on the spot. It works, but not for long. You lose track of what is installed where. You stop knowing which prompt each agent is reading. You think you updated a tool, but another environment still has the old one.

If only humans were using the environment, memory could cover some of that. Once AI agents are doing work, it becomes harder. Agents are strongly affected by the settings and files they can read. A drifting environment becomes drifting work.

So my recent dotfiles have been moving in these directions:

- Use Nix to absorb OS and machine differences where possible
- Collect AI agent prompts, skills, and hooks under `.agent`
- Manage fast-moving CLI tools with mise

Each piece is ordinary on its own. Together, though, dotfiles become the roots that support reproducible work.

## Deciding What Nix Should Align

First, Nix.

In my current dotfiles, I split profiles into `full` for macOS and `cli` for Linux. `full` includes nix-darwin, Home Manager, GUI apps, macOS defaults, configuration files, mise, and Neovim. `cli` focuses on CLI tools and is easier to use in environments such as Ubuntu.

This split is the key part.

macOS and Linux do not need to be identical. In fact, trying to make them identical becomes painful around GUI apps and OS-specific settings. But I do want the CLI feel to stay aligned. If `zsh`, `git`, `rg`, `mise`, `uv`, and Neovim are consistent, moving to another machine feels much less awkward.

That is why `flake.nix` handles `aarch64-darwin`, `x86_64-darwin`, `aarch64-linux`, and `x86_64-linux`. I use nix-darwin and Home Manager on macOS, and Home Manager on Linux.

But I do not want to put everything into Nix.

Things I want to fix declaratively, such as zsh and Neovim, go to the Nix side. Things that naturally live in the home directory, such as terminal settings, bash startup files, `mise` config, and local configuration templates, stay in chezmoi. This division makes it easier to decide where a change belongs.

For me, Nix is where I put things that should be installed the same way every time. If I move even settings that I still want to tweak casually into Nix, each change starts to feel heavier than necessary.

## `.agent` Is the Assumption Given to AI

Next is the AI agent side.

I keep AI CLI agent files under `dotfiles/.agent/`: the shared prompt `AGENTS.md`, per-agent settings under `apps/`, shared hooks under `hooks/`, `skills/` for Codex-compatible agents and Waza, and per-skill `evals/`.

When using AI agents, it is easy to focus on model capability or prompt wording. Those matter. But after using agents repeatedly, a more boring issue starts to matter.

One agent has the latest guidance, while another is still on an old prompt. One PC has the required skill, while another does not. Hooks behave differently from tool to tool, so logs and verification traces are left in different ways.

To a human, those may look like minor differences. To an agent, they are different assumptions. Different assumptions produce different work.

So I stopped placing prompts and skills directly in each tool's configuration directory. Dotfiles are the source. `dotfiles/.agent/sync.sh` calls `scripts/setup_agent_files.sh` and creates symlinks into each tool home.

Plain, but it works. If AI agents are part of the development environment, the assumptions given to them should also be version-controlled.

## Tracking Fast Changes with mise

Nix and `.agent` are not enough.

CLI tools around AI agents change too quickly. `codex`, `claude-code`, `opencode`, `cursor-agent`, and `devin` all move fast. They move too quickly to leave entirely to the OS package manager, but they are too easy to forget if installed by hand.

This is where mise helps.

`config/mise/config.toml` lists development tools such as `bun`, `node`, `go`, `python`, `uv`, `rust`, and `chezmoi`, plus AI CLIs such as `codex`, `claude-code`, `opencode`, `npm:@github/copilot`, `npm:openclaw`, Hermes Agent installed through `pipx`, `http:devin`, and `http:cursor-agent`.

With mise, the tools and release lines are written down in a file. Keeping it aligned with `home/.chezmoitemplates/mise-config.toml` also connects it to the configuration rendered into the home directory.

I also separate updates. `mise run nix-update` updates Nix-managed tools, `mise run mise-update` updates mise-managed tools, and `mise run package-update` updates both Nix and mise. When raising a major line such as `node@22`, I explicitly change `config/mise/config.toml` first.

This distance feels right.

CLI tools around AI agents get old quickly if updates stop. On the other hand, updating without thinking can change assumptions that were working yesterday. By writing them in mise, I can at least see that change as a diff.

## Dotfiles as Bonsai

In the end, dotfiles feel close to bonsai.

Bonsai is not finished once its shape is made. You trim what has grown, change the pot, and keep making small adjustments.

Dotfiles are the same.

If I only add new tools, the tree gets crowded quickly. Remove GUI apps I no longer use from the package list. Move what can move from Homebrew to Nix. When changing an agent prompt, check sync and tests too. When adding an external skill, record its origin and pinned commit in `upstreams.json`, review it, and then update it.

I have recently made several of these small maintenance changes: resolving the Nix user dynamically, fixing the nix-darwin primary user, removing Discord, Cinebench, and Bitwarden from managed apps, and writing down rules for agent logging and local wiki usage.

Each change is small. None of them is a flashy new feature. But as these small cleanups accumulate, the environment starts to fit my current life better.

Dotfiles are similar. I do not think of them as something to finish, but as something to keep tending.

## Closing

As I delegate more work to AI agents, I may write fewer lines of code directly. But the importance of how the environment is built does not go down. It goes up.

Where does the prompt the agent reads come from? Which revision is the skill on? Will hooks behave the same way on another PC? At what granularity are CLI tools updated, and can they be rolled back? Where do the responsibilities of Nix, mise, and chezmoi begin and end?

If these points are vague, AI-assisted work is hard to reproduce. If they are organized, AI agents become stable tools.

For me, dotfiles are no longer just a collection of shell aliases. They are a place to grow multiple PCs, a Nix package set, mise tools, chezmoi source state, AI agent prompts, skills, hooks, and evals together.

I want to keep looking at them from time to time, remove settings that no longer fit my life, and add what has become necessary.

That kind of ordinary maintenance is what I want to continue.
