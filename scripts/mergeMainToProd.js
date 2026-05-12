import { execFileSync } from "node:child_process";

function run(command, args, options = {}) {
  console.log(`$ ${command} ${args.join(" ")}`);
  return execFileSync(command, args, {
    encoding: "utf8",
    stdio: options.stdio || "inherit",
  });
}

function read(command, args) {
  return execFileSync(command, args, {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  }).trim();
}

function checkoutMain() {
  try {
    run("git", ["checkout", "main"]);
  } catch {
    console.error("Could not switch back to main. Check git status manually.");
  }
}

function abortMergeIfNeeded() {
  try {
    read("git", ["rev-parse", "-q", "--verify", "MERGE_HEAD"]);
    run("git", ["merge", "--abort"]);
  } catch {
    return;
  }
}

function assertCleanWorktree() {
  const status = read("git", ["status", "--porcelain"]);

  if (status) {
    throw new Error(
      "Your worktree is not clean. Commit or stash your changes before promoting main to prod.",
    );
  }
}

try {
  read("git", ["rev-parse", "--is-inside-work-tree"]);
  assertCleanWorktree();

  run("git", ["fetch", "origin", "main", "prod"]);

  run("git", ["checkout", "main"]);
  run("git", ["pull", "--ff-only", "origin", "main"]);

  run("git", ["checkout", "prod"]);
  run("git", ["pull", "--ff-only", "origin", "prod"]);
  run("git", ["merge", "--no-edit", "main"]);
  run("git", ["push", "origin", "prod"]);

  run("git", ["checkout", "main"]);

  console.log("✅ main merged into prod, prod pushed, and branch restored to main.");
} catch (error) {
  console.error(`\nPromotion failed: ${error.message}`);
  abortMergeIfNeeded();
  checkoutMain();
  process.exit(1);
}
