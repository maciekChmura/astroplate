<h1 align=center>Astro + Tailwind CSS + TypeScript Starter and Boilerplate</h1>

<p align=center>Astroplate is a free starter template built with Astro, TailwindCSS & TypeScript, providing everything you need to jumpstart your Astro project and save valuable time.</p>

<p align=center>Made with ♥ by <a href="https://zeon.studio/">Zeon Studio</a></p>

<p align=center> If you find this project useful, please give it a ⭐ to show your support. </p>

<h2 align="center"> <a target="_blank" href="https://astroplate.netlify.app/" rel="nofollow">👀 Demo</a> | <a target="_blank" href="https://astroplate-multilang.netlify.app/" rel="nofollow">👀 Demo Multilang</a> | <a  target="_blank" href="https://pagespeed.web.dev/analysis/https-astroplate-netlify-app/yzx3foum3w?form_factor=desktop">Page Speed (100%)🚀</a> |   <a target="_blank" href="https://app.sitepins.com/new/clone?name=Astroplate&repository=https://github.com/zeon-studio/astroplate?aff=astroplate">
    <img src="https://sitepins.com/button.svg" alt="Edit with Sitepins">
  </a>
</h2>

<p align=center>
  <a href="https://github.com/withastro/astro/releases/tag/astro%406.1.9">
    <img src="https://img.shields.io/static/v1?label=ASTRO&message=6.1.9&color=000&logo=astro"  alt="Astro Version 6.1.9"/>
  </a>

  <a href="https://github.com/zeon-studio/astroplate/blob/main/LICENSE">
    <img src="https://img.shields.io/github/license/zeon-studio/astroplate" alt="license"></a>

  <img src="https://img.shields.io/github/languages/code-size/zeon-studio/astroplate" alt="code size">

  <a href="https://github.com/zeon-studio/astroplate/graphs/contributors">
    <img src="https://img.shields.io/github/contributors/zeon-studio/astroplate" alt="contributors"></a>
</p>

## 📌 Key Features

- 👥 Multi-Authors
- 🌐 Multilingual
- 🎯 Similar Posts Suggestion
- 🔍 Search Functionality
- 🌑 Dark Mode
- 🏷️ Tags & Categories
- 🗂️ Multiple blog instances from one shared codebase
- 🔗 Netlify setting pre-configured
- 📞 Support contact form
- 📱 Fully responsive
- 📝 Write and update content in Markdown / MDX
- 🤖 LLM-ready docs generation (`llms.txt`, `llms-full.txt`, and per-page `.md`)
- 📎 Google Tag Manager
- 💬 Disqus Comment
- 🔳 Syntax Highlighting

### 📄 15+ Pre-designed Pages

- 🏠 Homepage
- 👤 About
- 📞 Contact
- 👥 Authors
- 👤 Author Single
- 📝 Blog
- 📝 Blog Single
- 🚫 Custom 404
- 💡 Elements
- 📄 Privacy Policy
- 🏷️ Tags
- 🏷️ Tag Single
- 🗂️ Categories
- 🗂️ Category Single
- 🔍 Search

## 🔗 Integrations

- astro/react
- astro/sitemap
- astro/tailwind
- Cloudflare Pages (static deploys)
- Cloudflare Workers (optional `/resources` proxy in front of Pages)

## 🗂️ Multi-Site Blog Instances

This fork can run multiple blogs from the same repository. The shared Astro app,
layouts, components, scripts, and build pipeline stay in `src/` and `scripts/`.
Each blog instance owns only its branding, config, content, and public images.

The selected site is chosen at command time with `--site <site-id>` or
`SITE_ID=<site-id>`.

QuickArchViz is split into one static Cloudflare Pages deploy per language:

- `quickarchviz-en`: English resources deploy.
- `quickarchviz-pl`: Polish resources deploy.

Astro builds each language deploy at `/`. The public `/resources` path is owned
by the Cloudflare Worker in front of the Pages project.

### Site Folder Structure

```text
sites/
  astroplate/
    manifest.json
    config/
      config.json
      theme.json
      language.json
      social.json
      menu.en.json
      menu.pl.json
    content/
      blog/
      authors/
      pages/
      about/
      contact/
      homepage/
      sections/

public/
  sites/
    astroplate/
      images/
```

The repository currently includes:

- `astroplate`: the migrated default site instance.
- `quickarchviz-en`: English-only QuickArchViz resources deploy.
- `quickarchviz-pl`: Polish-only QuickArchViz resources deploy.

