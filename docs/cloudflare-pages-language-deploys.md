# Cloudflare Pages language deploys

This repo supports one static Cloudflare Pages deploy per language by selecting
the site with `SITE_ID`.

Astro builds and serves the selected language app at `/` on the Pages origin.
The public mount paths are handled by Cloudflare Workers.

## Production deploy flow

Deploy both language hubs from Git, then refresh both proxy Workers:

```sh
npm run deploy:knowledge-hubs
```

This runs:

```sh
npm run deploy:prod
npm run deploy:knowledge-hub-en-proxy
npm run deploy:knowledge-hub-pl-proxy
```

`deploy:prod` merges `main` into `prod` and pushes `prod`. Both Cloudflare
Pages projects should use `prod` as their production branch, so the Pages build
starts from Git. Do not add a root `wrangler.jsonc` for the Pages projects:
both language projects share this repository, and each project needs its own
dashboard environment variables. The legacy Workers Static Assets config lives
in `wrangler.cf-workers.jsonc`.

## English Pages project

Production project:

- Project name: `quickarchviz-knowledge-hub-en`
- Production branch: `prod`
- Build command: `npm run build`
- Build output directory: `dist`
- Environment variables:
  - `SITE_ID=quickarchviz-en`
  - `PUBLIC_SITE_URL=https://quickarchviz.com`

`PUBLIC_SITE_URL` must be the public origin without a path. Leave
`PUBLIC_SITE_MOUNT_PATH` unset or empty for the English content deploy. The
Worker owns the public route families such as `/blog`, `/prompts`,
`/use-cases`, and `/knowledge-hub`.

## Polish Pages project

Production project:

- Project name: `quickarchviz-knowledge-hub-pl`
- Production branch: `prod`
- Build command: `npm run build`
- Build output directory: `dist`
- Environment variables:
  - `SITE_ID=quickarchviz-pl`
  - `PUBLIC_SITE_URL=https://quickarchviz.com`
  - `PUBLIC_SITE_MOUNT_PATH=/pl`

`PUBLIC_SITE_URL` must be the public origin without a path. Put the public mount
path in `PUBLIC_SITE_MOUNT_PATH`.

## Local checks

Run local development from the root-mounted Astro app:

```sh
SITE_ID=quickarchviz-en npm run dev
SITE_ID=quickarchviz-pl npm run dev
```

Then open `http://localhost:4321/`. The production mount paths are owned by the
Workers.

```sh
npm run check -- --site quickarchviz-en
SITE_ID=quickarchviz-en PUBLIC_SITE_URL=https://quickarchviz.com npm run build

npm run check -- --site quickarchviz-pl
SITE_ID=quickarchviz-pl PUBLIC_SITE_URL=https://quickarchviz.com PUBLIC_SITE_MOUNT_PATH=/pl npm run build
```

## Worker mount contract

The English Worker is named `quickarchviz-knowledge-hub-en-proxy` and owns the
English content route families:

```txt
quickarchviz.com/blog
quickarchviz.com/blog/*
quickarchviz.com/prompts
quickarchviz.com/prompts/*
quickarchviz.com/use-cases
quickarchviz.com/use-cases/*
quickarchviz.com/authors
quickarchviz.com/authors/*
quickarchviz.com/categories
quickarchviz.com/categories/*
quickarchviz.com/tags
quickarchviz.com/tags/*
quickarchviz.com/privacy-policy
quickarchviz.com/knowledge-hub
quickarchviz.com/knowledge-hub/*
quickarchviz.com/knowledge-hub-assets/*
quickarchviz.com/sitemap*
quickarchviz.com/llms.txt
quickarchviz.com/llms-full.txt
```

Clean URLs fetch the matching path from
`https://quickarchviz-knowledge-hub-en.pages.dev`. Old mounted section URLs
under `/knowledge-hub/blog`, `/knowledge-hub/prompts`, and
`/knowledge-hub/use-cases` return 301 redirects to the clean public URLs. Static
hub assets are exposed under `/knowledge-hub-assets`.

Deploy or preview the Worker proxy with:

```sh
npm run deploy:knowledge-hub-en-proxy
npm run preview:knowledge-hub-en-proxy
```

The Polish Worker is named `quickarchviz-knowledge-hub-pl-proxy` and owns the
Polish content route families:

```txt
quickarchviz.com/pl/knowledge-hub
quickarchviz.com/pl/knowledge-hub/*
quickarchviz.com/pl/knowledge-hub-assets/*
quickarchviz.com/pl/blog
quickarchviz.com/pl/blog/*
quickarchviz.com/pl/prompts
quickarchviz.com/pl/prompts/*
quickarchviz.com/pl/use-cases
quickarchviz.com/pl/use-cases/*
quickarchviz.com/pl/authors
quickarchviz.com/pl/authors/*
quickarchviz.com/pl/categories
quickarchviz.com/pl/categories/*
quickarchviz.com/pl/tags
quickarchviz.com/pl/tags/*
quickarchviz.com/pl/privacy-policy
quickarchviz.com/pl/sitemap*
quickarchviz.com/pl/llms.txt
quickarchviz.com/pl/llms-full.txt
```

Clean Polish URLs strip `/pl` before fetching `https://astroplate-wq8.pages.dev`.
Old mounted section URLs under `/pl/knowledge-hub/blog`,
`/pl/knowledge-hub/prompts`, and `/pl/knowledge-hub/use-cases` return 301
redirects to `/pl/blog`, `/pl/prompts`, and `/pl/use-cases`. Static hub assets
are exposed under `/pl/knowledge-hub-assets`.

The root `https://quickarchviz.com/robots.txt` is owned by the Laravel product
site, not these Astro content Workers. Laravel should publish every sitemap it
wants search engines to discover, including the product sitemap and the hub
sitemaps at `https://quickarchviz.com/sitemap-index.xml` and
`https://quickarchviz.com/pl/sitemap-index.xml`.

Deploy or preview the Worker proxy with:

```sh
npm run deploy:knowledge-hub-pl-proxy
npm run preview:knowledge-hub-pl-proxy
```
