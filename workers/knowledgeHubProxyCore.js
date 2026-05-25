const defaultContentPrefixes = [
  "/authors",
  "/blog",
  "/categories",
  "/knowledge-hub",
  "/privacy-policy",
  "/prompts",
  "/tags",
  "/use-cases",
];

const defaultOldHubRedirectPrefixes = [
  "/authors",
  "/blog",
  "/categories",
  "/privacy-policy",
  "/prompts",
  "/tags",
  "/use-cases",
];

const defaultAssetPrefixes = ["/_astro", "/sites"];
const defaultRootFiles = ["/llms.txt", "/llms-full.txt", "/sitemap-index.xml"];
const textTypes = [
  "text/css",
  "text/html",
  "text/plain",
  "text/xml",
  "application/xml",
  "application/rss+xml",
  "application/json",
  "application/ld+json",
  "text/markdown",
];

function normalizePath(pathname) {
  return pathname.length > 1 ? pathname.replace(/\/+$/g, "") : pathname || "/";
}

function hasPrefix(pathname, prefix) {
  return pathname === prefix || pathname.startsWith(`${prefix}/`);
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function normalizePrefix(value = "") {
  const trimmed = value.trim();
  return trimmed && trimmed !== "/"
    ? `/${trimmed.replace(/^\/+|\/+$/g, "")}`
    : "";
}

function createPathHelpers(config, assetPrefixes) {
  function stripPublicPrefix(pathname) {
    if (!config.publicPrefix) {
      return pathname;
    }

    if (pathname === config.publicPrefix) {
      return "/";
    }

    if (pathname.startsWith(`${config.publicPrefix}/`)) {
      return pathname.slice(config.publicPrefix.length) || "/";
    }

    return pathname;
  }

  function addPublicPrefix(pathname) {
    if (!config.publicPrefix) {
      return pathname;
    }

    if (pathname === "/") {
      return config.publicPrefix;
    }

    if (hasPrefix(pathname, config.publicPrefix)) {
      return pathname;
    }

    return `${config.publicPrefix}${pathname}`;
  }

  function isOriginAssetPath(pathname) {
    return assetPrefixes.some((prefix) => hasPrefix(pathname, prefix));
  }

  function isPublicAssetPath(pathname) {
    return hasPrefix(pathname, config.assetPath);
  }

  function publicPathFromOriginPath(pathname) {
    if (isOriginAssetPath(pathname)) {
      return `${config.assetPath}${pathname}`;
    }

    return addPublicPrefix(pathname);
  }

  function originPathFromPublicPath(pathname) {
    if (isPublicAssetPath(pathname)) {
      return pathname.slice(config.assetPath.length) || "/";
    }

    return stripPublicPrefix(pathname);
  }

  return {
    addPublicPrefix,
    isOriginAssetPath,
    isPublicAssetPath,
    originPathFromPublicPath,
    publicPathFromOriginPath,
    stripPublicPrefix,
  };
}

export function createKnowledgeHubProxy(userConfig) {
  const config = {
    ...userConfig,
    publicPrefix: normalizePrefix(userConfig.publicPrefix),
  };
  const contentPrefixes = userConfig.contentPrefixes || defaultContentPrefixes;
  const oldHubRedirectPrefixes =
    userConfig.oldHubRedirectPrefixes || defaultOldHubRedirectPrefixes;
  const assetPrefixes = userConfig.assetPrefixes || defaultAssetPrefixes;
  const rootFiles = userConfig.rootFiles || defaultRootFiles;
  const legacyRedirects = new Map(
    (userConfig.legacyRedirects || []).map(({ from, to }) => [
      normalizePath(from),
      to,
    ]),
  );
  const paths = createPathHelpers(config, assetPrefixes);

  function isSitemapPath(pathname) {
    return (
      pathname === "/sitemap-index.xml" || /^\/sitemap-\d+\.xml$/.test(pathname)
    );
  }

  function isMarkdownContentPath(originPathname) {
    return (
      contentPrefixes.some((prefix) => hasPrefix(originPathname, prefix)) &&
      originPathname.endsWith(".md")
    );
  }

  function isRootFile(originPathname) {
    return rootFiles.includes(originPathname) || isSitemapPath(originPathname);
  }

  function isContentPath(originPathname) {
    return contentPrefixes.some((prefix) => hasPrefix(originPathname, prefix));
  }

  function isRoutablePath(pathname) {
    const originPathname = paths.originPathFromPublicPath(pathname);

    return (
      isContentPath(originPathname) ||
      isRootFile(originPathname) ||
      isMarkdownContentPath(originPathname) ||
      paths.isPublicAssetPath(pathname) ||
      hasPrefix(pathname, config.hubPath)
    );
  }

  function shouldRewrite(response) {
    const contentType = response.headers.get("content-type") || "";
    return textTypes.some((type) => contentType.includes(type));
  }

  function publicUrl(pathname, search = "", hash = "") {
    return `${config.publicOrigin}${pathname}${search}${hash}`;
  }

  function getOldHubRedirectTarget(pathname) {
    if (pathname === `${config.hubPath}/`) {
      return config.hubPath;
    }

    if (!pathname.startsWith(`${config.hubPath}/`)) {
      return undefined;
    }

    const pathWithoutHub = pathname.slice(config.hubPath.length) || "/";

    if (
      oldHubRedirectPrefixes.some((prefix) => hasPrefix(pathWithoutHub, prefix))
    ) {
      return paths.publicPathFromOriginPath(pathWithoutHub);
    }

    if (isRootFile(pathWithoutHub) || isMarkdownContentPath(pathWithoutHub)) {
      return paths.publicPathFromOriginPath(pathWithoutHub);
    }

    if (paths.isOriginAssetPath(pathWithoutHub)) {
      return `${config.assetPath}${pathWithoutHub}`;
    }

    return undefined;
  }

  function getLegacyRedirectTarget(pathname, oldHubRedirectTarget) {
    const candidates = [pathname, oldHubRedirectTarget]
      .filter(Boolean)
      .map((path) => normalizePath(paths.originPathFromPublicPath(path)));

    for (const candidate of candidates) {
      const target = legacyRedirects.get(candidate);

      if (target) {
        return paths.publicPathFromOriginPath(target);
      }
    }

    return undefined;
  }

  function rewriteRedirectLocation(location) {
    if (!location) {
      return location;
    }

    const publicUrlObject = new URL(config.publicOrigin);
    const originUrl = new URL(`https://${config.originHost}`);
    const parsedLocation = new URL(location, originUrl);
    const isKnownHost =
      parsedLocation.host === originUrl.host ||
      parsedLocation.host === publicUrlObject.host;

    if (!isKnownHost) {
      return location;
    }

    const originPathname = paths.stripPublicPrefix(parsedLocation.pathname);
    const pathname = paths.publicPathFromOriginPath(originPathname);
    return `${pathname}${parsedLocation.search}${parsedLocation.hash}`;
  }

  function rewriteRedirect(response) {
    const location = response.headers.get("location");

    if (!location) {
      return response;
    }

    const responseHeaders = new Headers(response.headers);
    responseHeaders.set("location", rewriteRedirectLocation(location));
    responseHeaders.delete("content-length");

    return new Response(null, {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
    });
  }

  function prefixedAssetPatterns(prefix) {
    if (!config.publicPrefix) {
      return [escapeRegExp(prefix)];
    }

    return [
      `${escapeRegExp(config.publicPrefix)}${escapeRegExp(prefix)}`,
      escapeRegExp(prefix),
    ];
  }

  function rewriteRootRelativeAssetAttributes(body) {
    const attributes = [
      "action",
      "content",
      "href",
      "poster",
      "src",
      "component-url",
      "renderer-url",
      "before-hydration-url",
    ];

    return attributes.reduce((currentBody, attribute) => {
      return assetPrefixes.reduce((attributeBody, prefix) => {
        return prefixedAssetPatterns(prefix).reduce((patternBody, pattern) => {
          const regex = new RegExp(
            `(${attribute}=["'])${pattern}(?=[/?#"'\\s<]|$)`,
            "g",
          );
          return patternBody.replace(
            regex,
            `$1${config.assetPath}${prefix}`,
          );
        }, attributeBody);
      }, currentBody);
    }, body);
  }

  function rewriteMarkdownAssetPaths(body) {
    return assetPrefixes.reduce((currentBody, prefix) => {
      return prefixedAssetPatterns(prefix).reduce((patternBody, pattern) => {
        const regex = new RegExp(
          `(\\]\\(|\\]:\\s*)${pattern}([^\\)\\s]*)`,
          "g",
        );
        return patternBody.replace(
          regex,
          `$1${config.assetPath}${prefix}$2`,
        );
      }, currentBody);
    }, body);
  }

  function rewriteCssAssetUrls(body) {
    return assetPrefixes.reduce((currentBody, prefix) => {
      return prefixedAssetPatterns(prefix).reduce((patternBody, pattern) => {
        const regex = new RegExp(
          `url\\(\\s*(["']?)${pattern}([^"')\\s]*)\\1\\s*\\)`,
          "g",
        );
        return patternBody.replace(
          regex,
          `url($1${config.assetPath}${prefix}$2$1)`,
        );
      }, currentBody);
    }, body);
  }

  function rewriteAbsoluteAssetUrls(body) {
    const publicHost = new URL(config.publicOrigin).host;

    return assetPrefixes.reduce((currentBody, prefix) => {
      const optionalPublicPrefix = config.publicPrefix
        ? `(?:${escapeRegExp(config.publicPrefix)})?`
        : "";
      const originPattern = new RegExp(
        `https://${escapeRegExp(config.originHost)}${optionalPublicPrefix}${escapeRegExp(prefix)}(?=[/?#"'\\s<]|$)`,
        "g",
      );
      const publicPattern = new RegExp(
        `${escapeRegExp(config.publicOrigin)}${optionalPublicPrefix}${escapeRegExp(prefix)}(?=[/?#"'\\s<]|$)`,
        "g",
      );
      const publicHostPattern = new RegExp(
        `//${escapeRegExp(publicHost)}${optionalPublicPrefix}${escapeRegExp(prefix)}(?=[/?#"'\\s<]|$)`,
        "g",
      );

      return currentBody
        .replace(
          originPattern,
          `${config.publicOrigin}${config.assetPath}${prefix}`,
        )
        .replace(
          publicPattern,
          `${config.publicOrigin}${config.assetPath}${prefix}`,
        )
        .replace(
          publicHostPattern,
          `//${publicHost}${config.assetPath}${prefix}`,
        );
    }, body);
  }

  function rewriteBody(body) {
    return rewriteCssAssetUrls(
      rewriteMarkdownAssetPaths(
        rewriteRootRelativeAssetAttributes(
          rewriteAbsoluteAssetUrls(
            body
              .split(`https://${config.originHost}`)
              .join(config.publicOrigin)
              .split(config.originHost)
              .join(new URL(config.publicOrigin).host),
          ),
        ),
      ),
    );
  }

  async function handleRequest(request) {
    const url = new URL(request.url);
    const oldHubRedirectTarget = getOldHubRedirectTarget(url.pathname);
    const legacyTarget = getLegacyRedirectTarget(
      url.pathname,
      oldHubRedirectTarget,
    );

    if (!isRoutablePath(url.pathname)) {
      return fetch(request);
    }

    if (legacyTarget) {
      return Response.redirect(publicUrl(legacyTarget, url.search), 301);
    }

    if (oldHubRedirectTarget && oldHubRedirectTarget !== url.pathname) {
      return Response.redirect(publicUrl(oldHubRedirectTarget, url.search), 301);
    }

    const originPath = paths.originPathFromPublicPath(url.pathname);
    const originUrl = new URL(
      `${originPath}${url.search}`,
      `https://${config.originHost}`,
    );
    const headers = new Headers(request.headers);
    headers.delete("host");

    const originRequest = new Request(originUrl, {
      method: request.method,
      headers,
      body: request.body,
      redirect: "manual",
    });

    const response = await fetch(originRequest);

    if (response.status >= 300 && response.status < 400) {
      return rewriteRedirect(response);
    }

    if (!shouldRewrite(response)) {
      return response;
    }

    const responseHeaders = new Headers(response.headers);
    responseHeaders.delete("content-length");

    return new Response(rewriteBody(await response.text()), {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
    });
  }

  return {
    fetch(request) {
      return handleRequest(request);
    },
  };
}
