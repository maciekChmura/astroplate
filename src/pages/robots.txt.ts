import { withSiteMountPath } from "@/lib/utils/mountPath";

export function GET({ site }: { site?: URL }) {
  const siteUrl = site || new URL("http://localhost:4321/");
  const sitemapUrl = new URL(
    withSiteMountPath("/sitemap-index.xml"),
    siteUrl,
  ).toString();

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
