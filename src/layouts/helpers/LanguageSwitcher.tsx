import { siteConfig } from "@/lib/siteConfig";
import { siteLanguages } from "@/lib/siteLanguages";
import React, { useEffect, useRef, useState } from "react";

const LanguageSwitcher = ({
  lang,
  switchTargets,
  externalLinks = [],
  wrapperClassName = "mr-5",
  selectClassName = "border-dark text-text-dark rounded-sm border bg-transparent py-1 focus:border-dark focus:ring-0 dark:border-darkmode-primary dark:text-white dark:focus:border-darkmode-primary",
  variant = "select",
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
  variant?: "select" | "menu";
}) => {
  const { default_language, disable_languages } = siteConfig.settings;
  const disabledLanguages = disable_languages as string[];
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const sortedLanguages = siteLanguages
    .filter(({ languageCode }) => !disabledLanguages.includes(languageCode))
    .sort((a, b) => a.weight - b.weight);
  const externalOptions = externalLinks.filter(
    ({ languageCode, url }) =>
      Boolean(url) &&
      !sortedLanguages.some((language) => language.languageCode === languageCode),
  );

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, []);

  if (sortedLanguages.length + externalOptions.length < 2) {
    return null;
  }

  const languageOptions = [
    ...sortedLanguages.map((language) => ({
      languageCode: language.languageCode,
      languageName: language.languageName,
      value: language.languageCode,
      url: switchTargets[language.languageCode],
    })),
    ...externalOptions.map((language) => ({
      languageCode: language.languageCode,
      languageName: language.languageName,
      value: `external:${language.languageCode}`,
      url: language.url,
    })),
  ];
  const activeLanguage =
    languageOptions.find((language) => language.languageCode === lang) ||
    languageOptions.find((language) => language.languageCode === default_language) ||
    languageOptions[0];
  const goToLanguage = (value: string) => {
    if (value.startsWith("external:")) {
      const target = externalOptions.find(
        ({ languageCode }) => value === `external:${languageCode}`,
      );

      if (target?.url) {
        window.location.href = target.url;
      }

      return;
    }

    window.location.href =
      switchTargets[value] || switchTargets[default_language] || "/";
  };

  if (variant === "menu") {
    return (
      <div className={wrapperClassName} ref={menuRef}>
        <button
          type="button"
          className="inline-flex min-h-12 items-center gap-3 rounded-full border border-slate-300 bg-white px-7 text-base font-bold text-slate-950 shadow-sm transition hover:border-slate-400 hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-400 dark:border-darkmode-border dark:bg-darkmode-body dark:text-white dark:hover:bg-darkmode-light"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          onClick={() => setIsOpen((current) => !current)}
        >
          {activeLanguage.languageName}
          <span
            aria-hidden="true"
            className={`inline-block h-2 w-2 rotate-45 border-b-2 border-r-2 border-current transition ${
              isOpen ? "-translate-y-0.5 rotate-[225deg]" : "-translate-y-1"
            }`}
          />
        </button>

        {isOpen && (
          <div
            className="absolute left-0 top-[calc(100%+0.75rem)] z-50 w-64 overflow-hidden rounded-lg border border-slate-200 bg-white py-3 shadow-xl dark:border-darkmode-border dark:bg-darkmode-body"
            role="listbox"
          >
            {languageOptions.map((language) => {
              const isActive = language.languageCode === lang;

              return (
                <button
                  type="button"
                  key={language.value}
                  role="option"
                  aria-selected={isActive}
                  className="flex w-full items-center gap-4 px-5 py-3 text-left text-base font-medium text-slate-950 transition hover:bg-slate-50 dark:text-white dark:hover:bg-darkmode-light"
                  onClick={() => goToLanguage(language.value)}
                >
                  <span
                    aria-hidden="true"
                    className="flex h-5 w-5 items-center justify-center text-slate-500 dark:text-darkmode-text"
                  >
                    {isActive ? "✓" : ""}
                  </span>
                  {language.languageName}
                </button>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={wrapperClassName}>
      <select
        className={selectClassName}
        onChange={(event) => {
          goToLanguage(event.target.value);
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
