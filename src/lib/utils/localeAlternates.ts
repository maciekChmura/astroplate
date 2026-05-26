import { siteConfig } from "@/lib/siteConfig";
import { getSinglePage } from "@/lib/contentParser.astro";
import { getTaxonomy } from "@/lib/taxonomyParser.astro";
import {
  alternativePath,
  alternativesIndexPath,
} from "@/lib/utils/alternativeRoutes";
import { audiencePath, audiencesIndexPath } from "@/lib/utils/audienceRoutes";
import { blogPostPath } from "@/lib/utils/blogRoutes";
import {
  enabledLanguages,
  getLangFromUrl,
  normalizeLang,
  slugSelector,
  stripLocaleFromId,
} from "@/lib/utils/languageParser";

const BLOG_FOLDER = "blog";
const ALTERNATIVES_FOLDER = "alternatives";
const AUDIENCES_FOLDER = "for";
const PAGE_SIZE = siteConfig.settings.pagination;
const { default_language, default_language_in_subdir } = siteConfig.settings;

const blogPostSlugs = new Map<string, Set<string>>();
const alternativeSlugs = new Map<string, Set<string>>();
const audienceSlugs = new Map<string, Set<string>>();
const regularPageSlugs = new Map<string, Set<string>>();
const authorSlugs = new Map<string, Set<string>>();
const categorySlugs = new Map<string, Set<string>>();
const tagSlugs = new Map<string, Set<string>>();
const totalBlogPages = new Map<string, number>();

function getPathWithoutLocale(pathname: string, lang: string) {
  if (lang === default_language && !default_language_in_subdir) {
    return pathname || "/";
  }

  const prefix = `/${lang}`;

  if (pathname === prefix) {
    return "/";
  }

  if (pathname.startsWith(`${prefix}/`)) {
    return pathname.slice(prefix.length);
  }

  return pathname || "/";
}

function normalizePath(pathname: string) {
  if (pathname !== "/" && pathname.endsWith("/")) {
    return pathname.slice(0, -1);
  }

  return pathname || "/";
}

async function getBlogSlugs(lang: string) {
  if (!blogPostSlugs.has(lang)) {
    const posts = await getSinglePage(BLOG_FOLDER, lang);
    blogPostSlugs.set(
      lang,
      new Set(posts.map((post) => stripLocaleFromId(post.id))),
    );
    totalBlogPages.set(lang, Math.ceil(posts.length / PAGE_SIZE) || 1);
  }

  return blogPostSlugs.get(lang)!;
}

async function getPageSlugs(lang: string) {
  if (!regularPageSlugs.has(lang)) {
    const pages = await getSinglePage("pages", lang);
    regularPageSlugs.set(
      lang,
      new Set(pages.map((page) => stripLocaleFromId(page.id))),
    );
  }

  return regularPageSlugs.get(lang)!;
}

async function getAlternativeSlugs(lang: string) {
  if (!alternativeSlugs.has(lang)) {
    const alternatives = await getSinglePage(ALTERNATIVES_FOLDER, lang);
    alternativeSlugs.set(
      lang,
      new Set(
        alternatives.map((alternative) => stripLocaleFromId(alternative.id)),
      ),
    );
  }

  return alternativeSlugs.get(lang)!;
}

async function getAudienceSlugs(lang: string) {
  if (!audienceSlugs.has(lang)) {
    const audiences = await getSinglePage(AUDIENCES_FOLDER, lang);
    audienceSlugs.set(
      lang,
      new Set(audiences.map((audience) => stripLocaleFromId(audience.id))),
    );
  }

  return audienceSlugs.get(lang)!;
}

async function getAuthorSlugs(lang: string) {
  if (!authorSlugs.has(lang)) {
    const authors = await getSinglePage("authors", lang);
    authorSlugs.set(
      lang,
      new Set(authors.map((author) => stripLocaleFromId(author.id))),
    );
  }

  return authorSlugs.get(lang)!;
}

async function getCategorySlugs(lang: string) {
  if (!categorySlugs.has(lang)) {
    categorySlugs.set(
      lang,
      new Set(await getTaxonomy(BLOG_FOLDER, lang, "categories")),
    );
  }

  return categorySlugs.get(lang)!;
}

async function getTagSlugs(lang: string) {
  if (!tagSlugs.has(lang)) {
    tagSlugs.set(lang, new Set(await getTaxonomy(BLOG_FOLDER, lang, "tags")));
  }

  return tagSlugs.get(lang)!;
}

