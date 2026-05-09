import { stripLocaleFromId } from "@/lib/utils/languageParser";

const RESERVED_BLOG_SLUGS = new Set(["page"]);

export function assertAvailableBlogSlugs(
  lang: string,
  posts: { id: string }[],
) {
  const seenPostSlugs = new Set<string>();

  for (const post of posts) {
    const postSlug = stripLocaleFromId(post.id);

    if (RESERVED_BLOG_SLUGS.has(postSlug)) {
      throw new Error(
        `Blog post slug "${postSlug}" for language "${lang}" conflicts with an existing blog route. Rename the Markdown file in content/blog.`,
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
