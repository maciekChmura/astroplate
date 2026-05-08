import { slugSelector } from "@/lib/utils/languageParser";

export const PROMPTS_CONTENT_FOLDER = "prompts";

export function promptPath(promptSlug: string, lang?: string) {
  return slugSelector(`/prompts/${promptSlug}`, lang);
}

export function promptsIndexPath(lang?: string) {
  return slugSelector("/prompts", lang);
}
