---
title: J'ai presque entièrement confié à l'IA la migration de Next.js vers Astro
summary: Le récit de la migration de ce site de Next.js vers Astro, presque entièrement confiée à Codex, de l'implémentation à la vérification.
headerAlt: Un écran affichant du code
---

## Introduction

J'ai migré ce site de Next.js vers Astro.

Ce n'est pas parce que Next.js m'avait dégoûté. Je n'étais pas non plus vraiment bloqué. Mais en regardant ce que ce site fait réellement, Next.js commençait à me sembler un peu trop grand pour lui. Un blog, des liens, une liste de publications, un changement de langue, un mode sombre. Dans les faits, c'est presque entièrement un site statique.

Et pourtant, je traînais encore App Router, le static export, l'optimisation d'images et la configuration Cloudflare Pages. Tout fonctionnait, bien sûr, mais l'ensemble semblait un peu lourd pour la taille du site.

Je suis donc passé à Astro.

Cette fois, j'ai arrêté de réécrire le site petit à petit moi-même et j'ai presque tout confié à Codex. Pas seulement l'implémentation, mais aussi les mesures avant/après, les tests, la correction des échecs et le traitement des retours de review.

Dire que j'ai tout confié à l'IA sonne un peu vague. Ce que j'ai fait en pratique : écrire précisément ce qu'il ne fallait pas casser, puis la laisser avancer jusqu'au bout.

## Ce que je voulais changer

Le but n'était pas de changer de framework parce qu'Astro est à la mode.

La plupart des pages de ce site sont déterminées au moment du build. Il n'y a pas de connexion utilisateur. Il n'y a presque aucun besoin de renvoyer du contenu dynamique côté serveur. Il y a des composants React, mais ils n'ont pas tous besoin de tourner côté client en permanence.

Dans ce cas, il vaut mieux traiter le site comme un site statique.

Avec Astro, les pages vivent sous `src/pages/**`, et le layout commun peut rester côté Astro. Seuls les composants React qui ont vraiment besoin de comportement client restent sous forme d'islands. Cette séparation convenait bien à mon site.

Mais une migration de framework n'est pas terminée simplement parce que l'écran ressemble à l'ancien. URL, SEO, OGP, sitemap, RSS, Cloudflare Pages, accessibilité, changement de langue, theme toggle: les oublis possibles sont nombreux.

J'ai donc commencé par expliquer à Codex assez précisément ce qu'il ne devait pas casser.

## Comment j'ai demandé à Codex

Je n'ai pas simplement écrit: « migre ce site vers Astro ».

J'ai demandé de conserver l'apparence existante, les URL, le SEO, l'accessibilité et le chemin de déploiement Cloudflare Pages. J'ai aussi demandé de comparer le build time, la taille de sortie et les résultats Lighthouse avant et après la migration; de faire passer lint, typecheck, Vitest, E2E et un smoke check en preview; puis de demander à un autre reviewer en lecture seule d'inspecter le résultat.

C'était à peu près la forme de la demande.

Quand on délègue à l'IA, une direction d'implémentation ne suffit pas. C'est encore plus vrai pour une migration. Une page peut s'afficher correctement pendant que le sitemap est faux, que les métadonnées OGP ont disparu ou que les cache headers Cloudflare pointent encore vers l'ancien chemin.

Cette fois, j'ai donc d'abord cadré la définition de « terminé », avant les détails d'implémentation.

## Prendre un baseline d'abord

Avant la migration, Codex a mesuré l'état de la version Next.js.

Il a lancé `bun run build`, vérifié la taille de sortie, regardé la taille de quelques HTML représentatifs, lancé lint, Vitest, Playwright E2E, puis collecté les résultats Lighthouse mobile et desktop.

Ce n'est pas spectaculaire, mais c'est peut-être ce qui a le plus servi. Une migration remplace quelque chose qui fonctionne déjà : sans baseline, il est difficile de savoir si le résultat est meilleur, cassé, ou juste tombé juste par hasard.

Au final, le build time et la taille de sortie se sont nettement améliorés, donc ce baseline a servi.

## Ce qui a changé

Le Next.js App Router sous `src/app/**` a disparu, remplacé par des routes Astro sous `src/pages/**`.
Le layout commun est passé dans `BaseLayout.astro`, et les composants React existants sont restés uniquement là où ils étaient nécessaires comme Astro islands.

Ce n'était pas une réécriture complète : j'ai gardé autant de composants UI que possible. Ce que je voulais changer, c'était la frontière avec le framework.

