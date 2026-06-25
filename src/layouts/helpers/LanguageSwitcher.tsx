import { siteConfig } from "@/lib/siteConfig";
import { siteLanguages } from "@/lib/siteLanguages";
import React from "react";

const LanguageSwitcher = ({
  lang,
  switchTargets,
  externalLinks = [],
  wrapperClassName = "mr-5",
  selectClassName = "border-dark text-text-dark rounded-sm border bg-transparent py-1 focus:border-dark focus:ring-0 dark:border-darkmode-primary dark:text-white dark:focus:border-darkmode-primary",
}: {
  lang: string;
  switchTargets: Record<string, string>;
  externalLinks?: {
    languageCode: string;
    languageName: string;
    url: string;
  }[];
  wrapperClassName?: string;
  selectClassName?: string;
}) => {
  const { default_language, disable_languages } = siteConfig.settings;
  const disabledLanguages = disable_languages as string[];

  const sortedLanguages = siteLanguages
    .filter(({ languageCode }) => !disabledLanguages.includes(languageCode))
    .sort((a, b) => a.weight - b.weight);
  const externalOptions = externalLinks.filter(
    ({ languageCode, url }) =>
      Boolean(url) &&
      !sortedLanguages.some((language) => language.languageCode === languageCode),
  );

  if (sortedLanguages.length + externalOptions.length < 2) {
    return null;
  }

  return (
    <div className={wrapperClassName}>
      <select
        className={selectClassName}
        onChange={(event) => {
          const selectedLang = event.target.value;

          if (selectedLang.startsWith("external:")) {
            const target = externalOptions.find(
              ({ languageCode }) =>
                selectedLang === `external:${languageCode}`,
            );

            if (target?.url) {
              window.location.href = target.url;
            }

            return;
          }

          window.location.href =
            switchTargets[selectedLang] || switchTargets[default_language] || "/";
        }}
        value={lang}
      >
        {sortedLanguages.map((language) => (
          <option
            className="dark:text-text-dark"
            key={language.languageCode}
            value={language.languageCode}
          >
            {language.languageName}
          </option>
        ))}
        {externalOptions.map((language) => (
          <option
            className="dark:text-text-dark"
            key={language.languageCode}
            value={`external:${language.languageCode}`}
          >
            {language.languageName}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LanguageSwitcher;
