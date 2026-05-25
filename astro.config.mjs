import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import AutoImport from "astro-auto-import";
import { defineConfig, fontProviders } from "astro/config";
import { readFileSync } from "node:fs";
import path from "node:path";
import remarkCollapse from "remark-collapse";
import remarkToc from "remark-toc";
import sharp from "sharp";
import { resolveSite } from "./scripts/siteResolver.js";
import {
  LOCALHOST_SITE_URL,
  resolveSiteUrl,
} from "./scripts/siteUrlResolver.js";

const selectedSite = resolveSite();
const readSiteJson = (filename) =>
  JSON.parse(readFileSync(path.join(selectedSite.configDir, filename), "utf8"));
const config = readSiteJson("config.json");
const theme = readSiteJson("theme.json");
const languages = JSON.parse(
  readFileSync(path.join(selectedSite.configDir, "language.json"), "utf8"),
);

const shouldRequireProductionSiteUrl =
  process.env.REQUIRE_PRODUCTION_SITE_URL === "true" ||
  process.argv.includes("build");
const resolvedSiteUrl = resolveSiteUrl({
  env: process.env,
  fallbackSiteUrl: LOCALHOST_SITE_URL,
  production: shouldRequireProductionSiteUrl,
  allowConfigSiteUrl: false,
});
const siteMountPath = normalizeMountPath(process.env.PUBLIC_SITE_MOUNT_PATH);
const quickArchVizHubRoutePrefixes = [
  "/authors",
  "/blog",
  "/categories",
  "/for",
  "/knowledge-hub",
  "/privacy-policy",
  "/prompts",
  "/tags",
  "/use-cases",
];
const quickArchVizExcludedHubRoutes = new Set([
  "/use-cases/przeglad-bryly-elewacji-na-spotkanie-z-klientem",
]);
const isQuickArchVizContentDeploy = selectedSite.id.startsWith("quickarchviz-");

const enabledLocales = languages
  .map(({ languageCode }) => languageCode)
  .filter(
    (languageCode) => !config.settings.disable_languages.includes(languageCode),
  );

// Helper to parse font string format: "FontName:wght@400;500;600;700"
function parseFontString(fontStr) {
  const [name, weightPart] = fontStr.split(":");
  let weights = [400]; // default weight

  if (weightPart) {
    // Extract weights from wght@400;500;600 format
    const weightMatch = weightPart.match(/wght@?([\d;]+)/);
    if (weightMatch) {
      weights = weightMatch[1].split(";").map((w) => parseInt(w, 10));
    }
  }

  // remove + from font name and add space
  const cleanName = name.replace(/\+/g, " ");
  return { name: cleanName, weights };
}

function normalizeMountPath(value) {
  const trimmed = value?.trim();

  if (!trimmed || trimmed === "/") {
    return "";
  }

  return `/${trimmed.replace(/^\/+|\/+$/g, "")}`;
}

function withSiteMountUrl(url) {
  if (!siteMountPath) {
    return url;
  }

  const parsedUrl = new URL(url);

  if (
    parsedUrl.pathname === siteMountPath ||
    parsedUrl.pathname.startsWith(`${siteMountPath}/`)
  ) {
    return parsedUrl.toString();
  }

  parsedUrl.pathname =
    parsedUrl.pathname === "/"
      ? siteMountPath
      : `${siteMountPath}${parsedUrl.pathname}`;

  return parsedUrl.toString();
}

function normalizePathname(pathname) {
  return pathname.length > 1 ? pathname.replace(/\/+$/g, "") : pathname || "/";
}

function isQuickArchVizHubRoute(pathname) {
  const normalizedPathname = normalizePathname(pathname);

  if (quickArchVizExcludedHubRoutes.has(normalizedPathname)) {
    return false;
  }

  return quickArchVizHubRoutePrefixes.some(
    (prefix) =>
      normalizedPathname === prefix ||
      normalizedPathname.startsWith(`${prefix}/`),
  );
}

// Build fonts configuration from theme.json
const fontSubsets = theme.fonts.font_subsets || ["latin"];
const fontsConfig = Object.entries(theme.fonts.font_family)
  .filter(([key]) => !key.includes("_type")) // Filter out type entries
  .map(([key, fontStr]) => {
    const { name, weights } = parseFontString(fontStr);
    const typeKey = `${key}_type`;
    const fallback = theme.fonts.font_family[typeKey] || "sans-serif";

    return {
      name,
      cssVariable: `--font-${key}`,
      provider: fontProviders.google(),
      weights,
      subsets: fontSubsets,
      display: "swap",
      fallbacks: [fallback],
    };
  });

// https://astro.build/config
export default defineConfig({
  site: resolvedSiteUrl,
  base: config.site.base_path ? config.site.base_path : "/",
  trailingSlash: config.site.trailing_slash ? "always" : "never",
  i18n: {
    locales: enabledLocales,
    defaultLocale: config.settings.default_language,
    routing: {
      prefixDefaultLocale: config.settings.default_language_in_subdir,
    },
  },
  image: { service: sharp() },
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        "@site": selectedSite.siteDir,
      },
    },
  },
  fonts: fontsConfig,
  integrations: [
    react(),
    sitemap({
      filter(page) {
        if (!isQuickArchVizContentDeploy) {
          return true;
        }

        return isQuickArchVizHubRoute(new URL(page).pathname);
      },
      serialize(item) {
        return {
          ...item,
          url: withSiteMountUrl(item.url),
        };
      },
    }),
    AutoImport({
      imports: [
        "@/shortcodes/Button",
        "@/shortcodes/Accordion",
        "@/shortcodes/Notice",
        "@/shortcodes/Video",
        "@/shortcodes/Youtube",
        "@/shortcodes/Tabs",
        "@/shortcodes/Tab",
      ],
    }),
    mdx(),
  ],
  markdown: {
    remarkPlugins: [remarkToc, [remarkCollapse, { test: "Table of contents" }]],
    shikiConfig: { theme: "one-dark-pro", wrap: true },
  },
});
