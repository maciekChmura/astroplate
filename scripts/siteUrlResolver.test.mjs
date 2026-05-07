import test from "node:test";
import assert from "node:assert/strict";
import {
  LOCALHOST_SITE_URL,
  assertProductionSiteUrl,
  resolveEnvSiteUrl,
  resolveSiteUrl,
} from "./siteUrlResolver.js";

test("production URL is required", () => {
  assert.throws(
    () => assertProductionSiteUrl({}, "npm run build"),
    /Set PUBLIC_SITE_URL=https:\/\/your-domain\.com before running npm run build/,
  );
});

test("production URL rejects placeholders, HTTP, and localhost", () => {
  assert.throws(
    () =>
      resolveEnvSiteUrl(
        { PUBLIC_SITE_URL: "https://example.com" },
        { production: true },
      ),
    /example\.com placeholder/,
  );
  assert.throws(
    () =>
      resolveEnvSiteUrl(
        { PUBLIC_SITE_URL: "http://real-domain.com" },
        { production: true },
      ),
    /https:\/\//,
  );
  assert.throws(
    () =>
      resolveEnvSiteUrl(
        { PUBLIC_SITE_URL: "http://localhost:4321" },
        { production: true },
      ),
    /https:\/\//,
  );
});

test("production URL rejects example subdomains with paths or query strings", () => {
  assert.throws(
    () =>
      resolveEnvSiteUrl(
        { PUBLIC_SITE_URL: "https://blog.example.org/path?x=1" },
        { production: true },
      ),
    /example\.com placeholder|origin URL/,
  );
});

test("production URL normalizes to origin with trailing slash", () => {
  assert.equal(
    resolveEnvSiteUrl(
      { PUBLIC_SITE_URL: "https://real-domain.com" },
      { production: true },
    ),
    "https://real-domain.com/",
  );
});

test("SITE_URL is accepted when PUBLIC_SITE_URL is absent", () => {
  assert.equal(
    resolveEnvSiteUrl(
      { SITE_URL: "https://site-domain.com" },
      { production: true },
    ),
    "https://site-domain.com/",
  );
});

test("PUBLIC_SITE_URL takes precedence over SITE_URL", () => {
  assert.equal(
    resolveEnvSiteUrl(
      {
        PUBLIC_SITE_URL: "https://public-domain.com",
        SITE_URL: "https://site-domain.com",
      },
      { production: true },
    ),
    "https://public-domain.com/",
  );
});

test("production URL rejects paths, queries, and hashes", () => {
  assert.throws(
    () =>
      resolveEnvSiteUrl(
        { PUBLIC_SITE_URL: "https://real-domain.com/path?x=1#top" },
        { production: true },
      ),
    /origin URL/,
  );
});

test("CF_PAGES_URL does not satisfy site URL resolution", () => {
  assert.equal(
    resolveSiteUrl({
      env: { CF_PAGES_URL: "https://generated.pages.dev" },
      allowConfigSiteUrl: false,
    }),
    LOCALHOST_SITE_URL,
  );
  assert.throws(
    () =>
      resolveSiteUrl({
        env: { CF_PAGES_URL: "https://generated.pages.dev" },
        production: true,
      }),
    /Production builds require/,
  );
});