### How Selection Works

- `scripts/siteResolver.js` validates the selected site and loads its folder.
- `scripts/runWithSite.js` wraps the npm commands so `--site <id>` works with
  compound workflows like build, preview, and deploy.
- A generated symlink at `sites/__current__` points `@site/*` imports to the
  selected site. This symlink is ignored by git.
- Generated theme CSS is written to `.astro/generated-theme.css`, which is also
  ignored by git.
- Production builds emit root-mounted static output in `dist`. For QuickArchViz
  this means `dist/index.html`, `dist/post-1/index.html`, `dist/_astro/`,
  `dist/robots.txt`, `dist/sitemap-index.xml`, and root-level LLM files.
- Optional deployment-only env overrides can live in
  `.env.sites/<site-id>.local`; these files are ignored by git.

### QuickArchViz Language Deploys

The two QuickArchViz sites intentionally use one enabled language each:

```text
quickarchviz-en
  default language: en
  Astro mount: /
  public Worker mount: /resources

quickarchviz-pl
  default language: pl
  Astro mount: /
  public Worker mount: /resources
```

The source content still follows the existing content folder convention:

```text
sites/quickarchviz-en/content/blog/english/
sites/quickarchviz-pl/content/blog/polish/
```

For day-to-day content work:

- Add English posts to `sites/quickarchviz-en/content/blog/english/`.
- Add Polish posts to `sites/quickarchviz-pl/content/blog/polish/`.
- Keep post images in `public/sites/quickarchviz/images/` unless a language
  deploy needs its own asset folder.
- Reference images with absolute paths like
  `/sites/quickarchviz/images/cover.png`.

Use the language-specific site id when working locally:

```bash
npm run dev -- --site quickarchviz-en
npm run dev -- --site quickarchviz-pl
```

or:

```bash
SITE_ID=quickarchviz-en npm run dev
SITE_ID=quickarchviz-pl npm run dev
```

In development, Astro serves the selected site at `http://localhost:4321/`.
The local Astro app does not know about `/resources`; the Worker adds that
public mount in production.

### Adding a New Blog

1. Copy an existing instance:

```bash
cp -R sites/astroplate sites/my-project
cp -R public/sites/astroplate public/sites/my-project
```

2. Update `sites/my-project/manifest.json`.
3. Update `sites/my-project/config/config.json` for the site name, URL, logo,
   favicon, SEO defaults, social links, pagination, language settings, and
   feature toggles.
4. Update `sites/my-project/config/theme.json` for colors and fonts.
5. Put posts in `sites/my-project/content/blog/<language>/`.
6. Put images in `public/sites/my-project/images/` and reference them with
   absolute paths like `/sites/my-project/images/cover.png`.

Blog post frontmatter should include only:

```yaml
title:
description:
date:
image:
categories:
tags:
draft:
```

Use `draft: true` for unpublished posts. Draft posts are excluded from routes,
search JSON, and generated output.

## 🚀 Getting Started

### 📦 Dependencies

- astro v6.1.9
- node v22.12.0+ (see `.nvmrc`)
- npm
- tailwind v4+

### 👉 Install Dependencies

```bash
npm install
```

### 👉 Development Command

```bash
npm run dev -- --site astroplate
# or
npm run dev -- --site quickarchviz-en
# or
npm run dev -- --site quickarchviz-pl
```

### 👉 Build Command

```bash
npm run build -- --site astroplate
# or
PUBLIC_SITE_URL=https://quickarchviz-en.pages.dev npm run build -- --site quickarchviz-en
```

You can also select the site with an environment variable:

```bash
SITE_ID=astroplate npm run build
SITE_ID=quickarchviz-en PUBLIC_SITE_URL=https://quickarchviz-en.pages.dev npm run build
SITE_ID=quickarchviz-pl PUBLIC_SITE_URL=https://quickarchviz-pl.pages.dev npm run build
```

If no site is provided, the default site id is `astroplate`.

Production builds require a real HTTPS `PUBLIC_SITE_URL`. Use the Pages/custom
origin for the root-mounted Astro app, not the Worker-mounted public URL, and do
not include `/resources`.

### 👉 Generate LLM Files

After build, this project can generate LLM-friendly files from the selected
site's `dist` HTML:

- `llms.txt` (index of pages)
- `llms-full.txt` (full combined content)
- optional per-page Markdown files

Use one of these ways:

