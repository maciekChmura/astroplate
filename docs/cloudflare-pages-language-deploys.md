# Cloudflare Pages language deploys

This repo supports one static Cloudflare Pages deploy per language by selecting
the site with `SITE_ID`.

Astro builds and serves the selected language app at `/` on the Pages origin.
The public `/knowledge-hub` mount is handled by a Cloudflare Worker.

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

## Local checks

Run local development from the root-mounted Astro app:

```sh
SITE_ID=quickarchviz-en npm run dev
```

Then open `http://localhost:4321/`. The production `/knowledge-hub` mount is
owned by the Worker.

```sh
npm run check -- --site quickarchviz-en
SITE_ID=quickarchviz-en PUBLIC_SITE_URL=https://quickarchviz.com PUBLIC_SITE_MOUNT_PATH=/knowledge-hub npm run build
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
