import fs from "node:fs";
import path from "node:path";
import { resolveSite } from "./siteResolver.js";

const selectedSite = resolveSite();
const config = JSON.parse(
  fs.readFileSync(path.join(selectedSite.configDir, "config.json"), "utf8"),
);
const rawBasePath = config.site?.base_path || "/";
const basePath = rawBasePath.startsWith("/") ? rawBasePath : `/${rawBasePath}`;
const mountPath =
  basePath !== "/" && basePath.endsWith("/") ? basePath.slice(0, -1) : basePath;

if (mountPath === "/") {
  process.exit(0);
}

const distDir = path.join(selectedSite.projectRoot, "dist");

if (!fs.existsSync(distDir)) {
  throw new Error("dist folder not found. Run astro build before mounting.");
}

const tempDir = path.join(
  selectedSite.projectRoot,
  `.dist-base-mount-${process.pid}`,
);
fs.mkdirSync(tempDir);

for (const entry of fs.readdirSync(distDir)) {
  fs.renameSync(path.join(distDir, entry), path.join(tempDir, entry));
}

const mountDir = path.join(distDir, mountPath.slice(1));
fs.mkdirSync(mountDir, { recursive: true });

for (const entry of fs.readdirSync(tempDir)) {
  fs.renameSync(path.join(tempDir, entry), path.join(mountDir, entry));
}

fs.rmdirSync(tempDir);

console.log(`Mounted static output under dist${mountPath}`);

