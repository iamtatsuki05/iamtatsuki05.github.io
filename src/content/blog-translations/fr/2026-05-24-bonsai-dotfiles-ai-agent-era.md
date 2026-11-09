---
title: Des dotfiles bonsaï pour l'ère des AI Agents
summary: Comment je rassemble Nix, mise, chezmoi et la configuration des AI Agents dans mes dotfiles pour entretenir, comme un bonsaï, un environnement de développement qui change vite.
headerAlt: Plante en pot
legacyAnchors:
  'agent-est-le-présupposé-donné-à-lia': 'rassembler-dans-agent-les-présupposés-destinés-à-lia'
---

## Introduction

J'aime les dotfiles.

Ou plutôt, je ne peux plus les laisser tranquilles. Avant, il suffisait d'y mettre des alias de shell et des réglages Neovim. Ce n'est plus le cas. Ajouter un PC, travailler dans un environnement Linux, changer d'AI Agent, suivre les mises à jour des CLI tools : à chaque fois, ce qui est installé d'un environnement à l'autre diverge un peu plus.

Ce sentiment se retrouve tel quel dans les commits récents de `dotfiles`. Le 2026-04-25, j'ai fait la migration vers chezmoi et le nettoyage autour de Nix. Depuis, j'ai continué à retoucher Nix, mise, les réglages d'AI Agent, les skills, les evals et les hooks.

Mes dotfiles sont désormais moins un endroit où déposer des fichiers de configuration qu'une infrastructure de mon quotidien. À force de travailler sur plusieurs PC et avec plusieurs agents, j'en suis venu à me dire que tout cela se dérègle vite si je n'y touche pas régulièrement. Je raconte donc ici mes derniers travaux d'entretien en les comparant à un bonsaï.

## Le problème

Dans mon cas, je n'ai pas qu'un seul environnement. J'ai mon macOS de tous les jours, des environnements CLI sous Linux, des répertoires de travail pour la recherche et les cours, et je n'utilise pas que Codex comme AI Agent. Plus les outils comme `codex`, `claude-code`, `copilot`, `cursor-agent`, `devin`, `hermes` et `opencode` se multiplient, plus il m'arrive de croire travailler dans les mêmes conditions alors que les présupposés diffèrent.

La solution naïve consiste à corriger les réglages sur chaque PC et dans chaque tool au moment où le problème apparaît. Cela marche. Mais pas longtemps. On ne sait plus ce qui est installé où. On ne sait plus quel prompt est lu par quel agent. On pense avoir installé la nouvelle version d'un tool, alors qu'un autre environnement en est resté à l'ancienne.

Si seuls des humains utilisaient l'environnement, la mémoire pourrait compenser en partie. Dès que je confie le travail à des AI Agents, ce n'est plus possible. Le travail d'un agent dépend fortement des réglages et des fichiers qu'il peut lire sur place. Si l'environnement a dérivé, les résultats dérivent aussi.

Ces derniers temps, mes dotfiles évoluent donc dans ces directions :

- absorber autant que possible les différences d'OS et de machine avec Nix
- rassembler les prompts, skills et hooks d'AI Agent dans `.agent`
- gérer les CLI tools qui changent vite avec mise

Chaque élément est banal isolément. Mais une fois ces trois points réunis, je peux commencer à travailler à partir des mêmes présupposés sur n'importe quelle machine.

## Décider ce que Nix doit aligner

Dans mes dotfiles actuels, je distingue deux profils : `full` pour macOS et `cli` pour Linux. Le profil `full` inclut nix-darwin, Home Manager, les applications GUI, les macOS defaults, les fichiers de configuration, mise et Neovim. Le profil `cli` est centré sur les outils CLI et plus facile à utiliser dans des environnements comme Ubuntu.

macOS et Linux n'ont pas besoin d'être identiques. Essayer de les rendre identiques devient même douloureux dès que l'on touche aux applications GUI et aux réglages propres à l'OS. Je veux tout de même retrouver le même confort en CLI. Si `zsh`, `git`, `rg`, `mise`, `uv` et Neovim sont alignés, on se sent beaucoup moins dépaysé en arrivant sur une autre machine.

C'est pourquoi `flake.nix` prend en charge `aarch64-darwin`, `x86_64-darwin`, `aarch64-linux` et `x86_64-linux`. Sur macOS, j'utilise nix-darwin et Home Manager. Sur Linux, j'utilise Home Manager.

Cela dit, je ne veux pas tout mettre dans Nix. Les choses que je veux fixer de façon déclarative, comme zsh et Neovim, vont côté Nix. Les réglages du terminal, les fichiers de démarrage bash, la configuration `mise` et les modèles de configuration locale, qui ont naturellement leur place dans le répertoire personnel, restent dans chezmoi. Cette division rend plus clair l'endroit où écrire chaque changement.

Pour moi, Nix est l'endroit où je mets ce qui doit être installé de la même manière à chaque fois. À l'inverse, si j'y mets aussi les réglages avec lesquels je veux encore expérimenter, chaque modification devient pesante.

## Rassembler dans `.agent` les présupposés destinés à l'IA

Je rassemble les fichiers liés aux AI CLI agents dans `dotfiles/.agent/`. On y trouve le prompt commun `AGENTS.md`, les réglages par agent dans `apps/`, les hooks communs dans `hooks/`, les `skills/` utilisés par les agents compatibles Codex et Waza, ainsi que les `evals/` par skill.

