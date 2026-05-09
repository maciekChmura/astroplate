import { slugSelector } from "@/lib/utils/languageParser";

export const BLOG_CONTENT_FOLDER = "blog";

export function blogPostPath(postSlug: string, lang?: string) {
  return slugSelector(`/blog/${postSlug}`, lang);
}

export function blogArchivePath(lang?: string) {
  return slugSelector("/blog", lang);
}
