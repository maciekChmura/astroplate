const config = {
  originHost: "astroplate-wq8.pages.dev",
  publicOrigin: "https://quickarchviz.com",
  mountPath: "/pl/knowledge-hub",
};

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

const mountedPublicPathPrefixes = [
  "/_astro",
  "/authors",
  "/blog",
  "/categories",
  "/contact",
  "/prompts",
  "/privacy-policy",
  "/sites",
  "/tags",
  "/use-cases",
  "/sitemap-",
];

const originLanguagePath = "/pl";
const originLanguageHubPrefixes = [
  "/authors",
  "/blog",
  "/categories",
  "/contact",
  "/prompts",
  "/privacy-policy",
  "/tags",
  "/use-cases",
];

function isMountedPath(pathname) {
  return (
    pathname === config.mountPath || pathname.startsWith(`${config.mountPath}/`)
  );
}

function isMountedLanguageHomePath(pathname) {
  return (
    pathname === `${config.mountPath}${originLanguagePath}` ||
    pathname === `${config.mountPath}${originLanguagePath}/`
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

  if (pathname.startsWith(`${originLanguagePath}/`)) {
    const pathWithoutLanguage = pathname.slice(originLanguagePath.length);

    if (
      originLanguageHubPrefixes.some(
        (prefix) =>
          pathWithoutLanguage === prefix ||
          pathWithoutLanguage.startsWith(`${prefix}/`),
      )
    ) {
      return `${config.mountPath}${pathWithoutLanguage}`;
    }
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

function rewriteOriginLanguageMountedAttributes(body) {
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

  return originLanguageHubPrefixes.reduce((currentBody, prefix) => {
    return attributes.reduce((attributeBody, attribute) => {
      const pattern = new RegExp(
        `(${attribute}=["'])${escapeRegExp(originLanguagePath)}${escapeRegExp(
          prefix,
        )}(?=[/?#"'\\s<]|$)`,
        "g",
      );

      return attributeBody.replace(
        pattern,
        `$1${config.mountPath}${prefix}`,
      );
    }, currentBody);
  }, body);
}

function rewriteOriginLanguageHomeAttributes(body) {
  return body
    .split(`href="${config.mountPath}${originLanguagePath}"`)
    .join(`href="${config.mountPath}"`)
    .split(`href='${config.mountPath}${originLanguagePath}'`)
    .join(`href='${config.mountPath}'`)
    .split(`href=&quot;${config.mountPath}${originLanguagePath}&quot;`)
    .join(`href=&quot;${config.mountPath}&quot;`)
    .split(
      `"${config.publicOrigin}${config.mountPath}${originLanguagePath}"`,
    )
    .join(`"${config.publicOrigin}${config.mountPath}"`)
    .split(
      `&quot;${config.publicOrigin}${config.mountPath}${originLanguagePath}&quot;`,
    )
    .join(`&quot;${config.publicOrigin}${config.mountPath}&quot;`);
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

function prefixPublicOriginMountedUrls(body) {
  return mountedPublicPathPrefixes.reduce((currentBody, prefix) => {
    const rootPattern = new RegExp(
      `${escapeRegExp(config.publicOrigin)}${escapeRegExp(prefix)}(?=[/?#"'\\s<]|$)`,
      "g",
    );
    const languagePattern = new RegExp(
      `${escapeRegExp(config.publicOrigin)}${escapeRegExp(
        originLanguagePath,
      )}${escapeRegExp(prefix)}(?=[/?#"'\\s<]|$)`,
      "g",
    );

    return currentBody.replace(
      languagePattern,
      `${config.publicOrigin}${config.mountPath}${prefix}`,
    ).replace(
      rootPattern,
      `${config.publicOrigin}${config.mountPath}${prefix}`,
    );
  }, body);
}

function rewriteRootMetadataUrls(body) {
  const rootUrl = config.publicOrigin;
  const languageUrl = `${config.publicOrigin}${originLanguagePath}`;
  const mountedUrl = `${config.publicOrigin}${config.mountPath}`;

  return body
    .split(`href="${languageUrl}" item-prop="url"`)
    .join(`href="${mountedUrl}" item-prop="url"`)
    .split(`href="${rootUrl}" item-prop="url"`)
    .join(`href="${mountedUrl}" item-prop="url"`)
    .split(`content="${languageUrl}"`)
    .join(`content="${mountedUrl}"`)
    .split(`content="${rootUrl}"`)
    .join(`content="${mountedUrl}"`)
    .split(`"url":"${languageUrl}"`)
    .join(`"url":"${mountedUrl}"`)
    .split(`"url":"${rootUrl}"`)
    .join(`"url":"${mountedUrl}"`)
    .split(`"@id":"${languageUrl}#`)
    .join(`"@id":"${mountedUrl}#`)
    .split(`"@id":"${rootUrl}#`)
    .join(`"@id":"${mountedUrl}#`);
}

async function handleRequest(request) {
  const url = new URL(request.url);

  if (isMountedLanguageHomePath(url.pathname)) {
    return Response.redirect(
      `${config.publicOrigin}${config.mountPath}${url.search}`,
      301,
    );
  }

  if (!isMountedPath(url.pathname)) {
    return fetch(request);
  }

  const originPath = toOriginPath(url.pathname);
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
  body = rewriteOriginLanguageMountedAttributes(body);
  body = prefixRootRelativeAttributes(body);
  body = rewriteOriginLanguageHomeAttributes(body);
  body = prefixMarkdownRootPaths(body);
  body = prefixRootRelativeCssUrls(body);
  body = prefixSitemapIndexUrls(body);
  body = prefixPublicOriginMountedUrls(body);
  body = rewriteRootMetadataUrls(body);

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
