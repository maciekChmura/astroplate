import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { createKnowledgeHubProxy } from "../workers/knowledgeHubProxyCore.js";

function createTestProxy(config = {}) {
  return createKnowledgeHubProxy({
    originHost: "origin.example",
    publicOrigin: "https://quickarchviz.com",
    hubPath: "/knowledge-hub",
    assetPath: "/knowledge-hub-assets",
    ...config,
  });
}

async function withFetchMock(callback) {
  const originalFetch = globalThis.fetch;
  const requests = [];

  globalThis.fetch = async (request) => {
    requests.push(request);

    return new Response("<html><body>ok</body></html>", {
      headers: { "content-type": "text/html; charset=utf-8" },
    });
  };

  try {
    await callback(requests);
  } finally {
    globalThis.fetch = originalFetch;
  }
}

test("proxies alternatives and audience routes to the Pages origin", async () => {
  const proxy = createTestProxy();
  const cases = [
    ["/alternatives", "https://origin.example/alternatives"],
    ["/alternatives/example", "https://origin.example/alternatives/example"],
    ["/for", "https://origin.example/for"],
    ["/for/architects", "https://origin.example/for/architects"],
  ];

  for (const [publicPath, originUrl] of cases) {
    await withFetchMock(async (requests) => {
      const response = await proxy.fetch(
        new Request(`https://quickarchviz.com${publicPath}`),
      );

      assert.equal(response.status, 200);
      assert.equal(requests.length, 1);
      assert.equal(requests[0].url, originUrl);
    });
  }
});

test("redirects old hub URLs to canonical slash-ending public URLs", async () => {
  const proxy = createTestProxy();
  const cases = [
    [
      "/knowledge-hub/alternatives/example",
      "https://quickarchviz.com/alternatives/example/",
    ],
    [
      "/knowledge-hub/for/architects",
      "https://quickarchviz.com/for/architects/",
    ],
    [
      "/knowledge-hub/prompts/architectural-scope-creep-pushback",
      "https://quickarchviz.com/prompts/architectural-scope-creep-pushback/",
    ],
    [
      "/knowledge-hub/blog/how-architects-should-really-use-ai-in-2026",
      "https://quickarchviz.com/blog/how-architects-should-really-use-ai-in-2026/",
    ],
    [
      "/knowledge-hub/tags/building-regulations",
      "https://quickarchviz.com/tags/building-regulations/",
    ],
    [
      "/knowledge-hub/use-cases/interior-visualization-from-screenshot",
      "https://quickarchviz.com/use-cases/interior-visualization-from-screenshot/",
    ],
  ];

  for (const [legacyPath, cleanUrl] of cases) {
    const response = await proxy.fetch(
      new Request(`https://quickarchviz.com${legacyPath}`),
    );

    assert.equal(response.status, 301);
    assert.equal(response.headers.get("location"), cleanUrl);
  }
});

test("redirects prefixed old hub URLs to canonical slash-ending public URLs", async () => {
  const proxy = createTestProxy({
    publicPrefix: "/pl",
    hubPath: "/pl/knowledge-hub",
    assetPath: "/pl/knowledge-hub-assets",
  });
  const cases = [
    [
      "/pl/knowledge-hub/prompts/jakosc-kontra-szybkosc-brief-decyzyjny",
      "https://quickarchviz.com/pl/prompts/jakosc-kontra-szybkosc-brief-decyzyjny/",
    ],
    [
      "/pl/knowledge-hub/blog/prompt-engineering-dla-architektow-rtf-vs-rag",
      "https://quickarchviz.com/pl/blog/prompt-engineering-dla-architektow-rtf-vs-rag/",
    ],
    [
      "/pl/knowledge-hub/tags/prompt-engineering",
      "https://quickarchviz.com/pl/tags/prompt-engineering/",
    ],
    [
      "/pl/knowledge-hub/use-cases/wizualizacja-wnetrza",
      "https://quickarchviz.com/pl/use-cases/wizualizacja-wnetrza/",
    ],
  ];

  for (const [legacyPath, cleanUrl] of cases) {
    const response = await proxy.fetch(
      new Request(`https://quickarchviz.com${legacyPath}`),
    );

    assert.equal(response.status, 301);
    assert.equal(response.headers.get("location"), cleanUrl);
  }
});

function extractRoutePatterns(configSource) {
  return [...configSource.matchAll(/"pattern"\s*:\s*"([^"]+)"/g)].map(
    ([, pattern]) => pattern,
  );
}

test("knowledge hub Wrangler configs include alternatives and audience routes", async () => {
  const configs = [
    {
      path: "../wrangler.knowledge-hub-en.jsonc",
      requiredPatterns: [
        "quickarchviz.com/alternatives",
        "quickarchviz.com/alternatives/*",
        "quickarchviz.com/for",
        "quickarchviz.com/for/*",
      ],
    },
    {
      path: "../wrangler.knowledge-hub-pl.jsonc",
      requiredPatterns: [
        "quickarchviz.com/pl/alternatives",
        "quickarchviz.com/pl/alternatives/*",
        "quickarchviz.com/pl/for",
        "quickarchviz.com/pl/for/*",
      ],
    },
  ];

  for (const config of configs) {
    const source = await readFile(
      new URL(config.path, import.meta.url),
      "utf8",
    );
    const patterns = new Set(extractRoutePatterns(source));

    for (const pattern of config.requiredPatterns) {
      assert.ok(patterns.has(pattern), `${config.path} is missing ${pattern}`);
    }
  }
});