De petits wrappers locaux ont remplacé `next/link`, `next/image` et `next/navigation`. J'ai aussi retiré `next-themes` et `nuqs`, puis gardé seulement le comportement nécessaire à ce site dans du code local.

RSS, sitemap, robots, metadata, OGP et JSON-LD sont maintenant générés côté Astro. Le workflow Cloudflare Pages a aussi été adapté au build Astro.

Rien de tout cela n'est très voyant. Mais retirer une par une les hypothèses liées au framework ressemble souvent à ce genre de remplacement discret.

## Là où ça a coincé

Le principal problème a été l'hydration.

Des éléments qui tournaient naturellement comme client components dans Next.js ne fonctionnent pas dans Astro tant qu'on n'ajoute pas explicitement des directives comme `client:load`. Le premier passage E2E a échoué de façon assez ordinaire.

L'état actif du sélecteur de langue était faux sur les pages anglaises. Le theme toggle restait en placeholder. Le filtre des Publications ne fonctionnait pas. En entrant dans une page de blog depuis une page anglaise, la date restait au format japonais.

Ce sont exactement les problèmes qu'on rate facilement si l'on regarde seulement la page en diagonale.

Codex les a corrigés en lisant les failure logs E2E. Il a passé le pathname courant depuis Astro au Header, placé le theme provider dans l'island du Header et hydraté la page Publications elle-même. Ce sont les mêmes gestes que j'aurais faits à la main.

La différence était la vitesse de la boucle. Lire le log, formuler une hypothèse, corriger, relancer le test: il a répété ce cycle avec pas mal de persévérance.

## Ce que le reviewer a trouvé

Une fois l'ensemble fonctionnel, j'ai demandé à un autre reviewer en lecture seule de regarder le diff.
Ce qu'il a trouvé était important.

Le sitemap contenait encore des URL de détail de publications qui n'existaient pas réellement. Les métadonnées OGP d'article, comme `article:published_time`, avaient disparu. Les headers Cloudflare ciblaient encore `/_next/static/*` au lieu de `/_astro/*`.

Ce sont des problèmes difficiles à voir en utilisant simplement le site. Les pages s'affichent. Les liens fonctionnent. Mais les détails de SEO et de déploiement sont cassés.

Après ces remarques, Codex a corrigé le sitemap, les métadonnées d'article, les cache headers et la gestion du base path. À la fin, il a inspecté directement le HTML généré pour confirmer que les meta tags étaient réellement présents.

Cette review valait le coup. Quand une IA relit ce qu'une IA a écrit, elle peut rester coincée dans les mêmes présupposés. Ajouter un autre regard change le type de problèmes qu'on attrape.

## Chiffres

À la fin, les vérifications suivantes passaient:

- TypeScript
- lint
- Vitest: 42 files / 152 tests
- Chromium E2E: 50 tests
- Storybook build
- Astro build
- Visual smoke checks avec Playwright

| Élément | Next.js | Astro |
| --- | ---: | ---: |
| build time | 26.74s | 3.41s |
| static output | 11M | 5.5M |
| framework cache/output | `.next` 184M | `.astro` 12K |

Le build time a été divisé par huit. La taille de sortie, par deux.

Lighthouse s'est amélioré sur toutes les routes desktop vérifiées. Sur mobile aussi, presque tout s'est amélioré. Seule la page de détail de blog a perdu un point de performance score, de `72` à `71`, mais le LCP est passé de `11040ms` à `8836ms`, et le TBT de `65ms` à `28ms`.

Pour un site personnel de cette taille, le résultat est largement suffisant.

## Conclusion

Ce que cette migration m'a fait sentir, c'est que plus je délègue à l'IA, plus je dois écrire clairement les critères de fin.

Avec seulement « migre ce site vers Astro », le site aurait probablement fini par s'afficher. Mais dès que l'on inclut URL, SEO, déploiement, performance, E2E et review, définir les conditions au départ devient vraiment utile.

Le plus gros travail humain a été de décider ce qui ne devait pas casser. Je n'ai presque pas écrit de code.

Pour un site personnel de cette taille, si la boucle de build et de test existe déjà, une migration de framework pilotée par l'IA est réaliste. Mais si l'humain ne garde pas la définition de terminé, la migration peut facilement s'arrêter à « ça a l'air de marcher ».

La prochaine fois que je ferai une migration similaire, j'ajouterai d'abord des snapshot tests pour les métadonnées SEO et les URL du sitemap. Ce sont les points que le reviewer a trouvés cette fois, donc je veux qu'ils soient gardés mécaniquement dès le départ.
