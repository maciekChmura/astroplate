# AGENTS.md

## Project Overview

- This repository is a locally customized fork of the Astroplate starter for the QuickArchViz knowledge hub.
- Treat it as an Astro 6 + Tailwind 4 + TypeScript project with optional React islands.
- The primary workflow is defined in `package.json` and supported by custom generator scripts in `scripts/`.
- Preserve the custom generator pipeline unless a task explicitly asks to redesign it.

## Working Conventions

- Prefer small, targeted edits that preserve the current project structure.
- Use `npm` as the default package manager.
- Do not replace the current script chain with a simplified Astro-only workflow without explicit approval.
- Before changing build or content behavior, inspect the relevant scripts in `scripts/` to understand generated output and side effects.
- Keep generated output, `dist/`, `.astro/`, and search/LLM build artifacts out of manual content edits unless the task explicitly asks for generated files.

## Default Commands

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
- If no site is provided, the default site id is `quickarchviz-en`.

## QuickArchViz Sites

- Current first-class site ids:
  - English: `quickarchviz-en`
  - Polish: `quickarchviz-pl`
- English content lives under `sites/quickarchviz-en/content/.../english/`.
- Polish content lives under `sites/quickarchviz-pl/content/.../polish/`.
- Keep language separation strict. Do not add Polish content to `quickarchviz-en`, and do not add English content to `quickarchviz-pl`.
- Prefer shared QuickArchViz images in `public/sites/quickarchviz/images/` and reference them with absolute paths such as `/sites/quickarchviz/images/cover.webp`.
- Do not add QuickArchViz media under EN or PL public site roots; both language sites share the canonical `public/sites/quickarchviz/images/` root.
- When editing shared components, layouts, CSS, i18n, or generator behavior for one language site, preserve the current UI of the sibling site unless the task explicitly asks for a cross-site change.

## Blog Posts

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
- Use `draft: true` while writing unpublished posts. Use `draft: false` only when the post should be published.
- Use H2 and H3 Markdown headings for article structure because the post layout builds the table of contents from headings.

## Prompts

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

## Pages, Authors, Homepage, and Sections

- Modify static pages in `sites/<site-id>/content/pages/<language>/`.
- Modify author profiles in `sites/<site-id>/content/authors/<language>/`.
- Modify homepage content in `sites/<site-id>/content/homepage/<language>/-index.md`.
- Modify reusable sections in `sites/<site-id>/content/sections/<language>/`.
- Preserve the existing frontmatter and nested YAML shape for these files.
- Use ASCII where the existing file is ASCII. Preserve Polish diacritics in Polish content when they are needed for reader-facing copy.

## Content Commands

- Check English QuickArchViz content with `npm run check -- --site quickarchviz-en`.
- Check Polish QuickArchViz content with `npm run check -- --site quickarchviz-pl`.
- Start English local dev with `npm run dev -- --site quickarchviz-en`.
- Start Polish local dev with `npm run dev -- --site quickarchviz-pl`.
- Production builds require a real HTTPS `PUBLIC_SITE_URL` or `SITE_URL`, for example:
  - `PUBLIC_SITE_URL=https://quickarchviz.com npm run build -- --site quickarchviz-en`
  - `PUBLIC_SITE_URL=https://quickarchviz.com PUBLIC_SITE_MOUNT_PATH=/pl npm run build -- --site quickarchviz-pl`

## Deployment Notes

- Preview the English knowledge-hub proxy with `npm run preview:knowledge-hub-en-proxy`.
- Preview the Polish knowledge-hub proxy with `npm run preview:knowledge-hub-pl-proxy`.
- Deploy the English knowledge-hub proxy with `npm run deploy:knowledge-hub-en-proxy`.
- Deploy the Polish knowledge-hub proxy with `npm run deploy:knowledge-hub-pl-proxy`.
- `npm run deploy:knowledge-hubs` deploys the production branch merge plus both QuickArchViz knowledge-hub proxies.

## Known Inconsistencies

- Some infrastructure names may still contain historical `astroplate` labels. Treat them as external Cloudflare resource identifiers unless a task explicitly asks to rename infrastructure.
- The shared alternatives schema uses QuickArchViz-named fields such as `quickarchviz_summary` and `best_for_quickarchviz`; preserve those fields for compatibility.
