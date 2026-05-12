const config = {
  originHost: "quickarchviz-knowledge-hub-en.pages.dev",
  publicOrigin: "https://quickarchviz.com",
  mountPath: "/knowledge-hub",
};

const legacyRedirects = new Map([
  [
    "/prompts/example-prompt",
    "/prompts/meeting-notes-action-checklist-for-architects",
  ],
]);

const textTypes = [
  "text/css",
  "text/html",
  "text/plain",
  "text/xml",
  "application/xml",
  "application/rss+xml",
  "application/json",
  "application/ld+json",
];

function isMountedPath(pathname) {
  return (
    pathname === config.mountPath || pathname.startsWith(`${config.mountPath}/`)
  );
}

function toOriginPath(pathname) {
  if (pathname === config.mountPath) {
    return "/";
  }

  return pathname.slice(config.mountPath.length) || "/";
}

function normalizeTrailingSlash(pathname) {
  return pathname.length > 1 ? pathname.replace(/\/+$/g, "") : pathname;
}

function shouldRewrite(response) {
  const contentType = response.headers.get("content-type") || "";
  return textTypes.some((type) => contentType.includes(type));
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function toMountedPath(pathname) {
  if (
    pathname === config.mountPath ||
    pathname.startsWith(`${config.mountPath}/`)
  ) {
    return pathname;
  }

  return pathname === "/" ? config.mountPath : `${config.mountPath}${pathname}`;
}

function rewriteRedirectLocation(location) {
  if (!location) {
    return location;
  }

  const publicUrl = new URL(config.publicOrigin);
  const originUrl = new URL(`https://${config.originHost}`);
  const parsedLocation = new URL(location, originUrl);
  const isKnownHost =
    parsedLocation.host === originUrl.host ||
    parsedLocation.host === publicUrl.host;

  if (!isKnownHost) {
    return location;
  }

  const mountedPath = toMountedPath(parsedLocation.pathname);
  return `${mountedPath}${parsedLocation.search}${parsedLocation.hash}`;
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

function prefixRootRelativeAttributes(body) {
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
    const pattern = new RegExp(
      `(${attribute}=["'])/(?!/|${config.mountPath.slice(1)}(?:/|["']))`,
      "g",
    );
    return currentBody.replace(pattern, `$1${config.mountPath}/`);
  }, body);
}

function prefixMarkdownRootPaths(body) {
  return body.replace(
    /(\]\(|\]:\s*)(\/(?!\/)[^)\s]*)/g,
    (match, prefix, path) => {
      if (
        path === config.mountPath ||
        path.startsWith(`${config.mountPath}/`)
      ) {
        return match;
      }

      return `${prefix}${config.mountPath}${path}`;
    },
  );
}

function prefixRootRelativeCssUrls(body) {
  const mountSegment = config.mountPath.slice(1);

  return body.replace(
    /url\(\s*(["']?)\/(?!\/)([^"')\s]+)\1\s*\)/g,
    (match, quote, path) => {
      if (path === mountSegment || path.startsWith(`${mountSegment}/`)) {
        return match;
      }

      return `url(${quote}${config.mountPath}/${path}${quote})`;
    },
  );
}

function prefixSitemapIndexUrls(body) {
  return body.replace(
    new RegExp(`(<loc>)${escapeRegExp(config.publicOrigin)}/sitemap-`, "g"),
    `$1${config.publicOrigin}${config.mountPath}/sitemap-`,
  );
}

async function handleRequest(request) {
  const url = new URL(request.url);

  if (!isMountedPath(url.pathname)) {
    return fetch(request);
  }

  const originPath = toOriginPath(url.pathname);
  const legacyTarget = legacyRedirects.get(normalizeTrailingSlash(originPath));

  if (legacyTarget) {
    return Response.redirect(`${config.mountPath}${legacyTarget}${url.search}`, 301);
  }

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

  let body = await response.text();
  body = body
    .split(`https://${config.originHost}`)
    .join(`${config.publicOrigin}${config.mountPath}`)
    .split(config.originHost)
    .join(new URL(config.publicOrigin).host);
  body = prefixRootRelativeAttributes(body);
  body = prefixMarkdownRootPaths(body);
  body = prefixRootRelativeCssUrls(body);
  body = prefixSitemapIndexUrls(body);

  const responseHeaders = new Headers(response.headers);
  responseHeaders.delete("content-length");

  return new Response(body, {
    status: response.status,
    statusText: response.statusText,
    headers: responseHeaders,
  });
}

export default {
  fetch(request) {
    return handleRequest(request);
  },
};
