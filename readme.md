# QuickArchViz Knowledge Hub

Astro 6 + Tailwind 4 + TypeScript site for the QuickArchViz English and Polish knowledge hubs.

This repo keeps the custom multi-site generator pipeline, but the active first-class sites are now only:

- `quickarchviz-en`
- `quickarchviz-pl`

The default site id is `quickarchviz-en`.

## Commands

```bash
npm install
npm run dev
npm run check
npm run build
```

Run a specific site:

```bash
npm run dev -- --site quickarchviz-en
npm run dev -- --site quickarchviz-pl

npm run check -- --site quickarchviz-en
npm run check -- --site quickarchviz-pl
```

Production builds require a real HTTPS site URL:

```bash
PUBLIC_SITE_URL=https://quickarchviz.com npm run build -- --site quickarchviz-en
PUBLIC_SITE_URL=https://quickarchviz.com PUBLIC_SITE_MOUNT_PATH=/pl npm run build -- --site quickarchviz-pl
```

## Content Layout

English content:

```text
sites/quickarchviz-en/content/
```

Polish content:

```text
sites/quickarchviz-pl/content/
```

Shared QuickArchViz images:

```text
public/sites/quickarchviz/images/
```

Reference shared images with absolute paths such as:

```text
/sites/quickarchviz/images/cover.webp
```

## Content Types

Blog posts:

```text
sites/quickarchviz-en/content/blog/english/
sites/quickarchviz-pl/content/blog/polish/
```

Prompts:

```text
sites/quickarchviz-en/content/prompts/english/
sites/quickarchviz-pl/content/prompts/polish/
```

Static pages:

```text
sites/quickarchviz-en/content/pages/english/
sites/quickarchviz-pl/content/pages/polish/
```

Homepage:

```text
sites/quickarchviz-en/content/homepage/english/-index.md
sites/quickarchviz-pl/content/homepage/polish/-index.md
```

Reusable sections:

```text
sites/quickarchviz-en/content/sections/english/
sites/quickarchviz-pl/content/sections/polish/
```

## Generator Workflow

- `npm run dev` runs `themeGenerator.js` in watch mode and runs `jsonGenerator.js` before `astro dev`.
- `npm run build` runs `themeGenerator.js`, then `jsonGenerator.js`, then `astro build`, then `llmsGenerator.js`.
- `npm run generate-json` and `npm run generate-llms` are site-aware through `scripts/runWithSite.js`.

## Cloudflare

Workers preview/deploy:

```bash
npm run preview:cf-workers -- --site quickarchviz-en
npm run deploy:cf-workers -- --site quickarchviz-en
```

Knowledge-hub proxy preview/deploy:

```bash
npm run preview:knowledge-hub-en-proxy
npm run preview:knowledge-hub-pl-proxy
npm run deploy:knowledge-hub-en-proxy
npm run deploy:knowledge-hub-pl-proxy
```

Deploy both knowledge-hub proxies:

```bash
npm run deploy:knowledge-hubs
```

Some infrastructure names may still contain historical labels. Treat those as external Cloudflare resource identifiers unless a task explicitly asks to rename infrastructure.
