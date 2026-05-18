import { siteConfig } from "@/lib/siteConfig";
import { withSiteMountPath } from "@/lib/utils/mountPath";

const quickArchVizSitemaps: Record<string, string> = {
  en: "https://quickarchviz.com/knowledge-hub/sitemap-index.xml",
  pl: "https://quickarchviz.com/pl/knowledge-hub/sitemap-index.xml",
};

function getSitemapUrl(site?: URL) {
  const defaultLanguage = siteConfig.settings.default_language;

  if (
    siteConfig.site.title === "QuickArchViz" &&
    defaultLanguage in quickArchVizSitemaps
  ) {
    return quickArchVizSitemaps[defaultLanguage];
  }

  const siteUrl = site || new URL("http://localhost:4321/");
  return new URL(withSiteMountPath("/sitemap-index.xml"), siteUrl).toString();
}

export function GET({ site }: { site?: URL }) {
  const sitemapUrl = getSitemapUrl(site);

  return new Response(
    [
      "User-agent: *",
      "Allow: /",
      "",
      "Disallow: /api/*",
      "",
      `Sitemap: ${sitemapUrl}`,
      "",
    ].join("\n"),
    {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
      },
    },
  );
}
