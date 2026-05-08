import { siteConfig } from "@/lib/siteConfig";
import { siteLanguages } from "@/lib/siteLanguages";

type LocaleDictionary = {
  main: {
    name: string;
    url: string;
    hasChildren?: boolean;
    children?: { name: string; url: string }[];
  }[];
  footer: { name: string; url: string }[];
  [key: string]: unknown;
};

const { default_language, disable_languages, default_language_in_subdir } =
  siteConfig.settings;
const disabledLanguages = disable_languages as string[];
const configuredBasePath = siteConfig.site.base_path || "/";

function isExternalUrl(url: string) {
  return /^(?:[a-z][a-z\d+.-]*:|\/\/|#)/i.test(url);
}

export function getSiteBasePath() {
  const normalizedBase = configuredBasePath.startsWith("/")
    ? configuredBasePath
    : `/${configuredBasePath}`;
  const withoutTrailingSlash =
    normalizedBase !== "/" && normalizedBase.endsWith("/")
      ? normalizedBase.slice(0, -1)
      : normalizedBase;

  return withoutTrailingSlash || "/";
}

export function stripSiteBasePath(pathname: string) {
  const basePath = getSiteBasePath();

  if (basePath === "/") {
    return pathname || "/";
  }

  if (pathname === basePath) {
    return "/";
  }

  if (pathname.startsWith(`${basePath}/`)) {
    return pathname.slice(basePath.length) || "/";
  }

  return pathname || "/";
}

export function withSiteBasePath(pathname: string) {
  if (!pathname || isExternalUrl(pathname)) {
    return pathname;
  }

  const basePath = getSiteBasePath();
  const normalizedPath =
    pathname === "/" ? "/" : pathname.startsWith("/") ? pathname : `/${pathname}`;

  if (basePath === "/") {
    return normalizedPath;
  }

  if (normalizedPath === basePath || normalizedPath.startsWith(`${basePath}/`)) {
    return normalizedPath;
  }

  return normalizedPath === "/" ? basePath : `${basePath}${normalizedPath}`;
}

export function publicAssetPath(pathname?: string) {
  if (!pathname || isExternalUrl(pathname) || pathname.startsWith("data:")) {
    return pathname;
  }

  if (!pathname.startsWith("/")) {
    return pathname;
  }

  return withSiteBasePath(pathname);
}

const menuModules = import.meta.glob<{ default: LocaleDictionary }>(
  "@site/config/menu.*.json",
  { eager: true },
);

export const enabledLanguages = siteLanguages
  .filter((language) => !disabledLanguages.includes(language.languageCode))
  .sort((a, b) => a.weight - b.weight);

export const supportedLang = default_language_in_subdir
  ? enabledLanguages.map((language) => language.languageCode)
  : [
      "",
      ...enabledLanguages
        .map((language) => language.languageCode)
        .filter((languageCode) => languageCode !== default_language),
    ];

export function normalizeLang(lang?: string) {
  if (!lang || disabledLanguages.includes(lang)) {
    return default_language;
  }

  const language = enabledLanguages.find(
    ({ languageCode }) => languageCode === lang,
  );

  return language?.languageCode || default_language;
}

export function getLanguageByCode(lang?: string) {
  const normalizedLang = normalizeLang(lang);
  return enabledLanguages.find(
    ({ languageCode }) => languageCode === normalizedLang,
  );
}

export function getContentDir(lang?: string) {
  const language = getLanguageByCode(lang);

  if (!language) {
    throw new Error(`Language not found for code "${lang}"`);
  }

  return language.contentDir;
}

export function getLangFromUrl(url: URL) {
  const [, firstSegment] = stripSiteBasePath(url.pathname).split("/");
  const language = enabledLanguages.find(
    ({ languageCode }) => languageCode === firstSegment,
  );

  if (!language) {
    return default_language;
  }

  return language.languageCode;
}

export async function getTranslations(lang?: string) {
  const normalizedLang = normalizeLang(lang);

  try {
    const menu = Object.entries(menuModules).find(([modulePath]) =>
      modulePath.endsWith(`/menu.${normalizedLang}.json`),
    )?.[1];
    const dictionary = await import(`../../i18n/${normalizedLang}.json`);

    if (!menu) {
      throw new Error(`Menu not found for language "${normalizedLang}"`);
    }

    return {
      ...(menu.default as LocaleDictionary),
      ...(dictionary.default as Record<string, string>),
    };
  } catch {
    const menu = Object.entries(menuModules).find(([modulePath]) =>
      modulePath.endsWith(`/menu.${default_language}.json`),
    )?.[1];
    const dictionary = await import(`../../i18n/${default_language}.json`);

    if (!menu) {
      throw new Error(`Menu not found for language "${default_language}"`);
    }

    return {
      ...(menu.default as LocaleDictionary),
      ...(dictionary.default as Record<string, string>),
    };
  }
}

export function slugSelector(url: string, lang?: string) {
  if (isExternalUrl(url)) {
    return url;
  }

  const normalizedLang = normalizeLang(lang);
  const normalizedUrl = stripSiteBasePath(
    url === "/" ? "/" : url.startsWith("/") ? url : `/${url}`,
  );

  let pathname =
    normalizedLang === default_language && !default_language_in_subdir
      ? normalizedUrl
      : normalizedUrl === "/"
        ? `/${normalizedLang}`
        : `/${normalizedLang}${normalizedUrl}`;

  if (siteConfig.site.trailing_slash) {
    if (!pathname.endsWith("/")) {
      pathname = `${pathname}/`;
    }
  } else if (pathname !== "/" && pathname.endsWith("/")) {
    pathname = pathname.slice(0, -1);
  }

  return withSiteBasePath(pathname);
}

export function stripLocaleFromId(id: string) {
  return id.split("/").slice(1).join("/");
}
