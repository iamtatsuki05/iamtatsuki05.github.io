---
title: Des dotfiles bonsaï pour l'ère des AI Agents
summary: Comment je continue d'entretenir un environnement de développement qui change vite en y rassemblant Nix, mise, chezmoi et la configuration des AI agents.
headerAlt: Plante en pot
---

## Introduction

J'aime les dotfiles.

Ou plutôt, je ne peux plus les laisser tranquilles. Avant, il suffisait d'y mettre des alias de shell et des réglages Neovim. Ce n'est plus le cas. Ajouter un PC, travailler dans un environnement Linux, changer d'AI Agent, suivre les mises à jour des CLI tools : à chaque fois, les petites différences d'environnement finissent par compter.

Ce sentiment apparaît directement dans les commits récents de `dotfiles`. Après la migration vers chezmoi et le nettoyage autour de Nix le 2026-04-25, j'ai continué à toucher Nix, mise, les réglages d'AI Agent, les skills, les evals et les hooks.

Ce n'est plus seulement un endroit où déposer des fichiers de configuration. C'est presque une infrastructure de vie quotidienne.

Dans cet article, je regarde cet entretien récent comme des "dotfiles bonsaï pour l'ère des AI Agents". Ce n'est pas une grande théorie. C'est plutôt ce que j'ai constaté en touchant plusieurs PC et plusieurs agents : sans entretien régulier, l'environnement se dérègle vite.

## Le problème

D'abord, qu'est-ce qui est vraiment pénible dans l'environnement de développement actuel ?

Dans mon cas, il n'y a pas un seul environnement. Il y a mon macOS quotidien, des environnements Linux en CLI, des répertoires de recherche et de cours, et les AI Agents ne se limitent pas à Codex. Plus les outils comme `codex`, `claude-code`, `copilot`, `cursor-agent`, `devin`, `hermes` et `opencode` augmentent, plus il devient facile de croire que l'on travaille dans les mêmes conditions alors que les présupposés diffèrent.

La solution naïve consiste à corriger les réglages sur chaque PC et dans chaque tool au moment où le problème apparaît. Cela marche. Mais pas longtemps. On ne sait plus ce qui est installé où. On ne sait plus quel prompt est lu par quel agent. On pense avoir mis à jour un tool, alors qu'un autre environnement reste ancien.

Si seuls des humains utilisaient l'environnement, la mémoire pourrait compenser en partie. Quand on confie du travail aux AI Agents, c'est plus difficile. Un agent dépend fortement des réglages et fichiers qu'il peut lire. Un environnement qui dérive produit un travail qui dérive.

Mes dotfiles se sont donc rapprochés de trois directions.

1. Absorber autant que possible les différences d'OS et de machine avec Nix.
2. Rassembler les prompts, skills et hooks d'AI Agent dans `.agent`.
3. Gérer les CLI tools qui changent vite avec mise.

Chaque élément est banal isolément. Ensemble, ils changent le sens des dotfiles. Ce ne sont plus seulement des réglages pratiques. Ce sont les racines qui soutiennent un travail reproductible.

## Décider ce que Nix doit aligner

D'abord, Nix.

Dans mes dotfiles actuels, je sépare les profils en `full` pour macOS et `cli` pour Linux. Le profil `full` inclut nix-darwin, Home Manager, les applications GUI, les macOS defaults, les fichiers de configuration, mise et Neovim. Le profil `cli` est centré sur les outils CLI et plus facile à utiliser dans des environnements comme Ubuntu.

Cette séparation est importante.

macOS et Linux n'ont pas besoin d'être identiques. Essayer de les rendre identiques devient même douloureux dès que l'on touche aux applications GUI et aux réglages propres à l'OS. Mais je veux garder la même sensation en CLI. Si `zsh`, `git`, `rg`, `mise`, `uv` et Neovim sont alignés, passer à une autre machine devient beaucoup moins gênant.

C'est pourquoi `flake.nix` prend en charge `aarch64-darwin`, `x86_64-darwin`, `aarch64-linux` et `x86_64-linux`. Sur macOS, j'utilise nix-darwin et Home Manager. Sur Linux, j'utilise Home Manager.

Mais je ne veux pas tout mettre dans Nix.

Les choses que je veux fixer de façon déclarative, comme zsh et Neovim, vont côté Nix. Les réglages du terminal, les fichiers de démarrage bash, la configuration `mise` et les modèles de configuration locale, qui vivent naturellement dans le home, restent dans chezmoi. Cette division rend plus clair l'endroit où écrire chaque changement.

Pour moi, Nix est l'endroit où je mets ce qui doit être installé de la même manière à chaque fois. Si j'y mets aussi les réglages que je veux encore modifier facilement, chaque changement devient plus lourd que nécessaire.

## `.agent` est le présupposé donné à l'IA

Vient ensuite la partie AI Agent.

Je rassemble les fichiers liés aux AI CLI agents dans `dotfiles/.agent/`. On y trouve le prompt commun `AGENTS.md`, les réglages par agent dans `apps/`, les hooks communs dans `hooks/`, les `skills/` utilisés par les agents compatibles Codex et Waza, ainsi que les `evals/` par skill.

