import { slugSelector } from "@/lib/utils/languageParser";

export const ALTERNATIVES_CONTENT_FOLDER = "alternatives";

export function alternativePath(alternativeSlug: string, lang?: string) {
  return slugSelector(`/alternatives/${alternativeSlug}`, lang);
}

export function alternativesIndexPath(lang?: string) {
  return slugSelector("/alternatives", lang);
}
