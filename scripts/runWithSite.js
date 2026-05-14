import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { resolveSite, stripSiteArgs } from "./siteResolver.js";
import { assertProductionSiteUrl } from "./siteUrlResolver.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");
const npmCommand = process.platform === "win32" ? "npm.cmd" : "npm";
const argv = process.argv.slice(2);
const command = argv[0];
const commandArgs = stripSiteArgs(argv.slice(1));
const site = resolveSite({ argv: argv.slice(1) });

function run(executable, args, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(executable, args, {
      cwd: projectRoot,
      env: {
        ...process.env,
        SITE_ID: site.id,
      },
      stdio: "inherit",
      shell: false,
      ...options,
    });

    child.on("error", reject);
    child.on("exit", (code, signal) => {
      if (code === 0) {
        resolve();
        return;
      }

      reject(
        new Error(
          signal
            ? `${executable} ${args.join(" ")} exited with ${signal}`
            : `${executable} ${args.join(" ")} exited with code ${code}`,
        ),
      );
    });
  });
}

async function runAstro(args) {
  await run(npmCommand, ["exec", "astro", "--", ...args]);
}

async function runWrangler(args) {
  await run(npmCommand, ["exec", "wrangler", "--", ...args]);
}

async function runBuild(extraAstroArgs = [], commandLabel = "npm run build") {
  assertProductionSiteUrl(process.env, commandLabel);
  process.env.REQUIRE_PRODUCTION_SITE_URL = "true";

  await run(process.execPath, ["scripts/themeGenerator.js"]);
  await run(process.execPath, ["scripts/jsonGenerator.js"]);
  await runAstro(["build", ...extraAstroArgs]);
  await run(process.execPath, ["scripts/fixMountedSitemapIndex.js"]);
  await run(process.execPath, ["scripts/llmsGenerator.js"]);
}

async function runDev() {
  const themeWatcher = spawn(
    process.execPath,
    ["scripts/themeGenerator.js", "--watch"],
    {
      cwd: projectRoot,
      env: {
        ...process.env,
        SITE_ID: site.id,
      },
      stdio: "inherit",
    },
  );

  const stopWatcher = () => {
    if (!themeWatcher.killed) {
      themeWatcher.kill();
    }
  };

  process.on("SIGINT", stopWatcher);
  process.on("SIGTERM", stopWatcher);

  try {
    await run(process.execPath, ["scripts/jsonGenerator.js"]);
    await runAstro(["dev", ...commandArgs]);
  } finally {
    stopWatcher();
  }
}

async function main() {
  console.log(`Using site: ${site.id}`);

  switch (command) {
    case "dev":
      await runDev();
      break;
    case "build":
      await runBuild(commandArgs, "npm run build");
      break;
    case "check":
      await run(process.execPath, ["scripts/themeGenerator.js"]);
      await run(process.execPath, ["scripts/jsonGenerator.js"]);
      await runAstro(["check", ...commandArgs]);
      break;
    case "preview":
      await runAstro(["preview", ...commandArgs]);
      break;
    case "generate-json":
      await run(process.execPath, ["scripts/jsonGenerator.js"]);
      break;
    case "generate-llms":
      await run(process.execPath, ["scripts/llmsGenerator.js"]);
      break;
    case "remove-darkmode":
      await run(process.execPath, ["scripts/removeDarkmode.js"]);
      await run(npmCommand, ["run", "format"]);
      break;
    case "preview:cf-pages":
      await runBuild([], "npm run preview:cf-pages");
      await runWrangler(["pages", "dev", "dist", ...commandArgs]);
      break;
    case "deploy:cf-workers":
      await runBuild([], "npm run deploy:cf-workers");
      await runWrangler([
        "deploy",
        "--config",
        "wrangler.cf-workers.jsonc",
        ...commandArgs,
      ]);
      break;
    case "preview:cf-workers":
      await runBuild([], "npm run preview:cf-workers");
      await runWrangler([
        "dev",
        "--config",
        "wrangler.cf-workers.jsonc",
        ...commandArgs,
      ]);
      break;
    default:
      throw new Error(`Unknown command "${command}"`);
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
