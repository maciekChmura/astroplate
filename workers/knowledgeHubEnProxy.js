const config = {
  originHost: "quickarchviz-knowledge-hub-en.pages.dev",
  publicOrigin: "https://quickarchviz.com",
  mountPath: "/knowledge-hub",
};

const textTypes = [
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

function shouldRewrite(response) {
  const contentType = response.headers.get("content-type") || "";
  return textTypes.some((type) => contentType.includes(type));
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

async function handleRequest(request) {
  const url = new URL(request.url);

  if (!isMountedPath(url.pathname)) {
    return fetch(request);
  }

  const originUrl = new URL(
    `${toOriginPath(url.pathname)}${url.search}`,
    `https://${config.originHost}`,
  );
  const headers = new Headers(request.headers);
  headers.delete("host");

  const originRequest = new Request(originUrl, {
    method: request.method,
    headers,
    body: request.body,
    redirect: request.redirect,
  });

  const response = await fetch(originRequest);

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
