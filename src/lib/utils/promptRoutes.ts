import { slugSelector } from "@/lib/utils/languageParser";

export const PROMPTS_CONTENT_FOLDER = "prompts";

const promptsBasePath = "/prompts";

export function promptPath(promptSlug: string, lang?: string) {
  return slugSelector(`${promptsBasePath}/${promptSlug}`, lang);
}

export function promptsIndexPath(lang?: string) {
  return slugSelector(promptsBasePath, lang);
}
