import { siteConfig } from "@/lib/siteConfig";
import {
  enabledLanguages,
  stripLocaleFromId,
} from "@/lib/utils/languageParser";

const RESERVED_ROOT_SLUGS = new Set([
  "404",
  "about",
  "authors",
  "blog",
  "categories",
  "contact",
  "page",
  "tags",
]);

function getRoutedLanguageCodes() {
  if (siteConfig.settings.default_language_in_subdir) {
    return enabledLanguages.map(({ languageCode }) => languageCode);
  }

  return enabledLanguages
    .map(({ languageCode }) => languageCode)
    .filter(
      (languageCode) => languageCode !== siteConfig.settings.default_language,
    );
}

export function assertAvailableBlogSlugs(
  lang: string,
  pages: { id: string }[],
  posts: { id: string }[],
) {
  const reservedSlugs = new Set([
    ...RESERVED_ROOT_SLUGS,
    ...getRoutedLanguageCodes(),
    ...pages.map((page) => stripLocaleFromId(page.id)),
  ]);
  const seenPostSlugs = new Set<string>();

  for (const post of posts) {
    const postSlug = stripLocaleFromId(post.id);

    if (reservedSlugs.has(postSlug)) {
      throw new Error(
        `Blog post slug "${postSlug}" for language "${lang}" conflicts with an existing root route. Rename the Markdown file in content/blog.`,
      );
    }

    if (seenPostSlugs.has(postSlug)) {
      throw new Error(
        `Duplicate blog post slug "${postSlug}" for language "${lang}". Rename one of the Markdown files in content/blog.`,
      );
    }

    seenPostSlugs.add(postSlug);
  }
}
