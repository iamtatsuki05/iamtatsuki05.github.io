---
title: Construire ce site avec un LLM
summary: Retour rapide sur la création de ce site en vibe coding.
headerAlt: Illustration du vibe coding
---

## Introduction

Je voulais depuis quelque temps créer une page de présentation personnelle, mais je n’avais jamais le temps de commencer. Récemment, le vibe coding, où l’on pilote par le dialogue des outils comme Claude Code ou Codex, est devenu un sujet courant. Comme j’avais enfin un peu de temps, j’ai construit ce site de cette manière.

## Processus

Voici ce que j’ai fait :

- définir les exigences
- les confier à Codex
- donner plusieurs retours sur le code généré
- écrire moi-même les textes de présentation, puis demander à l’IA de les relire

### Définition des exigences

Comme j’utilise ChatGPT Plus, je suis parti de là. J’ai donné à GPT des idées de routes et de stack technique sous forme de liste, puis je lui ai demandé de les transformer en cahier des charges.

<details>
<summary>Demande</summary>

```plaintext
Je veux créer ma propre page web.
Aide-moi à définir les exigences en échangeant avec moi.
Je n’ai pas besoin de l’implémentation concrète pour le moment : prépare un document de définition des exigences que je pourrai confier à Codex.

## Idée de routing
- Structure
    - /
        - présentation personnelle et explication des routes
        - /links
            - URL externes
        - /articls
            - articles, papiers, etc.
        - /blogs
            - articles rendus depuis Markdown

## Exigences d’implémentation
- Le langage est TypeScript, avec Next.js, pour une UI/UX moderne basée sur React.
- Utiliser GitHub Pages pour builder automatiquement un site statique et réduire les coûts d’exploitation.
- Pour les mises à jour du blog, toucher au code à chaque fois est pénible : écrire du Markdown doit en principe suffire à déclencher un build automatique.
- Les pages autres que celles générées depuis Markdown, comme la page d’accueil, doivent supporter le japonais et l’anglais.
- Le nom de route « articles » n’est peut-être pas idéal, car j’y écrirai sur les papiers que j’ai rédigés et sur des billets techniques publiés sur des sites externes.

```
</details>

<details>
<summary>Résultat de la définition des exigences</summary>

