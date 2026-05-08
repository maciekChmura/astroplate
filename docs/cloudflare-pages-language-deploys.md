# Cloudflare Pages language deploys

This repo supports one static Cloudflare Pages deploy per language by selecting
the site with `SITE_ID`.

## Pages projects

Create one Cloudflare Pages project per language from the same Git repository.

English project:

- Build command: `npm run build`
- Build output directory: `dist`
- Environment variables:
  - `SITE_ID=quickarchviz-en`
  - `PUBLIC_SITE_URL=https://<public-en-host>`

Polish project:

- Build command: `npm run build`
- Build output directory: `dist`
- Environment variables:
  - `SITE_ID=quickarchviz-pl`
  - `PUBLIC_SITE_URL=https://<public-pl-host>`

`PUBLIC_SITE_URL` must be the origin only. Do not include `/resources`.
The `/resources` mount is configured as `site.base_path` in each site config.

## Local checks

```sh
SITE_ID=quickarchviz-en npm run check
SITE_ID=quickarchviz-pl npm run check
```

Production-style builds require a real HTTPS origin:

```sh
SITE_ID=quickarchviz-en PUBLIC_SITE_URL=https://<public-en-host> npm run build
SITE_ID=quickarchviz-pl PUBLIC_SITE_URL=https://<public-pl-host> npm run build
```

Preview the built output with Cloudflare Pages locally:

```sh
SITE_ID=quickarchviz-en PUBLIC_SITE_URL=https://<public-en-host> npm run preview:cf-pages
```

## Worker mount contract

When the content hub is mounted into a larger site, the Worker should forward
`/resources` and `/resources/*` to the matching Pages origin without stripping
the prefix. Astro builds with `base: "/resources"`, so generated links,
canonicals, sitemap URLs, assets, and Open Graph metadata already include that
prefix.

```js
const config = {
  originHost: "<language-pages-project>.pages.dev",
  publicOrigin: "https://<public-host>",
  mountPath: "/resources",
};

async function handleRequest(request) {
  const url = new URL(request.url);

  if (
    url.pathname !== config.mountPath &&
    !url.pathname.startsWith(`${config.mountPath}/`)
  ) {
    return fetch(request);
  }

  const targetUrl = new URL(
    url.pathname + url.search,
    `https://${config.originHost}`,
  );

  return fetch(new Request(targetUrl, request));
}

addEventListener("fetch", (event) => {
  event.respondWith(handleRequest(event.request));
});
```

