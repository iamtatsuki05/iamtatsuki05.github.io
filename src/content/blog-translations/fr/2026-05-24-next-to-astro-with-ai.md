---
title: J’ai confié presque toute la migration de Next.js vers Astro à l’IA
summary: Retour sur la migration de ce site de Next.js vers Astro, en laissant Codex gérer l’implémentation, les tests et les corrections après revue.
headerAlt: Écran affichant du code
---

## Introduction

Ce site fonctionnait auparavant avec l’export statique de Next.js. C’était un site personnel assez classique : des articles, une page de liens, une liste de publications, un changement de langue japonais/anglais et un mode sombre.

En pratique, c’était pourtant presque entièrement un site statique. Next.js ne posait pas de problème grave, mais App Router, l’export statique, l’optimisation des images et la configuration autour de Cloudflare Pages commençaient à paraître un peu lourds pour ce besoin.

J’ai donc migré le site vers Astro. Cette fois, j’ai demandé à Codex de prendre en charge non seulement l’implémentation, mais aussi l’investigation, les mesures avant/après, les tests et les corrections après revue.

Dire que j ai "tout laisse a l IA" serait un peu approximatif. En realite, j ai donne des criteres de fin tres precis, puis je l ai laisse avancer dans ce cadre. Cet article en garde la trace.

## La maniere de formuler la demande

La premiere instruction donnee a Codex n etait pas simplement "migre vers Astro".

J ai demande de conserver l apparence, les URL, le SEO, l accessibilite et le chemin de deploiement Cloudflare Pages. J ai aussi demande de comparer le temps de build, la taille de sortie et les scores Lighthouse avant et apres la migration, de faire passer lint, typecheck, Vitest, E2E et un smoke check de preview, puis de faire relire le resultat par un reviewer separe en read-only.

Quand on confie une tache a l IA, donner seulement une direction d implementation est dangereux. Dans une migration de framework, la page peut s afficher correctement alors que le sitemap ou les metadonnees OGP sont casses. Cette fois, j ai donc defini a l avance ce que signifiait "termine".

## Mesurer d abord l etat initial

Au debut, Codex a mesure la version Next.js existante.

Il a execute `bun run build`, mesure la taille de sortie, inspecte la taille des principaux fichiers HTML, puis lance lint, Vitest, Playwright E2E et Lighthouse en mobile et desktop.

Ce n est pas spectaculaire, mais c etait utile. Une migration ne consiste pas a reparer quelque chose de casse ; il s agit de remplacer un systeme qui marche deja sans perdre de comportement. Sans baseline, on ne peut rien comparer serieusement.

## Ce qui a change

Cote implementation, `src/app/**` de Next.js App Router a ete supprime et remplace par des routes Astro sous `src/pages/**`. Le layout commun est passe dans `BaseLayout.astro`, et les composants React existants sont restes en Astro islands uniquement la ou c etait necessaire.

Ce n etait pas une reecriture complete. Au contraire, les composants UI ont ete conserves autant que possible. Les changements principaux se situaient a la frontiere avec le framework.

Par exemple, de petits wrappers locaux ont remplace `next/link`, `next/image` et `next/navigation`. `next-themes` et `nuqs` ont aussi ete retires, avec une implementation locale limitee a ce dont le site avait besoin.

RSS, sitemap, robots, metadata, OGP et JSON-LD sont maintenant generes cote Astro. Le workflow Cloudflare Pages a aussi ete adapte au build Astro.

## Ce qui n a pas ete fluide

Le point le plus delicat a ete l hydration.

Dans Next.js, certains composants fonctionnaient naturellement comme client components. Dans Astro, ils ne s executent pas sans directives explicites comme `client:load`. Le premier E2E a donc echoue assez normalement.

Par exemple, l etat actif du language switch etait faux sur les pages anglaises, le theme toggle restait dans un etat placeholder, et le filtre Publications ne fonctionnait pas. En entrant dans un blog detail depuis une page anglaise, la date restait au format japonais.

Codex a corrige ces points en lisant les logs d echec E2E et en inspectant le DOM. Il a passe le pathname courant depuis Astro au Header, place le theme provider dans l island du Header, et hydrate la page Publications elle-meme.

Si je l avais fait a la main, j aurais probablement suivi la meme boucle : logs Playwright, inspection du DOM, correction. Codex a simplement accelere cette boucle.

## Ce que la revue a trouve

Une fois le site fonctionnel, j ai demande a un reviewer read-only separe d examiner le diff. Cela a fait ressortir plusieurs details importants.

Le sitemap contenait encore des URL de detail de publications qui n existaient pas. Les metadonnees OGP d article comme `article:published_time` avaient disparu. Les headers Cloudflare ciblaient encore `/_next/static/*` au lieu de `/_astro/*`.

Ces problemes sont difficiles a detecter avec des E2E ordinaires. Les pages s affichent, les liens fonctionnent, mais le SEO ou le deploiement peuvent etre abimes.

Apres la revue, Codex a corrige le sitemap, les metadonnees d article, les headers de cache et la prise en charge du base path. A la fin, il a inspecte directement le HTML genere pour verifier que les balises meta etaient bien presentes.

## Chiffres

Au final, les controles suivants passaient :

- TypeScript
- lint
- Vitest : 42 fichiers / 152 tests
- Chromium E2E : 50 tests
- Storybook build
- Astro build
- smoke checks visuels avec Playwright

| Element | Next.js | Astro |
| --- | ---: | ---: |
| build time | 26.74s | 3.41s |
| static output | 11M | 5.5M |
| framework cache/output | `.next` 184M | `.astro` 12K |

Le temps de build a fortement diminue. La taille de sortie a aussi ete presque divisee par deux.

Lighthouse s est ameliore sur toutes les routes desktop controlees. En mobile aussi, presque toutes les routes ont progresse. Le score de performance du blog detail est passe de `72` a `71`, mais le LCP est passe de `11040ms` a `8836ms` et le TBT de `65ms` a `28ms`, donc cette baisse semblait plutot liee a la ponderation ou a la variance Lighthouse qu a une vraie regression visible.

Pour un site personnel de cette taille, c est largement suffisant.

## Ce que j en retiens

Meme quand on dit que l on confie tout a l IA, on ne peut pas simplement s absenter.

Le travail humain le plus important n etait pas l implementation, mais la definition de ce qui ne devait pas casser : les URL, le SEO, le deploiement, la performance et les tests. En l ecrivant d abord, l IA peut avancer avec beaucoup de persistance.

Sans cela, on risque d obtenir une migration qui semble correcte seulement en surface.

La baseline vaut aussi l effort. Apres la migration, on peut dire non seulement que le site semble plus rapide, mais aussi ou et de combien. Ici, le gain sur le temps de build et la taille de sortie etait tres visible.

Faire appel a un reviewer separe a egalement aide. Comme un humain, l IA peut manquer des problemes dans son propre travail. Un autre point de vue a repere le sitemap et l OGP.

## Conclusion

Cette migration a ete largement pilotee par l IA. Mais ce n etait pas magique : il a fallu definir des conditions precises, lire les logs, corriger les echecs, puis revoir le resultat sous un autre angle.

Pour un site personnel avec une boucle de build et de tests solide, une migration de framework pilotee par l IA me semble deja tres realiste.

La prochaine fois, j ajouterais des snapshot tests pour les metadonnees SEO et les URL du sitemap avant de commencer. Comme le reviewer a trouve ces points cette fois-ci, autant les proteger mecaniquement des le depart.
