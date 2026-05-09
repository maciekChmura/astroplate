import { slugSelector } from "@/lib/utils/languageParser";

export const USE_CASES_CONTENT_FOLDER = "use-cases";

export function useCasePath(useCaseSlug: string, lang?: string) {
  return slugSelector(`/use-cases/${useCaseSlug}`, lang);
}

export function useCasesIndexPath(lang?: string) {
  return slugSelector("/use-cases", lang);
}
