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
- Cloudflare Workers (optional deployment)

## 🗂️ Multi-Site Blog Instances

This fork can run multiple blogs from the same repository. The shared Astro app,
layouts, components, scripts, and build pipeline stay in `src/` and `scripts/`.
Each blog instance owns only its branding, config, content, and public images.

The selected site is chosen at command time with `--site <site-id>` or
`SITE_ID=<site-id>`.

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
- `demo-blog`: a small second instance used to verify site switching.

### How Selection Works

- `scripts/siteResolver.js` validates the selected site and loads its folder.
- `scripts/runWithSite.js` wraps the npm commands so `--site <id>` works with
  compound workflows like build, preview, and deploy.
- A generated symlink at `sites/__current__` points `@site/*` imports to the
  selected site. This symlink is ignored by git.
- Generated theme CSS is written to `.astro/generated-theme.css`, which is also
  ignored by git.
- Optional deployment-only env overrides can live in
  `.env.sites/<site-id>.local`; these files are ignored by git.

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
npm run dev -- --site demo-blog
```

### 👉 Build Command

```bash
npm run build -- --site astroplate
```

You can also select the site with an environment variable:

```bash
SITE_ID=astroplate npm run build
```

If no site is provided, the default site id is `astroplate`.

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

### 👉 Preview on Cloudflare Workers

```bash
npm run preview:cf-workers -- --site astroplate
```

### 👉 Deploy to Cloudflare Workers

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
