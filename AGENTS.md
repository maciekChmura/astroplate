# AGENTS.md

## Project Overview

- This repository is a locally customized fork of the Astroplate starter.
- Treat it as an Astro 6 + Tailwind 4 + TypeScript project with optional React islands.
- The primary workflow is defined in `package.json` and supported by custom generator scripts in `scripts/`.

## Working Conventions

- Prefer small, targeted edits that preserve the current project structure.
- Preserve the custom generator pipeline unless a task explicitly asks to redesign it.
- Do not replace the current script chain with a simplified Astro-only workflow without explicit approval.
- Before changing build or content behavior, inspect the relevant scripts in `scripts/` to understand generated output and side effects.

## Default Commands

- Use `npm` as the default package manager for this repository.
- Install dependencies with `npm install`.
- Start local development with `npm run dev`.
- Run static/project checks with `npm run check`.
- Build the site with `npm run build`.
- Preview Cloudflare Workers output with `npm run preview:cf-workers`.
- Deploy to Cloudflare Workers with `npm run deploy:cf-workers`.
- Prefer `npx` for one-off tooling when needed.

## Workflow Notes

- `npm run dev` runs `themeGenerator.js` in watch mode and runs `jsonGenerator.js` before starting `astro dev`.
- `npm run build` runs `themeGenerator.js`, then `jsonGenerator.js`, then `astro build`, then `llmsGenerator.js`.
- Changes to theme, JSON generation, or build output may affect downstream generated artifacts. Review the corresponding script before editing related behavior.

## Multi-Site Content Guide

- Content lives under `sites/<site-id>/content/`, not under `src/content/`.
- QuickArchViz uses separate site ids for each language:
  - English: `quickarchviz-en`
  - Polish: `quickarchviz-pl`
- QuickArchViz content roots:
  - English content: `sites/quickarchviz-en/content/.../english/`
  - Polish content: `sites/quickarchviz-pl/content/.../polish/`
- Keep language separation strict. Do not add Polish content to `quickarchviz-en`, and do not add English content to `quickarchviz-pl`.
- Before adding or modifying content, inspect the relevant existing file or `-template.md` in the same collection and language.
- Prefer shared QuickArchViz images in `public/sites/quickarchviz/images/` and reference them with absolute paths such as `/sites/quickarchviz/images/cover.png`.
- Use language-specific asset folders, such as `public/sites/quickarchviz-en/avatars/` or `public/sites/quickarchviz-pl/avatars/`, only when the existing content type already uses them.
- Keep generated output, `dist/`, `.astro/`, and search/LLM build artifacts out of manual content edits unless the task explicitly asks for generated files.

### Blog Posts

- Add English blog posts to `sites/quickarchviz-en/content/blog/english/`.
- Add Polish blog posts to `sites/quickarchviz-pl/content/blog/polish/`.
- Start from the nearest blog `-template.md` and rename the file to the intended slug.
- Blog URLs come from filenames:
  - `sites/quickarchviz-en/content/blog/english/my-post.md` becomes `/blog/my-post`.
  - `sites/quickarchviz-pl/content/blog/polish/moj-post.md` becomes `/blog/moj-post` in the Polish deploy.
- Blog frontmatter must satisfy `src/content.config.ts`:

```yaml
title:
description:
date:
image:
categories:
tags:
draft:
```

- `author` is schema-supported and appears in some templates, but the default author resolves from site config. Omit `author` unless intentionally overriding it.
- Use `draft: true` while writing unpublished posts. Draft posts stay out of routes, search JSON, sitemap output, and generated content lists.
- Use `draft: false` only when the post should be published.
- Use H2 and H3 Markdown headings for article structure because the post layout builds the table of contents from headings.

### Prompts

- Add English prompts to `sites/quickarchviz-en/content/prompts/english/`.
- Add Polish prompts to `sites/quickarchviz-pl/content/prompts/polish/`.
- Prompt URLs come from filenames under `/prompts/<slug>`.
- Prompt frontmatter must include `title`, `description`, `categories`, `tags`, `prompt`, and `draft`.
- `prompt` should be a YAML block scalar containing the reusable prompt text:

```yaml
prompt: |
  Paste the exact reusable AI prompt here.
```

- Optional prompt fields include `image`, `author`, `popular`, `what_it_does`, and `best_input`. Preserve the style used by the local template.

### Pages, Authors, Homepage, and Sections

- Modify static pages in `sites/<site-id>/content/pages/<language>/`.
- Modify author profiles in `sites/<site-id>/content/authors/<language>/`.
- Modify homepage content in `sites/<site-id>/content/homepage/<language>/-index.md`.
- Modify reusable sections in `sites/<site-id>/content/sections/<language>/`.
- Preserve the existing frontmatter and nested YAML shape for these files. Homepage and section files often contain structured objects and arrays used directly by layouts.
- Use ASCII where the existing file is ASCII. Preserve Polish diacritics in Polish content when they are already present or needed for reader-facing copy.

### Content Commands

- Check English QuickArchViz content with `npm run check -- --site quickarchviz-en`.
- Check Polish QuickArchViz content with `npm run check -- --site quickarchviz-pl`.
- Start English local dev with `npm run dev -- --site quickarchviz-en`.
- Start Polish local dev with `npm run dev -- --site quickarchviz-pl`.
- Production builds require a real HTTPS `PUBLIC_SITE_URL` or `SITE_URL`, for example `PUBLIC_SITE_URL=https://quickarchviz.com npm run build -- --site quickarchviz-en`.

## Package Manager Policy

- Use `npm` for all install and run instructions in this repo.
- Treat `yarn` references as historical leftovers unless a task explicitly asks to preserve them.
- When touching package-manager-related files, normalize toward npm unless there is a concrete reason not to.
- Avoid unnecessary lockfile churn unless the task is explicitly about dependencies or package-manager migration.

## Known Inconsistencies

- `package.json` still declares `"packageManager": "yarn@1.22.22"`.
- The `remove-darkmode` script still calls `yarn format`.
- `readme.md`, `netlify.toml`, and some generated/help text still mention `yarn`.
- Both `package-lock.json` and `yarn.lock` are present in the repo today.

## Preferred Cleanup Direction

- If a task touches docs, scripts, or deployment config, check for lingering `yarn` assumptions and update them to npm syntax where appropriate.
- Prefer incremental cleanup over a broad package-manager rewrite unless the task specifically calls for a full migration pass.
- Keep the generator and deployment behavior intact while normalizing package-manager usage.
