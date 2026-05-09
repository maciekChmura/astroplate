import { siteConfig } from "@/lib/siteConfig";
import { getSinglePage } from "@/lib/contentParser.astro";
import { getTaxonomy } from "@/lib/taxonomyParser.astro";
import { blogPostPath } from "@/lib/utils/blogRoutes";
import { promptPath, promptsIndexPath } from "@/lib/utils/promptRoutes";
import { useCasePath, useCasesIndexPath } from "@/lib/utils/useCaseRoutes";
import {
  enabledLanguages,
  getLangFromUrl,
  normalizeLang,
  slugSelector,
  stripLocaleFromId,
} from "@/lib/utils/languageParser";

const BLOG_FOLDER = "blog";
const PROMPTS_FOLDER = "prompts";
const USE_CASES_FOLDER = "use-cases";
const PAGE_SIZE = siteConfig.settings.pagination;
const { default_language, default_language_in_subdir } = siteConfig.settings;

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

export async function getLocaleSwitchTargets(pathname: string) {
  const currentLang = getLangFromUrl(new URL(pathname, "https://example.com"));
  const basePath = normalizePath(getPathWithoutLocale(pathname, currentLang));

  const blogPostSlugs = new Map<string, Set<string>>();
  const promptSlugs = new Map<string, Set<string>>();
  const useCaseSlugs = new Map<string, Set<string>>();
  const regularPageSlugs = new Map<string, Set<string>>();
  const authorSlugs = new Map<string, Set<string>>();
  const categorySlugs = new Map<string, Set<string>>();
  const tagSlugs = new Map<string, Set<string>>();
  const totalBlogPages = new Map<string, number>();

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

  async function getPromptSlugs(lang: string) {
    if (!promptSlugs.has(lang)) {
      const prompts = await getSinglePage(PROMPTS_FOLDER, lang);
      promptSlugs.set(
        lang,
        new Set(prompts.map((prompt) => stripLocaleFromId(prompt.id))),
      );
    }

    return promptSlugs.get(lang)!;
  }

  async function getUseCaseSlugs(lang: string) {
    if (!useCaseSlugs.has(lang)) {
      const useCases = await getSinglePage(USE_CASES_FOLDER, lang);
      useCaseSlugs.set(
        lang,
        new Set(useCases.map((useCase) => stripLocaleFromId(useCase.id))),
      );
    }

    return useCaseSlugs.get(lang)!;
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

  async function resolveTargetForLang(targetLang: string) {
    const normalizedLang = normalizeLang(targetLang);

    if (basePath === "/") {
      return slugSelector("/", normalizedLang);
    }

    if (basePath === "/blog") {
      return slugSelector("/blog", normalizedLang);
    }

    const archiveMatch = basePath.match(/^\/blog\/page\/(\d+)$/);
    if (archiveMatch) {
      const pageNumber = Number(archiveMatch[1]);
      await getBlogSlugs(normalizedLang);
      const totalPages = totalBlogPages.get(normalizedLang) || 1;

      if (pageNumber <= totalPages) {
        return pageNumber === 1
          ? slugSelector("/blog", normalizedLang)
          : slugSelector(`/blog/page/${pageNumber}`, normalizedLang);
      }

      return slugSelector("/blog", normalizedLang);
    }

    const blogPostMatch = basePath.match(/^\/blog\/([^/]+)$/);
    if (blogPostMatch) {
      const slug = blogPostMatch[1];
      const slugs = await getBlogSlugs(normalizedLang);
      return slugs.has(slug)
        ? blogPostPath(slug, normalizedLang)
        : slugSelector("/blog", normalizedLang);
    }

    if (basePath === "/about" || basePath === "/contact") {
      return slugSelector(basePath, normalizedLang);
    }

    if (
      basePath === "/authors" ||
      basePath === "/categories" ||
      basePath === "/prompts" ||
      basePath === "/use-cases" ||
      basePath === "/tags"
    ) {
      return slugSelector(basePath, normalizedLang);
    }

    const useCaseMatch = basePath.match(/^\/use-cases\/([^/]+)$/);
    if (useCaseMatch) {
      const slug = useCaseMatch[1];
      const slugs = await getUseCaseSlugs(normalizedLang);
      return slugs.has(slug)
        ? useCasePath(slug, normalizedLang)
        : useCasesIndexPath(normalizedLang);
    }

    const promptMatch = basePath.match(/^\/prompts\/([^/]+)$/);
    if (promptMatch) {
      const slug = promptMatch[1];
      const slugs = await getPromptSlugs(normalizedLang);
      return slugs.has(slug)
        ? promptPath(slug, normalizedLang)
        : promptsIndexPath(normalizedLang);
    }

    const authorMatch = basePath.match(/^\/authors\/([^/]+)$/);
    if (authorMatch) {
      const slug = authorMatch[1];
      const slugs = await getAuthorSlugs(normalizedLang);
      return slugs.has(slug)
        ? slugSelector(`/authors/${slug}`, normalizedLang)
        : slugSelector("/authors", normalizedLang);
    }

    const categoryMatch = basePath.match(/^\/categories\/([^/]+)$/);
    if (categoryMatch) {
      const slug = categoryMatch[1];
      const slugs = await getCategorySlugs(normalizedLang);
      return slugs.has(slug)
        ? slugSelector(`/categories/${slug}`, normalizedLang)
        : slugSelector("/categories", normalizedLang);
    }

    const tagMatch = basePath.match(/^\/tags\/([^/]+)$/);
    if (tagMatch) {
      const slug = tagMatch[1];
      const slugs = await getTagSlugs(normalizedLang);
      return slugs.has(slug)
        ? slugSelector(`/tags/${slug}`, normalizedLang)
        : slugSelector("/tags", normalizedLang);
    }

    const regularPageMatch = basePath.match(/^\/([^/]+)$/);
    if (regularPageMatch) {
      const slug = regularPageMatch[1];
      const pageSlugs = await getPageSlugs(normalizedLang);
      return pageSlugs.has(slug)
        ? slugSelector(`/${slug}`, normalizedLang)
        : slugSelector("/", normalizedLang);
    }

    return slugSelector("/", normalizedLang);
  }

  const targets = Object.fromEntries(
    await Promise.all(
      enabledLanguages.map(async ({ languageCode }) => [
        languageCode,
        await resolveTargetForLang(languageCode),
      ]),
    ),
  );

  return targets as Record<string, string>;
}
