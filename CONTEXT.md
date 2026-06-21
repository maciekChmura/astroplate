# Astroplate Multi-Site Publishing

This context describes how this repository models brand-specific knowledge hubs that share one Astro codebase while publishing as separate public web properties.

## Language

**Starter Site**:
A demo content site used to prove the base Astroplate theme and workflows still work independently of customer-facing hubs.
_Avoid_: Main site, default product site

**Knowledge Hub**:
A public content property for a specific brand, made from articles, prompts, use cases, audience pages, comparison pages, authors, static pages, and reusable sections.
_Avoid_: Blog, docs site, microsite

**Site ID**:
The canonical identifier for one deployable content site inside the repository.
_Avoid_: Blog ID, project name, brand name

**Content Root**:
The folder tree that owns one Site ID's Markdown and MDX content.
_Avoid_: src content, CMS folder

**Language Content Root**:
The language-specific folder under a collection, such as `english` or `polish`, that maps authored content to one locale.
_Avoid_: Translation folder, locale folder

**Pages Origin**:
The Cloudflare Pages project that builds one Site ID and serves it at its Pages hostname.
_Avoid_: Static host, Pages site

**Proxy Worker**:
The Cloudflare Worker that maps public brand URLs to a Pages Origin while preserving clean public routes and asset URLs.
_Avoid_: Redirect worker, reverse proxy

**Public Origin**:
The brand-owned HTTPS origin users and crawlers should see in URLs.
_Avoid_: Base URL, production URL

**Public Prefix**:
The public path prefix for a mounted language or hub variant, such as `/pl`.
_Avoid_: Base path, subdirectory

**Shared Image Root**:
The canonical public image folder used by related Site IDs that intentionally share media assets.
_Avoid_: Upload folder, media folder
