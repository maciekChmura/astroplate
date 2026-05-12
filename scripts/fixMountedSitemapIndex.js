import { existsSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");
const sitemapIndexPath = path.join(projectRoot, "dist", "sitemap-index.xml");

function normalizeMountPath(value) {
  const trimmed = value?.trim();

  if (!trimmed || trimmed === "/") {
    return "";
  }

  return `/${trimmed.replace(/^\/+|\/+$/g, "")}`;
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

const mountPath = normalizeMountPath(process.env.PUBLIC_SITE_MOUNT_PATH);
const siteUrl = process.env.PUBLIC_SITE_URL || process.env.SITE_URL;

if (!mountPath || !siteUrl || !existsSync(sitemapIndexPath)) {
  process.exit(0);
}

const publicOrigin = new URL(siteUrl).origin;
const current = readFileSync(sitemapIndexPath, "utf8");
const fixed = current.replace(
  new RegExp(`(<loc>)${escapeRegExp(publicOrigin)}/sitemap-`, "g"),
  `$1${publicOrigin}${mountPath}/sitemap-`,
);

if (fixed !== current) {
  writeFileSync(sitemapIndexPath, fixed);
  console.log(`✅ Sitemap index mounted at ${mountPath}`);
}
