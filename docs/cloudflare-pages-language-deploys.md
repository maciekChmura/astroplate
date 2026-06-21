# Cloudflare Pages Knowledge Hub Deploys

This repo supports multiple brand knowledge hubs from one Astro codebase. Each
hub is selected with `SITE_ID`, built by its own Cloudflare Pages project, and
exposed on the public brand domain through a small Cloudflare Worker proxy.

Astro builds and serves the selected site at `/` on the Pages origin. Public
mount paths, clean hub routes, and asset URL rewriting are owned by the proxy
Workers.

## Current deploy targets

| Site ID | Purpose | Pages project | Public origin | Public prefix |
| --- | --- | --- | --- | --- |
| `astroplate` | Local/demo starter site | none documented | local/demo only | none |
| `quickarchviz-en` | QuickArchViz English knowledge hub | `quickarchviz-knowledge-hub-en` | `https://quickarchviz.com` | none |
| `quickarchviz-pl` | QuickArchViz Polish knowledge hub | `quickarchviz-knowledge-hub-pl` | `https://quickarchviz.com` | `/pl` |
| `aibrandscan` | AIBrandScan English knowledge hub | `aibrandscan-knowledge-hub` | `https://aibrandscan.com` | none |

The AIBrandScan project and route names assume the production domain is
`aibrandscan.com` and the Pages hostname is
`aibrandscan-knowledge-hub.pages.dev`. Update the Worker wrapper and Wrangler
config if Cloudflare uses different names.

## Production deploy flow

Deploy all Git-backed Pages projects from `prod`, then refresh the proxy
Workers:

```sh
npm run deploy:knowledge-hubs
```

This runs:

```sh
npm run deploy:prod
npm run deploy:knowledge-hub-en-proxy
npm run deploy:knowledge-hub-pl-proxy
npm run deploy:knowledge-hub-aibrandscan-proxy
```

`deploy:prod` merges `main` into `prod` and pushes `prod`. The Cloudflare Pages
projects should use `prod` as their production branch, so the Pages builds start
from Git. Do not add a root `wrangler.jsonc` for the Pages projects: each Pages
project needs its own dashboard environment variables. The legacy Workers Static
Assets config lives in `wrangler.cf-workers.jsonc`.

## Pages project settings

All knowledge hub Pages projects use:

- Production branch: `prod`
- Build command: `npm run build`
- Build output directory: `dist`

QuickArchViz English:

```txt
SITE_ID=quickarchviz-en
PUBLIC_SITE_URL=https://quickarchviz.com
```

QuickArchViz Polish:

```txt
SITE_ID=quickarchviz-pl
PUBLIC_SITE_URL=https://quickarchviz.com
PUBLIC_SITE_MOUNT_PATH=/pl
```

AIBrandScan:

```txt
SITE_ID=aibrandscan
PUBLIC_SITE_URL=https://aibrandscan.com
```

`PUBLIC_SITE_URL` must be the public origin without a path. Put the public mount
path in `PUBLIC_SITE_MOUNT_PATH` only when the hub is mounted below a prefix,
such as `/pl`.

## Local checks

Run development from the root-mounted Astro app:

```sh
npm run dev -- --site quickarchviz-en
npm run dev -- --site quickarchviz-pl
npm run dev -- --site aibrandscan
```

Then open `http://localhost:4321/`. Production mount paths are owned by the
Workers.

Run different-site checks and builds sequentially in one worktree. The site
resolver updates the shared `sites/__current__` symlink, so parallel runs for
different Site IDs can race each other. If Astro emits stale duplicate-id
warnings after switching Site IDs, remove the generated `.astro` cache and rerun
the command.

Run checks and production-style builds:

```sh
npm run check -- --site quickarchviz-en
PUBLIC_SITE_URL=https://quickarchviz.com npm run build -- --site quickarchviz-en

npm run check -- --site quickarchviz-pl
PUBLIC_SITE_URL=https://quickarchviz.com PUBLIC_SITE_MOUNT_PATH=/pl npm run build -- --site quickarchviz-pl

npm run check -- --site aibrandscan
PUBLIC_SITE_URL=https://aibrandscan.com npm run build -- --site aibrandscan
```

## Worker route contract

Root-mounted English hubs own these route families on their public origin:

```txt
/blog
/blog/*
/prompts
/prompts/*
/alternatives
/alternatives/*
/for
/for/*
/use-cases
/use-cases/*
/authors
/authors/*
/categories
/categories/*
/tags
/tags/*
/privacy-policy
/knowledge-hub
/knowledge-hub/*
/knowledge-hub-assets/*
/sitemap*
/llms.txt
/llms-full.txt
```

Prefixed hubs add the public prefix to the same route families. QuickArchViz
Polish therefore owns `/pl/blog`, `/pl/prompts`, `/pl/knowledge-hub-assets/*`,
and so on.

Clean public URLs fetch the matching path from the Pages origin. Old mounted
section URLs under `/knowledge-hub/blog`, `/knowledge-hub/prompts`, and
`/knowledge-hub/use-cases` redirect to the clean public URLs. Static hub assets
are exposed through the `knowledge-hub-assets` public route family.

Proxy Workers:

| Hub | Worker name | Config | Preview | Deploy |
| --- | --- | --- | --- | --- |
| QuickArchViz EN | `quickarchviz-knowledge-hub-en-proxy` | `wrangler.knowledge-hub-en.jsonc` | `npm run preview:knowledge-hub-en-proxy` | `npm run deploy:knowledge-hub-en-proxy` |
| QuickArchViz PL | `quickarchviz-knowledge-hub-pl-proxy` | `wrangler.knowledge-hub-pl.jsonc` | `npm run preview:knowledge-hub-pl-proxy` | `npm run deploy:knowledge-hub-pl-proxy` |
| AIBrandScan | `aibrandscan-knowledge-hub-proxy` | `wrangler.knowledge-hub-aibrandscan.jsonc` | `npm run preview:knowledge-hub-aibrandscan-proxy` | `npm run deploy:knowledge-hub-aibrandscan-proxy` |

The root `https://quickarchviz.com/robots.txt` is owned by the Laravel product
site, not these Astro content Workers. Laravel should publish every sitemap it
wants search engines to discover, including the product sitemap and the hub
sitemaps at `https://quickarchviz.com/sitemap-index.xml` and
`https://quickarchviz.com/pl/sitemap-index.xml`.

When AIBrandScan has a separate product site at `https://aibrandscan.com`, that
product site should follow the same robots and sitemap ownership rule.