async function resolveAlternateForLang(basePath: string, targetLang: string) {
  const normalizedLang = normalizeLang(targetLang);

  if (
    basePath === "/" ||
    basePath === "/about" ||
    basePath === "/alternatives" ||
    basePath === "/blog" ||
    basePath === "/contact" ||
    basePath === "/authors" ||
    basePath === "/categories" ||
    basePath === "/for" ||
    basePath === "/tags"
  ) {
    return slugSelector(basePath, normalizedLang);
  }

  const alternativeMatch = basePath.match(/^\/alternatives\/([^/]+)$/);
  if (alternativeMatch) {
    const slug = alternativeMatch[1];
    const slugs = await getAlternativeSlugs(normalizedLang);
    return slugs.has(slug)
      ? alternativePath(slug, normalizedLang)
      : alternativesIndexPath(normalizedLang);
  }

  const archiveMatch = basePath.match(/^\/blog\/page\/(\d+)$/);
  if (archiveMatch) {
    const pageNumber = Number(archiveMatch[1]);
    await getBlogSlugs(normalizedLang);
    const totalPages = totalBlogPages.get(normalizedLang) || 1;

    if (pageNumber >= 2 && pageNumber <= totalPages) {
      return slugSelector(`/blog/page/${pageNumber}`, normalizedLang);
    }

    return undefined;
  }

  const blogPostMatch = basePath.match(/^\/blog\/([^/]+)$/);
  if (blogPostMatch) {
    const slug = blogPostMatch[1];
    const slugs = await getBlogSlugs(normalizedLang);
    return slugs.has(slug)
      ? blogPostPath(slug, normalizedLang)
      : slugSelector("/blog", normalizedLang);
  }

  const audienceMatch = basePath.match(/^\/for\/([^/]+)$/);
  if (audienceMatch) {
    const slug = audienceMatch[1];
    const slugs = await getAudienceSlugs(normalizedLang);
    return slugs.has(slug)
      ? audiencePath(slug, normalizedLang)
      : audiencesIndexPath(normalizedLang);
  }

  const authorMatch = basePath.match(/^\/authors\/([^/]+)$/);
  if (authorMatch) {
    const slug = authorMatch[1];
    const slugs = await getAuthorSlugs(normalizedLang);

    if (slugs.has(slug)) {
      return slugSelector(`/authors/${slug}`, normalizedLang);
    }

    return undefined;
  }

  const categoryMatch = basePath.match(/^\/categories\/([^/]+)$/);
  if (categoryMatch) {
    const slug = categoryMatch[1];
    const slugs = await getCategorySlugs(normalizedLang);

    if (slugs.has(slug)) {
      return slugSelector(`/categories/${slug}`, normalizedLang);
    }

    return undefined;
  }

  const tagMatch = basePath.match(/^\/tags\/([^/]+)$/);
  if (tagMatch) {
    const slug = tagMatch[1];
    const slugs = await getTagSlugs(normalizedLang);

    if (slugs.has(slug)) {
      return slugSelector(`/tags/${slug}`, normalizedLang);
    }

    return undefined;
  }

  const regularPageMatch = basePath.match(/^\/([^/]+)$/);
  if (regularPageMatch) {
    const slug = regularPageMatch[1];
    const slugs = await getPageSlugs(normalizedLang);

    if (slugs.has(slug)) {
      return slugSelector(`/${slug}`, normalizedLang);
    }
  }

  return undefined;
}

export type LocaleAlternates = {
  logicalPath: string;
  alternates: Record<string, string>;
  defaultPath?: string;
};

export async function getLocaleAlternates(
  pathname: string,
): Promise<LocaleAlternates> {
  const currentLang = getLangFromUrl(new URL(pathname, "https://example.com"));
  const logicalPath = normalizePath(
    getPathWithoutLocale(pathname, currentLang),
  );
  const alternates = Object.fromEntries(
    (
      await Promise.all(
        enabledLanguages.map(async ({ languageCode }) => {
          const path = await resolveAlternateForLang(logicalPath, languageCode);
          return path ? [languageCode, path] : undefined;
        }),
      )
    ).filter((entry): entry is [string, string] => Boolean(entry)),
  );

  return {
    logicalPath,
    alternates,
    defaultPath: alternates[default_language],
  };
}