```bash
# included in build
npm run build -- --site astroplate

# or run manually after build
npm run generate-llms -- --site astroplate
```

Configuration is in `sites/<site-id>/config/config.json` under `llms`:

- `generate_llms_txt`: create `llms.txt`
- `generate_llms_full_txt`: create `llms-full.txt`
- `generate_individual_md`: create individual `.md` files
- `include`: include only selected routes/globs (empty = all files). Examples: `/about`, `/blog/**` (all files in blog folder)
- `exclude`: exclude routes/globs on top of defaults. Example: `/blog/index.html`

For QuickArchViz, generated LLM files are emitted at the build root:

```text
dist/llms.txt
dist/llms-full.txt
dist/<page>.md
```

### 👉 Cloudflare Pages Deploys

Create one Cloudflare Pages project per language from this same repository.

English project:

```text
Build command: npm run build
Build output directory: dist
Environment:
  SITE_ID=quickarchviz-en
  PUBLIC_SITE_URL=https://quickarchviz-en.pages.dev
```

Polish project:

```text
Build command: npm run build
Build output directory: dist
Environment:
  SITE_ID=quickarchviz-pl
  PUBLIC_SITE_URL=https://quickarchviz-pl.pages.dev
```

`PUBLIC_SITE_URL` must be the root Astro app origin only. Do not include
`/resources`, and do not use the Worker-mounted URL as the Astro build origin.

### 👉 Preview on Cloudflare Pages

Preview the selected site as a Pages static output:

```bash
SITE_ID=quickarchviz-en PUBLIC_SITE_URL=https://quickarchviz-en.pages.dev npm run preview:cf-pages
SITE_ID=quickarchviz-pl PUBLIC_SITE_URL=https://quickarchviz-pl.pages.dev npm run preview:cf-pages
```

### 👉 Cloudflare Worker `/resources` Proxy

If the Pages project is mounted behind a Worker on a larger domain, the Worker
owns `/resources`. It strips `/resources` before fetching from the Pages origin,
then rewrites HTML/XML/text/JSON responses so public links, assets, sitemap,
robots, canonicals, and Open Graph URLs include `/resources`.

For example, Astro can build with
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

Astro builds with `base: "/"`, so the Worker is responsible for mapping public
`/resources/...` requests to root-origin Pages paths.

### 👉 Legacy Cloudflare Workers Static-Assets Preview

```bash
npm run preview:cf-workers -- --site astroplate
```

### 👉 Legacy Cloudflare Workers Static-Assets Deploy

```bash
npm run deploy:cf-workers -- --site astroplate
```

### 👉 Build and Run With Docker

```bash
docker build -t astroplate .
# or
# docker build --build-arg INSTALLER=npm -t astroplate .
# or
# docker build --build-arg INSTALLER=pnpm -t astroplate .

docker run -p 3000:80 astroplate
# or
# docker run --rm -p 3000:80 astroplate
```

To access the shell within the container:

```bash
docker run -it --rm astroplate ash
```

<!-- edit with sitepins -->

## 📝 Edit Content with CMS

This template comes pre-configured with [**Sitepins**](https://sitepins.com?aff=astroplate), a Git-based Headless CMS designed for seamless content management. You can update your website’s text, images, and configuration without touching a single line of code.

**How to get started:**

Click the Edit with Sitepins button below and follow the on-screen instructions to start editing your content visually.

  <a target="_blank" href="https://app.sitepins.com/new/clone?name=Astroplate&repository=https://github.com/zeon-studio/astroplate?aff=astroplate">
    <img src="https://sitepins.com/button.svg" alt="Edit with Sitepins">
  </a>

<!-- reporting issue -->

## 🐞 Reporting Issues

We use GitHub Issues as the official bug tracker for this Template. Please Search [existing issues](https://github.com/zeon-studio/astroplate/issues). It’s possible someone has already reported the same problem.
If your problem or idea has not been addressed yet, feel free to [open a new issue](https://github.com/zeon-studio/astroplate/issues).

<!-- licence -->

## 📝 License

Copyright (c) 2023 - Present, Designed & Developed by [Zeon Studio](https://zeon.studio/)

**Code License:** Released under the [MIT](https://github.com/zeon-studio/astroplate/blob/main/LICENSE) license.

**Image license:** The images are only for demonstration purposes. They have their license, we don't have permission to share those images.

## 💻 Need Custom Development Services?

If you need a custom theme, theme customization, or complete website development services from scratch you can [Hire Us](https://zeon.studio/).
