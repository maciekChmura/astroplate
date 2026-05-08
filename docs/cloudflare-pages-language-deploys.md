# Cloudflare Pages language deploys

This repo supports one static Cloudflare Pages deploy per language by selecting
the site with `SITE_ID`.

Astro always builds and serves the selected language app at `/`. The public
`/resources` mount is handled only by the Cloudflare Worker.

## Pages projects

Create one Cloudflare Pages project per language from the same Git repository.

English project:

- Build command: `npm run build`
- Build output directory: `dist`
- Environment variables:
  - `SITE_ID=quickarchviz-en`
  - `PUBLIC_SITE_URL=https://quickarchviz-en.pages.dev`

Polish project:

- Build command: `npm run build`
- Build output directory: `dist`
- Environment variables:
  - `SITE_ID=quickarchviz-pl`
  - `PUBLIC_SITE_URL=https://quickarchviz-pl.pages.dev`

`PUBLIC_SITE_URL` must be the Pages/custom origin for the root-mounted Astro
app, not the Worker-mounted public URL. Do not include `/resources`; that public
mount is owned by the Worker.

## Local checks

Run local development from the root-mounted Astro app:

```sh
SITE_ID=quickarchviz-en npm run dev
```

Then open `http://localhost:4321/`. Do not use
`http://localhost:4321/resources`; Astro does not know about that Worker mount.

```sh
SITE_ID=quickarchviz-en npm run check
SITE_ID=quickarchviz-pl npm run check
```

Production-style builds require a real HTTPS origin:

```sh
SITE_ID=quickarchviz-en PUBLIC_SITE_URL=https://quickarchviz-en.pages.dev npm run build
SITE_ID=quickarchviz-pl PUBLIC_SITE_URL=https://quickarchviz-pl.pages.dev npm run build
```

Preview the built output with Cloudflare Pages locally:

```sh
SITE_ID=quickarchviz-en PUBLIC_SITE_URL=https://quickarchviz-en.pages.dev npm run preview:cf-pages
```

## Worker mount contract

When the content hub is mounted into a larger site, the Worker should route
`/resources` and `/resources/*` to the matching Pages origin. The Worker strips
`/resources` before fetching, then rewrites HTML/XML/text/JSON responses so
public links, assets, sitemap, robots, canonicals, Open Graph metadata, and LLM
links include `/resources`.

For example, Astro may build with
`PUBLIC_SITE_URL=https://quickarchviz-en.pages.dev`, while the Worker uses
`publicOrigin: "https://quickarchviz.com"` and exposes the site at
`https://quickarchviz.com/resources`.

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

  const originPath =
    url.pathname === config.mountPath
      ? "/"
      : url.pathname.slice(config.mountPath.length);
  const targetUrl = new URL(
    originPath + url.search,
    `https://${config.originHost}`,
  );
  const response = await fetch(new Request(targetUrl, request));

  const contentType = response.headers.get("content-type") || "";
  const shouldRewrite =
    contentType.includes("text/html") ||
    contentType.includes("xml") ||
    contentType.includes("text/plain") ||
    contentType.includes("application/json");

  if (!shouldRewrite) {
    return response;
  }

  let body = await response.text();
  body = body
    .split(`https://${config.originHost}`).join(config.publicOrigin)
    .replaceAll('href="/', `href="${config.mountPath}/`)
    .replaceAll('src="/', `src="${config.mountPath}/`)
    .replaceAll('content="/', `content="${config.mountPath}/`)
    .replaceAll(
      `${config.publicOrigin}/`,
      `${config.publicOrigin}${config.mountPath}/`,
    );

  return new Response(body, response);
}

addEventListener("fetch", (event) => {
  event.respondWith(handleRequest(event.request));
});
```
