import { slugSelector } from "@/lib/utils/languageParser";
import { siteConfig } from "@/lib/siteConfig";

export const PROMPTS_CONTENT_FOLDER = "prompts";

const promptsBasePath =
  siteConfig.site.title === "AIBrandScan" ? "/prompt-library" : "/prompts";

export function promptPath(promptSlug: string, lang?: string) {
  return slugSelector(`${promptsBasePath}/${promptSlug}`, lang);
}

export function promptsIndexPath(lang?: string) {
  return slugSelector(promptsBasePath, lang);
}
