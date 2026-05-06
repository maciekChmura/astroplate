import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");
const DEFAULT_SITE_ID = "astroplate";
const currentSiteDir = path.join(projectRoot, "sites", "__current__");

function parseSiteArg(argv = process.argv.slice(2)) {
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];

    if (arg === "--site") {
      return argv[index + 1];
    }

    if (arg.startsWith("--site=")) {
      return arg.slice("--site=".length);
    }
  }

  return undefined;
}

export function stripSiteArgs(argv = process.argv.slice(2)) {
  const result = [];

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];

    if (arg === "--site") {
      index += 1;
      continue;
    }

    if (arg.startsWith("--site=")) {
      continue;
    }

    result.push(arg);
  }

  return result;
}

function validateSiteId(siteId) {
  if (!siteId || !/^[a-z0-9][a-z0-9-]*$/.test(siteId)) {
    throw new Error(
      `Invalid site id "${siteId}". Use lowercase letters, numbers, and hyphens.`,
    );
  }
}

function parseEnvValue(rawValue) {
  const value = rawValue.trim();

  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    return value.slice(1, -1);
  }

  return value;
}

function loadEnvFile(envPath) {
  if (!fs.existsSync(envPath)) {
    return;
  }

  const lines = fs.readFileSync(envPath, "utf8").split(/\r?\n/);

  for (const line of lines) {
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }

    const equalsIndex = trimmed.indexOf("=");

    if (equalsIndex === -1) {
      continue;
    }

    const key = trimmed.slice(0, equalsIndex).trim();
    const value = parseEnvValue(trimmed.slice(equalsIndex + 1));

    if (key && process.env[key] === undefined) {
      process.env[key] = value;
    }
  }
}

function ensureCurrentSiteLink(siteDir) {
  if (fs.existsSync(currentSiteDir)) {
    const stats = fs.lstatSync(currentSiteDir);

    if (!stats.isSymbolicLink()) {
      throw new Error(
        `${currentSiteDir} exists and is not a generated site symlink.`,
      );
    }

    const currentTarget = fs.realpathSync(currentSiteDir);
    const nextTarget = fs.realpathSync(siteDir);

    if (currentTarget === nextTarget) {
      return;
    }

    fs.unlinkSync(currentSiteDir);
  }

  fs.symlinkSync(siteDir, currentSiteDir, "dir");
}

export function resolveSite(options = {}) {
  const shouldLoadEnv = options.loadEnv !== false;
  const siteId =
    options.siteId ||
    parseSiteArg(options.argv) ||
    process.env.SITE_ID ||
    process.env.BLOG_ID ||
    DEFAULT_SITE_ID;

  validateSiteId(siteId);

  const siteDir = path.join(projectRoot, "sites", siteId);
  const configDir = path.join(siteDir, "config");
  const contentDir = path.join(siteDir, "content");
  const envPath = path.join(projectRoot, ".env.sites", `${siteId}.local`);

  if (!fs.existsSync(siteDir)) {
    throw new Error(`Site "${siteId}" not found at ${siteDir}`);
  }

  if (!fs.existsSync(configDir)) {
    throw new Error(`Site "${siteId}" is missing config at ${configDir}`);
  }

  if (!fs.existsSync(contentDir)) {
    throw new Error(`Site "${siteId}" is missing content at ${contentDir}`);
  }

  if (shouldLoadEnv) {
    loadEnvFile(envPath);
  }

  ensureCurrentSiteLink(siteDir);
  process.env.SITE_ID = siteId;

  return {
    id: siteId,
    projectRoot,
    siteDir,
    currentSiteDir,
    configDir,
    contentDir,
    envPath,
    publicImagesDir: path.join(projectRoot, "public", "sites", siteId, "images"),
    generatedThemePath: path.join(projectRoot, ".astro", "generated-theme.css"),
  };
}