Quand on utilise des AI Agents, on regarde facilement la capacité du modèle ou la formulation du prompt. Bien sûr, c'est important. Mais après usage répété, un problème beaucoup plus ennuyeux finit par compter.

Un agent a les consignes récentes, alors qu'un autre utilise encore un ancien prompt. Un PC possède le skill nécessaire, un autre non. Les hooks se comportent différemment selon les tools, donc les logs et les traces de vérification ne restent pas de la même manière.

Pour un humain, ce sont peut-être des détails. Pour un agent, ce sont des présupposés différents. Des présupposés différents produisent un travail différent.

J'ai donc arrêté de placer directement les prompts et skills dans le répertoire de configuration de chaque tool. Les dotfiles deviennent la source. `dotfiles/.agent/sync.sh` appelle `scripts/setup_agent_files.sh` et crée des symlinks vers chaque tool home.

C'est très simple, mais cela fonctionne. Si les AI Agents font partie de l'environnement de développement plutôt que d'être des outils pratiques ponctuels, les présupposés qu'on leur donne doivent eux aussi être versionnés.

## Suivre les changements rapides avec mise

Nix et `.agent` ne suffisent pas.

Les CLI autour des AI Agents changent trop vite. `codex`, `claude-code`, `opencode`, `cursor-agent` et `devin` évoluent rapidement. Ils vont trop vite pour être laissés entièrement au package manager de l'OS, mais ils sont trop faciles à oublier si on les installe à la main.

C'est là que mise aide.

`config/mise/config.toml` liste des outils de développement comme `bun`, `node`, `go`, `python`, `uv`, `rust` et `chezmoi`, ainsi que des AI CLI comme `codex`, `claude-code`, `opencode`, `npm:@github/copilot`, `npm:openclaw`, Hermes Agent installé via `pipx`, `http:devin` et `http:cursor-agent`.

Avec mise, les tools et leurs release lines restent écrits dans un fichier. En gardant cela aligné avec `home/.chezmoitemplates/mise-config.toml`, on relie aussi cette liste à la configuration réellement rendue dans le home.

Je sépare aussi les mises à jour. `mise run nix-update` met à jour les tools gérés par Nix, `mise run mise-update` met à jour les tools gérés par mise, et `mise run package-update` met à jour Nix et mise ensemble. Pour monter une major line comme `node@22`, je modifie d'abord explicitement `config/mise/config.toml`.

Cette distance me paraît juste.

Les CLI autour des AI Agents vieillissent vite si les mises à jour s'arrêtent. À l'inverse, mettre à jour sans réfléchir peut changer des hypothèses qui fonctionnaient encore hier. En les écrivant dans mise, je peux au moins voir ce changement comme un diff.

## Les dotfiles comme bonsaï

Au fond, les dotfiles ressemblent à un bonsaï.

Un bonsaï n'est pas terminé une fois que sa forme est faite. On coupe ce qui a poussé, on change parfois le pot, et on continue de petits ajustements.

Les dotfiles sont pareils.

Si j'ajoute seulement de nouveaux tools, l'ensemble devient vite encombré. Retirer les applications GUI que je n'utilise plus de la package list. Déplacer vers Nix ce qui peut quitter Homebrew. Quand je modifie un prompt d'agent, regarder aussi la synchronisation et les tests. Quand j'ajoute un skill externe, enregistrer son origine et son commit épinglé dans `upstreams.json`, le relire, puis le mettre à jour.

J'ai récemment fait plusieurs entretiens de ce type : résoudre dynamiquement l'utilisateur Nix, corriger le primary user de nix-darwin, retirer Discord, Cinebench et Bitwarden des managed apps, et formaliser les règles d'agent logging et de local wiki.

Chaque changement est petit. Aucun n'est une fonctionnalité spectaculaire. Mais ces petits nettoyages s'accumulent, et l'environnement finit par mieux correspondre à la vie actuelle.

Les dotfiles sont similaires. Je ne les vois pas comme quelque chose que l'on termine, mais comme quelque chose que l'on continue d'entretenir.

## Conclusion

À mesure que je délègue plus de travail aux AI Agents, j'écrirai peut-être moins de code directement. Mais l'importance de la construction de l'environnement ne diminue pas. Elle augmente.

D'où vient le prompt lu par l'agent ? Quelle est la revision du skill ? Les hooks fonctionnent-ils de la même façon sur un autre PC ? À quelle granularité les CLI tools sont-ils mis à jour, et peut-on revenir en arrière ? Où se séparent les responsabilités de Nix, mise et chezmoi ?

Si ces points sont flous, le travail assisté par IA devient difficile à reproduire. S'ils sont organisés, les AI Agents deviennent des outils beaucoup plus stables.

Pour moi, les dotfiles ne sont plus une simple collection d'alias shell. C'est l'endroit où faire grandir ensemble plusieurs PC, un Nix package set, des tools mise, un chezmoi source state, des prompts d'AI Agent, des skills, des hooks et des evals.

Je veux continuer à les regarder de temps en temps, retirer les réglages qui ne correspondent plus à ma vie actuelle, et ajouter ce qui devient nécessaire.

C'est ce genre d'entretien ordinaire que je veux continuer.
