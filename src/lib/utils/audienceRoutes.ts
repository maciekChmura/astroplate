import { slugSelector } from "@/lib/utils/languageParser";

export const AUDIENCES_CONTENT_FOLDER = "for";

export function audiencePath(audienceSlug: string, lang?: string) {
  return slugSelector(`/for/${audienceSlug}`, lang);
}

export function audiencesIndexPath(lang?: string) {
  return slugSelector("/for", lang);
}
