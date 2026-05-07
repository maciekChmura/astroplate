export const LOCALHOST_SITE_URL = "http://localhost:4321/";

const SITE_URL_ENV_KEYS = ["PUBLIC_SITE_URL", "SITE_URL"];
const LOCAL_HOSTNAMES = new Set(["localhost", "127.0.0.1", "0.0.0.0"]);

export function getProductionSiteUrlError(command = "npm run build") {
  return [
    "Production builds require a real HTTPS site URL.",
    "Set PUBLIC_SITE_URL=https://your-domain.com before running " +
      `${command}.`,
    "SITE_URL is also supported as a fallback.",
  ].join(" ");
}

function isExampleHostname(hostname) {
  return hostname === "example.com" || hostname.includes(".example.");
}

function getInvalidProductionReason(url, rawUrl) {
  if (!/^https:\/\//i.test(rawUrl.trim())) {
    return "must start with https://";
  }

  if (url.protocol !== "https:") {
    return "must use https://";
  }

  if (LOCAL_HOSTNAMES.has(url.hostname)) {
    return "must not point to localhost";
  }

  if (isExampleHostname(url.hostname)) {
    return "must not use an example.com placeholder domain";
  }

  if (url.username || url.password) {
    return "must not include credentials";
  }

  if (url.pathname !== "/" || url.search || url.hash) {
    return "must be an origin URL without a path, query, or hash";
  }

  return undefined;
}

function normalizeSiteUrl(
  rawUrl,
  { production = false, source = "site URL" } = {},
) {
  if (!rawUrl) return undefined;

  const trimmedUrl = rawUrl.trim();
  if (!trimmedUrl) return undefined;

  const urlText = /^https?:\/\//i.test(trimmedUrl)
    ? trimmedUrl
    : `https://${trimmedUrl}`;

  let url;
  try {
    url = new URL(urlText);
  } catch {
    if (production) {
      throw new Error(`${source} is not a valid URL.`);
    }

    return undefined;
  }

  if (production) {
    const reason = getInvalidProductionReason(url, trimmedUrl);

    if (reason) {
      throw new Error(`${source} ${reason}.`);
    }
  } else if (isExampleHostname(url.hostname)) {
    return undefined;
  }

  url.pathname = "/";
  url.search = "";
  url.hash = "";

  return url.toString();
}

export function resolveEnvSiteUrl(
  env = process.env,
  { production = false } = {},
) {
  for (const key of SITE_URL_ENV_KEYS) {
    const resolvedUrl = normalizeSiteUrl(env[key], {
      production,
      source: key,
    });

    if (resolvedUrl) {
      return resolvedUrl;
    }
  }

  if (production) {
    throw new Error(getProductionSiteUrlError());
  }

  return undefined;
}

export function resolveSiteUrl({
  env = process.env,
  configSiteUrl,
  fallbackSiteUrl = LOCALHOST_SITE_URL,
  production = false,
  allowConfigSiteUrl = true,
} = {}) {
  const envSiteUrl = resolveEnvSiteUrl(env, { production });

  if (envSiteUrl) {
    return envSiteUrl;
  }

  if (!production && allowConfigSiteUrl) {
    const configUrl = normalizeSiteUrl(configSiteUrl);

    if (configUrl) {
      return configUrl;
    }
  }

  return fallbackSiteUrl;
}

export function assertProductionSiteUrl(env = process.env, command) {
  const hasConfiguredSiteUrl = SITE_URL_ENV_KEYS.some((key) =>
    env[key]?.trim(),
  );

  if (!hasConfiguredSiteUrl) {
    throw new Error(getProductionSiteUrlError(command));
  }

  try {
    return resolveEnvSiteUrl(env, { production: true });
  } catch (error) {
    throw new Error(`${error.message} ${getProductionSiteUrlError(command)}`);
  }
}
