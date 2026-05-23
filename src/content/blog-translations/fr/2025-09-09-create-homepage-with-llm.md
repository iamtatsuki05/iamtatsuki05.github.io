---
title: Construire ce site avec un LLM
summary: Retour rapide sur la création de ce site en vibe coding.
headerAlt: Illustration du vibe coding
---

## Introduction

Je voulais depuis quelque temps créer une page de présentation personnelle, mais je n’avais jamais vraiment eu le temps de commencer. Récemment, le "vibe coding", une façon de développer par élan et par dialogue avec des outils comme Claude Code ou Codex, est devenu un sujet courant. Comme j’avais enfin un peu de temps, j’ai essayé de construire ce site personnel de cette manière.

## Processus

Le processus a ete le suivant :

1. definir les exigences
2. les confier a Codex
3. donner plusieurs retours sur le code genere
4. ecrire moi-meme les textes de presentation, puis demander a l IA de les relire

### Definition des exigences

Comme j utilise ChatGPT Plus, je suis parti de la. J ai donne a GPT des idees de routes et de stack technique sous forme de liste, puis je lui ai demande de les transformer en cahier des charges.

<details>
<summary>Demande</summary>

```plaintext
Je veux creer ma propre page web.
Aide-moi a definir les exigences.
Je n ai pas besoin d implementation pour le moment. Prepare un document de requirements que je pourrai donner a Codex.

## Idee de routing
- Structure
    - /
        - presentation personnelle et explication des routes
        - /links
            - URL externes
        - /articls
            - articles, papiers, etc.
        - /blogs
            - articles rendus depuis Markdown

## Exigences d implementation
- Utiliser TypeScript et Next.js pour une UI/UX moderne basee sur React.
- Utiliser GitHub Pages pour un site statique afin de reduire les couts d operation.
- Pour les mises a jour du blog, je veux eviter de toucher au code : ecrire du Markdown doit suffire a rebuild automatiquement.
- Les pages autres que celles generees depuis Markdown, comme la page d accueil, doivent supporter le japonais et l anglais.
- Le nom de route "articles" n est peut-etre pas ideal, car il contiendra des papiers et des billets techniques externes.
```
</details>

<details>
<summary>Resultat des exigences</summary>

```plaintext
# Vue d ensemble

Definition des exigences pour un site personnel. TypeScript + Next.js pour une UI/UX moderne, hebergement statique sur GitHub Pages, et cout de maintenance reduit grace aux contenus Markdown.

## 1. Objectif / Livrables

* Objectif : regrouper presentation, liens externes, publications/articles et blog dans un site statique facile a maintenir.
* Livrables : repository, design et composants, CI/CD, modeles de contenu et documentation.

## 2. Architecture de l information / Routing

* `/` : presentation personnelle, changement JP/EN et acces aux sections principales
* `/links` : liens externes comme SNS, GitHub et supports de presentation
* `/publications` : papiers, articles techniques externes et autres travaux publics
* `/blogs` : liste et pages detail des articles Markdown

`/articls` est une faute de frappe. Pour le nom, `/publications` est recommande parce qu il couvre les papiers, contributions et articles externes.

## 3. Exigences non fonctionnelles

* affichage rapide avec Core Web Vitals
* accessibilite visant WCAG 2.1 AA
* SEO avec OGP, Twitter Card, donnees structurees, sitemap et robots
* responsive design
* operation simple via mises a jour Markdown

## 4. Stack / Politique d implementation

* TypeScript et Next.js App Router
* export statique pour GitHub Pages
* Tailwind CSS et composants UI maison
* parsing Markdown avec gray-matter, remark/rehype et zod
* recherche et filtres cote client si necessaire

## 5. i18n

* L UI statique comme la page d accueil doit supporter japonais et anglais.
* Utiliser un prefixe d URL ou un mecanisme equivalent pour conserver la langue.
* La langue par defaut est le japonais.

## 6. Contenu

Le frontmatter de blog inclut `title`, `date`, `updated`, `tags`, `summary`, `thumbnail` et `draft`.

Le frontmatter de publication inclut `title`, `type`, `publishedAt`, `venue`, `publisher`, `authors`, `links`, `tags` et `abstract`.

## 7. Build / Deploiement

Utiliser GitHub Actions pour builder lors d un push sur `main` et deployer `out/` sur GitHub Pages.

## 8. Criteres d acceptation

* Ajouter un article Markdown puis merger dans `main` declenche build et deploiement automatiques.
* `/` permet le changement ja/en, et `/blogs` publie les articles uniquement depuis Markdown.
* Les filtres et la recherche de `/publications` fonctionnent cote client.
* Les objectifs LCP/CLS/INP sont verifies en test lab.
* Les controles d accessibilite de base passent.
```
</details>

### Demande a Codex

Apres avoir installe Codex, j ai utilise l article ci-dessous comme reference de configuration, puis je lui ai donne le cahier des charges.

https://zenn.dev/dely_jp/articles/codex-cli-matome#%E3%81%AA%E3%81%9C%E4%BB%8A%E3%80%81codex-cli%E3%81%8C%E8%A9%B1%E9%A1%8C%E3%81%AA%E3%81%AE%E3%81%8B%EF%BC%9F

### Retours sur le resultat genere

J ai lance le site, indique brievement les points qui me genaient, puis repete les ameliorations.

## Impressions

Sans presque rien implementer moi-meme, j ai pu construire rapidement une page d un niveau pratique. Dans ChatGPT Plus, je gardais Reasoning Effort sur high, mais le developpement est reste confortable sans limite de taux bloquante.

J ai senti qu un coding agent peut etre tres efficace si l on a assez d experience pratique pour evaluer le resultat. Collaborer avec l IA a rendu le processus beaucoup moins stressant.