```plaintext
# Vue d’ensemble

Définition des exigences pour un site web personnel. UI/UX moderne avec TypeScript + Next.js. Build et hébergement automatiques sur GitHub Pages, le site étant régénéré à chaque mise à jour du Markdown.

---

## 1. Objectif / Livrables

* **Objectif** : construire un site statique qui regroupe présentation personnelle, liens externes, présentation d’articles et de papiers, et gestion du blog, en minimisant le coût de mise à jour.
* **Livrables** : un dépôt conforme à ces exigences, le design et les composants, la CI/CD (GitHub Actions), des modèles de contenu et l’ensemble de la documentation.

---

## 2. Architecture de l’information / Routing

### 2.1 Structure des routes (proposition)

* `/`

  * présentation personnelle (bascule JP/EN)
  * accès aux sections principales
* `/links`

  * liste des URL externes (réseaux sociaux, GitHub, supports de présentation, etc.)
* `/publications` (nom à revoir, détails en §2.2)

  * regroupement des métadonnées des papiers rédigés, des billets techniques publiés sur des sites externes, etc. (liste de cartes + page détail)
* `/blogs`

  * liste et pages détail des articles de blog générés depuis le Markdown

> ※ `/articls` → faute de frappe corrigée. `/articles` étant trop générique, les noms suivants sont envisagés.

### 2.2 Alternatives au nom « articles »

* **/publications** : couvre largement les « travaux publiés » comme les papiers évalués par les pairs, les contributions ou les billets techniques externes (recommandé)
* **/writings** : les écrits en général (un peu vague)
* **/notes** : notes et réflexions (pour des contenus plus légers)
* **/library** : formulation de type collection (un peu abstrait)

**Critère de choix** : si le périmètre est « mes propres papiers + contributions à des sites externes + articles explicatifs », retenir `/publications` comme premier choix.

### 2.3 Navigation globale

* Home | Links | Publications | Blogs
* Pied de page : copyright, licence, plan du site, RSS (pour le blog)

---

## 3. Exigences non fonctionnelles

* affichage rapide (objectifs Core Web Vitals : LCP < 2.5s, CLS < 0.1, INP < 200ms)
* accessibilité (objectif : conformité WCAG 2.1 AA)
* SEO (OGP/Twitter Card/données structurées, sitemap.xml/robots.txt)
* responsive (mobile first)
* facilité d’exploitation (tout se règle par mise à jour du Markdown, déploiement automatique en CI)

---

## 4. Stack / Politique d’implémentation

* **Langage/framework** : TypeScript, Next.js (App Router)

  * `output: 'export'` dans `next.config.js` (export statique)
* **Styles** : Tailwind CSS + composants UI maison (thèmes clair/sombre)
* **Traitement du Markdown** : `.md` (base remark/rehype, extensible à MDX si besoin)
* **Coloration syntaxique** : Shiki ou rehype-prism-plus
* **Optimisation des images** : images générées statiquement (attention au comportement de `next/image` à l’export)
* **Icônes** : lucide-react recommandé
* **Gestion d’état** : minimale (contenu statique, tout au plus recherche/filtres)

---

## 5. Multilingue (i18n)

* **Périmètre** : hors pages générées depuis le Markdown, l’UI statique comme la page d’accueil doit pouvoir basculer entre **japonais/anglais**.
* **Méthode** : `next-intl` ou `next-i18next`. Dictionnaires gérés dans `/locales/ja|en/*.json`.
* **UI de changement de langue** : un toggle (ja/en) dans l’en-tête. La langue est conservée par cookie ou par préfixe d’URL (/ja, /en).
* **Langue par défaut** : japonais (ja).

---

## 6. Conception du contenu

### 6.1 Arborescence des répertoires (exemple)

/content
  /blogs
    yyyy-mm-dd-slug.md
  /publications
    item-*.md
/data
  links.yaml
/public
  /images

### 6.2 Définition du frontmatter

* **Blog (/blogs)**

  * `title` (string, required)
  * `date` (ISO string, required)
  * `updated` (ISO string, optional)
  * `tags` (string\[])
  * `summary` (string)
  * `thumbnail` (path)
  * `draft` (boolean)
* **Travaux publiés (/publications)**

  * `title` (string, required)
  * `type` (enum: paper | article | talk | slide | media)
  * `publishedAt` (ISO string)
  * `venue` (string) / `publisher` (string)
  * `authors` (string\[])
  * `links` ({ kind: 'pdf'|'doi'|'post'|'slides'|'video'|'code', url: string }\[])
  * `tags` (string\[])
  * `abstract` (string, optional)

### 6.3 Données de la page Links

* Définir `{ title, url, desc, icon? }[]` dans `/data/links.yaml`. Classement par catégorie possible.

### 6.4 UI liste/détail

* mise en page de carte commune, tags/recherche (côté client)
* pagination (blog)
* les Draft sont exclus du build (aperçu possible en CI uniquement sur les PR)

---

## 7. Build / Déploiement (GitHub Pages)

* **Dépôt** : `<user>/<user>.github.io`, ou un dépôt quelconque + une branche `gh-pages`
* **CI/CD** : workflow GitHub Actions

  1. exécution sur `push` to `main`
  2. `bun install` / `bun build` (`next build && next export`)
  3. déploiement de `out/` sur Pages
* **Domaine personnalisé** (optionnel) : configuration du `CNAME`
* **Attention au routing** : générer correctement `404.html`/`index.html` à l’export statique

---

## 8. Expérience de développement (DX)

* Gestionnaire de paquets : `bun`
* Lint/Format : ESLint + Prettier + stylelint (selon les besoins)
* Sûreté de typage : mode strict, validation du frontmatter avec `zod`
* Tests : snapshots de base (Vitest + Testing Library)
* Convention de commit : Conventional Commits + Changeset (optionnel)

---

## 9. Exigences détaillées par page

### 9.1 `/` (accueil, concerné par l’i18n)

* présentation personnelle (fonction, parcours, photo)
* mise en avant des derniers articles de blog et travaux publiés
* changement de langue, changement de thème

### 9.2 `/links`

* cartes de liens par catégorie (avec icône et description)

### 9.3 `/publications` (équivalent de l’ancien `articles`)

* liste : filtres (type, year, tag) et recherche
* détail : métadonnées + liens externes (DOI/PDF, etc.)

### 9.4 `/blogs`

* liste : ordre antéchronologique de publication, tags/recherche, pagination
* détail : sommaire (généré automatiquement), notes de bas de page, blocs de code, génération d’OGP

---

## 10. Sécurité/confidentialité

* les contenus intégrés externes ne sont chargés qu’après consentement (YouTube, etc.)
* en-tête CSP (via meta dans la mesure du possible)

---

## 11. Critères d’acceptation (extraits)

* ajouter un .md d’article sur GitHub → le merge dans `main` déclenche build et déploiement automatiques, et la publication est en ligne en quelques minutes
* `/` permet la bascule ja/en, et les articles de `/blogs` sont publiables uniquement en Markdown
* les filtres et la recherche de `/publications` fonctionnent côté client
* les objectifs LCP/CLS/INP sont atteints en test lab
* les contrôles d’accessibilité de base (navigation clavier, contraste, libellés) passent

---

## 12. Notes d’implémentation (précisions pour Codex)

* **Traitement du Markdown** : parsing avec `gray-matter` + `remark/rehype`, et `zod` pour la sûreté de typage
* **OGP** : images dynamiques figées en statique via `/blogs/[slug]/opengraph-image` (Satori + html-to-image)
* **Search** : recherche plein texte simple côté client avec `Fuse.js`
* **Thème** : mode sombre avec `next-themes`

---

## 13. Extensions futures (optionnel)

* génération automatique des flux (RSS/Atom)
* mise à jour automatique des flux et du plan du site
* commentaires (service externe : Giscus, etc.)
* formulaire de contact (via un formulaire externe)

---

## 14. Points en suspens / questions ouvertes

* décision finale sur le nom officiel de `/publications`
* parti pris visuel de la page d’accueil (minimal, audacieux, très illustré, etc.)
* politique de génération des images de couverture (manuelle/automatique)
* formulation de la page d’accueil en anglais (comment traiter les écarts entre japonais et anglais)

---

## Annexe : exemple de `links.yaml`

```yaml
- title: GitHub
  url: https://github.com/yourname
  desc: Code source et projets
  icon: github
- title: X (Twitter)
  url: https://x.com/yourname
  desc: Posts quotidiens
  icon: x
```
</details>

### Demande à Codex

J’ai installé Codex et je l’ai configuré en m’appuyant sur l’article ci-dessous. Je lui ai ensuite donné le cahier des charges ci-dessus et j’ai avancé le développement.

https://zenn.dev/dely_jp/articles/codex-cli-matome#%E3%81%AA%E3%81%9C%E4%BB%8A%E3%80%81codex-cli%E3%81%8C%E8%A9%B1%E9%A1%8C%E3%81%AA%E3%81%AE%E3%81%8B%EF%BC%9F

### Retours sur le résultat généré

Je lançais le site, j’indiquais brièvement les points qui me gênaient et je laissais Codex corriger. J’ai répété l’opération plusieurs fois.

## Impressions

Sans presque rien implémenter moi-même, j’ai obtenu en peu de temps une page d’un niveau pratique. Dans ChatGPT Plus, je gardais Reasoning Effort sur high et je n’ai jamais atteint la limite de débit.

Développer avec un coding agent fonctionne bien dès qu’on a un minimum d’expérience pratique. Et le stress reste limité.
