# Knowledge Hubs Use Pages Origins With Proxy Workers

Accepted. Brand knowledge hubs are built as separate Cloudflare Pages origins selected by `SITE_ID`, while public URLs are owned by small Cloudflare Worker proxies. This keeps each hub's build environment isolated and lets product domains expose clean routes such as `/blog`, `/prompts`, and `/knowledge-hub` without forcing the shared Astro app to own every public route directly.

## Considered Options

- One Pages project serving every brand and language with path-based builds.
- One Pages project per knowledge hub with direct public routes and no proxy.
- One Pages project per knowledge hub plus a proxy Worker for public routing.

## Consequences

Every new knowledge hub needs a Site ID, a Pages project, a proxy Worker wrapper, a Wrangler route config, and dashboard environment variables. The upside is explicit deploy isolation and reusable routing behavior.