Quand on utilise des AI Agents, on a tendance à regarder surtout la capacité du modèle ou la formulation du prompt. Bien sûr, c'est important aussi. Mais à force de les utiliser, la différence se joue sur des détails beaucoup plus prosaïques. Un agent a les consignes récentes, alors qu'un autre utilise encore un ancien prompt. Un PC possède le skill nécessaire, un autre non. Les hooks se comportent différemment selon les tools, si bien qu'une même demande ne laisse pas les mêmes logs de travail ni les mêmes traces de vérification.

Pour un humain, ce sont peut-être des détails. Pour un agent, ce sont des présupposés différents. Des présupposés différents produisent un travail différent.

J'ai donc arrêté de placer directement les prompts et skills dans le répertoire de configuration de chaque tool : ce sont les dotfiles qui font foi. `dotfiles/.agent/sync.sh` appelle `scripts/setup_agent_files.sh` et crée des symlinks dans le home de chaque tool. Ainsi, sur n'importe quel PC et pour n'importe quel agent, le prompt et les skills lus pointent vers les mêmes fichiers. Si les AI Agents font partie de l'environnement de développement, les présupposés qu'on leur donne doivent eux aussi être versionnés.

## Suivre les changements rapides avec mise

Nix et `.agent` ne suffisent pas, parce que les CLI autour des agents changent vite. Dès qu'on laisse `codex`, `claude-code`, `opencode`, `cursor-agent` ou `devin` de côté un moment, la situation a déjà changé. Ils vont trop vite pour être laissés entièrement au package manager de l'OS, mais ils sont trop faciles à oublier si on les installe à la main.

C'est cette partie que je laisse à mise. `config/mise/config.toml` liste des outils de développement comme `bun`, `node`, `go`, `python`, `uv`, `rust` et `chezmoi`, ainsi que des AI CLI comme `codex`, `claude-code`, `opencode`, `npm:@github/copilot`, `npm:openclaw`, Hermes Agent installé via `pipx`, `http:devin` et `http:cursor-agent`.

Avec mise, je peux noter dans un fichier quelle release line suit chaque tool. Comme je le garde aligné avec `home/.chezmoitemplates/mise-config.toml`, il correspond aussi à la configuration réellement déployée dans le répertoire personnel.

Je sépare aussi les mises à jour. `mise run nix-update` met à jour les tools gérés par Nix, `mise run mise-update` met à jour les tools gérés par mise, et `mise run package-update` met à jour Nix et mise ensemble. Pour monter une major line comme `node@22`, je modifie d'abord explicitement `config/mise/config.toml`.

Cette façon de gérer les mises à jour me paraît juste. Si j'arrête les mises à jour, les outils vieillissent vite ; si je mets à jour sans réfléchir, des présupposés qui tenaient encore hier changent. Comme tout est écrit dans mise, je peux au moins voir ce changement sous forme de diff.

## Les dotfiles comme bonsaï

Au fond, les dotfiles ressemblent à un bonsaï. Même une fois sa forme donnée, on continue de couper ce qui a poussé, de changer le pot et d'y faire de petits ajustements.

Si j'ajoute seulement de nouveaux tools, l'ensemble devient vite encombré. Retirer les applications GUI que je n'utilise plus de la package list. Déplacer vers Nix ce qui peut quitter Homebrew. Quand je modifie un prompt d'agent, regarder aussi la synchronisation et les tests. Quand j'ajoute un skill externe, enregistrer son origine et son commit épinglé dans `upstreams.json`, le relire, puis le mettre à jour.

J'ai récemment fait plusieurs opérations d'entretien de ce genre. Résoudre dynamiquement l'utilisateur Nix. Corriger le primary user de nix-darwin. Retirer Discord, Cinebench et Bitwarden des managed apps. Formaliser les règles d'agent logging et de local wiki.

Pris un par un, chacun de ces changements est petit, et aucun n'est une fonctionnalité spectaculaire. Pourtant, ces petits nettoyages s'accumulent, et l'environnement finit par mieux correspondre à ma vie actuelle.

## Conclusion

À mesure que je délègue plus de travail aux AI Agents, j'écrirai peut-être moins de code directement. Mais la façon de construire l'environnement devient au contraire plus importante.

D'où vient le prompt lu par l'agent ? Quelle révision du skill est utilisée ? Les hooks fonctionnent-ils de la même façon sur un autre PC ? À quelle granularité les CLI tools sont-ils mis à jour, et peut-on revenir en arrière ? Où se séparent les responsabilités de Nix, mise et chezmoi ?

Si ces points sont flous, le travail confié à l'IA devient difficile à reproduire. S'ils sont en ordre, les AI Agents deviennent des outils stables.

Pour moi, les dotfiles ne sont plus une simple collection d'alias shell. C'est l'endroit où faire grandir ensemble plusieurs PC, un Nix package set, des tools mise, un chezmoi source state, des prompts d'AI Agent, des skills, des hooks et des evals. De temps en temps, je les regarde à nouveau, je retire les réglages qui ne correspondent plus à ma vie actuelle et j'ajoute ce qui est devenu nécessaire. Je veux continuer ce genre d'entretien ordinaire.
