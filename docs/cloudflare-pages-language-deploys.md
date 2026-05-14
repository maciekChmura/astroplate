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
starts from Git. The root `wrangler.jsonc` is intentionally Pages-safe; the
legacy Workers Static Assets config lives in `wrangler.cf-workers.jsonc`.

## English Pages project

Production project:

- Project name: `quickarchviz-knowledge-hub-en`
- Production branch: `prod`
- Build command: `npm run build`
- Build output directory: `dist`
- Environment variables:
  - `SITE_ID=quickarchviz-en`
  - `PUBLIC_SITE_URL=https://quickarchviz.com`
  - `PUBLIC_SITE_MOUNT_PATH=/knowledge-hub`

`PUBLIC_SITE_URL` must be the public origin without a path. Put the public mount
path in `PUBLIC_SITE_MOUNT_PATH`.

## Polish Pages project

Production project:

- Project name: `quickarchviz-knowledge-hub-pl`
- Production branch: `prod`
- Build command: `npm run build`
- Build output directory: `dist`
- Environment variables:
  - `SITE_ID=quickarchviz-pl`
  - `PUBLIC_SITE_URL=https://quickarchviz.com`
  - `PUBLIC_SITE_MOUNT_PATH=/pl/knowledge-hub`

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
SITE_ID=quickarchviz-en PUBLIC_SITE_URL=https://quickarchviz.com PUBLIC_SITE_MOUNT_PATH=/knowledge-hub npm run build

npm run check -- --site quickarchviz-pl
SITE_ID=quickarchviz-pl PUBLIC_SITE_URL=https://quickarchviz.com PUBLIC_SITE_MOUNT_PATH=/pl/knowledge-hub npm run build
```

## Worker mount contract

The English Worker is named `quickarchviz-knowledge-hub-en-proxy` and routes:

```txt
quickarchviz.com/knowledge-hub*
```

It strips `/knowledge-hub` before fetching
`https://quickarchviz-knowledge-hub-en.pages.dev`, then rewrites text responses
so root-relative links and assets stay under `/knowledge-hub`.

Deploy or preview the Worker proxy with:

```sh
npm run deploy:knowledge-hub-en-proxy
npm run preview:knowledge-hub-en-proxy
```

The Polish Worker is named `quickarchviz-knowledge-hub-pl-proxy` and routes:

```txt
quickarchviz.com/pl/knowledge-hub
quickarchviz.com/pl/knowledge-hub/*
```

It strips `/pl/knowledge-hub` before fetching
`https://astroplate-wq8.pages.dev`, then rewrites text responses
so root-relative links and assets stay under `/pl/knowledge-hub`.

Unlike the English Worker, the Polish Worker does not redirect root-level
`/blog`, `/prompts`, `/tags`, or sitemap paths. This avoids conflicts with the
English mount and keeps the Polish hub scoped to `/pl/knowledge-hub`.

Deploy or preview the Worker proxy with:

```sh
npm run deploy:knowledge-hub-pl-proxy
npm run preview:knowledge-hub-pl-proxy
```
