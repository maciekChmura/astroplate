type PromptEntry = {
  id: string;
  data: {
    title: string;
    use_case?: string;
    best_for?: string;
  };
};

type PromptCopy = {
  title: string;
  useCase?: string;
  bestFor?: string;
};

const polishPromptCopy: Record<string, PromptCopy> = {
  "ai-brand-visibility-audit-prompt": {
    title: "Prompt do audytu widoczności marki w AI",
    useCase:
      "Sprawdź, czy asystenci AI rozumieją, wspominają, porównują i rekomendują Twoją markę.",
    bestFor:
      "Founderzy, CMO, zespoły SEO, konsultanci GEO, agencje i marki B2B rozpoczynające audyt widoczności w AI.",
  },
  "why-chatgpt-is-not-mentioning-my-brand": {
    title: "Dlaczego ChatGPT nie wspomina o mojej marce",
    useCase:
      "Zidentyfikuj, dlaczego Twoja marka nie pojawia się w rekomendacjach generowanych przez AI.",
    bestFor:
      "Marki, które są pomijane, niedostatecznie reprezentowane lub zastępowane konkurencją w odpowiedziach AI.",
  },
  "ai-competitor-visibility-gap-prompt": {
    title: "Prompt do analizy luki widoczności konkurencji w AI",
    useCase:
      "Zrozum, dlaczego asystenci AI rekomendują konkurencję zamiast Twojej marki.",
    bestFor:
      "Firmy B2B, marki SaaS, agencje, usługodawcy i lokalne biznesy walczące o rekomendacje AI.",
  },
  "ai-share-of-voice-tracking-prompt": {
    title: "Prompt do monitorowania AI Share of Voice",
    useCase:
      "Wygeneruj powtarzalny zestaw promptów do mierzenia obecności marki względem konkurencji.",
    bestFor:
      "Zespoły marketingu i agencje, które monitorują widoczność AI w czasie.",
  },
  "ai-buyer-intent-prompt-generator": {
    title: "Generator promptów intencji zakupowych AI",
    useCase:
      "Wygeneruj realistyczne pytania kupujących i sprawdź, gdzie Twoja marka powinna się pojawiać.",
    bestFor:
      "Stratedzy contentu, zespoły sprzedaży, SEO, product marketing i founderzy łączący widoczność AI z intencją zakupową.",
  },
  "ai-answer-accuracy-evaluation-prompt": {
    title: "Prompt do oceny dokładności odpowiedzi AI",
    useCase:
      "Oceń, czy odpowiedź AI o Twojej marce jest dokładna, użyteczna i pomaga sprzedażowo.",
    bestFor:
      "Marki dbające o reputację, dokładność, compliance i interpretację przez kupujących.",
  },
  "ai-content-gap-analysis-prompt": {
    title: "Prompt do analizy luk contentowych pod AI Search",
    useCase:
      "Znajdź braki w treściach, które utrudniają AI zrozumienie i rekomendowanie Twojej marki.",
    bestFor:
      "Zespoły SEO, content, konsultanci GEO i agencje planujące treści przyjazne AI.",
  },
  "geo-content-roadmap-prompt": {
    title: "Prompt do roadmapy treści GEO",
    useCase:
      "Zbuduj 30/60/90-dniową roadmapę treści poprawiającą widoczność w AI.",
    bestFor:
      "Zespoły, które potrzebują praktycznego planu publikacji zamiast ogólnej listy pomysłów.",
  },
  "ai-friendly-faq-prompt": {
    title: "Prompt do FAQ przyjaznego AI",
    useCase:
      "Stwórz sekcje FAQ użyteczne dla kupujących i łatwe do wyciągnięcia przez systemy AI.",
    bestFor:
      "Marki, które chcą ułatwić kupującym i asystentom AI zrozumienie strony.",
  },
  "ai-brand-entity-profile-prompt": {
    title: "Prompt do profilu encji marki w AI",
    useCase: "Stwórz jasny, czytelny dla AI profil encji Twojej marki.",
    bestFor:
      "Marki poprawiające jasność encji, spójność knowledge graph i pozycjonowanie czytelne dla AI.",
  },
  "competitor-alternatives-page-brief": {
    title: "Prompt do briefu strony alternatyw konkurenta",
    useCase:
      "Przygotuj uczciwy i użyteczny brief strony „najlepsze alternatywy dla [konkurenta]”.",
    bestFor:
      "SaaS, agencje, konsultanci i usługodawcy konkurujący z bardziej rozpoznawalnymi markami.",
  },
  "ai-reputation-risk-scanner": {
    title: "Skaner ryzyka reputacyjnego w AI",
    useCase:
      "Wykryj, jak AI może błędnie przedstawiać, pomijać lub negatywnie opisywać Twoją markę.",
    bestFor:
      "Marki w kategoriach wrażliwych, konkurencyjnych, regulowanych albo opartych na zaufaniu.",
  },
  "ceo-ai-visibility-summary-prompt": {
    title: "Prompt do podsumowania widoczności AI dla CEO",
    useCase: "Zamień audyt widoczności AI w krótkie podsumowanie dla zarządu.",
    bestFor:
      "Konsultanci, agencje, CMO i zespoły wewnętrzne szukające akceptacji liderów.",
  },
  "ai-visibility-audit-proposal-template": {
    title: "Template oferty audytu widoczności AI",
    useCase: "Stwórz gotową propozycję audytu widoczności AI dla klienta.",
    bestFor:
      "Agencje, konsultanci, specjaliści SEO, doradcy GEO i dostawcy usług marketingowych.",
  },
  "monthly-ai-visibility-monitoring-pack": {
    title: "Miesięczny pakiet promptów do monitoringu AI",
    useCase: "Stwórz powtarzalny miesięczny system monitoringu widoczności AI.",
    bestFor:
      "Marki i agencje, które chcą prowadzić stały monitoring widoczności w AI.",
  },
};

export const getAIBrandScanPromptSlug = (entry: Pick<PromptEntry, "id">) =>
  entry.id.split("/").pop() || "";

export const getAIBrandScanPromptCopy = (
  entry: PromptEntry,
  lang: string,
): PromptCopy => {
  const slug = getAIBrandScanPromptSlug(entry);
  const localized = lang === "pl" ? polishPromptCopy[slug] : undefined;

  return {
    title: localized?.title || entry.data.title,
    useCase: localized?.useCase || entry.data.use_case,
    bestFor: localized?.bestFor || entry.data.best_for,
  };
};
