// Build a disposable copy so Next never loads the developer's .env files.
import { cpSync, mkdtempSync, symlinkSync, readdirSync, existsSync, realpathSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { spawn } from "node:child_process";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const reuseIndex = process.argv.indexOf("--test-build");
const workspace = reuseIndex < 0
  ? mkdtempSync(join(tmpdir(), "aktivpal-verify-"))
  : realpathSync(process.argv[reuseIndex + 1]);
if (!workspace.startsWith(join(tmpdir(), "aktivpal-verify-")) || readdirSync(workspace).some((name) => name.startsWith(".env"))) {
  throw new Error("Verification requires a temporary directory without environment files");
}
if (reuseIndex < 0) {
for (const entry of ["src", "public", "package.json", "next.config.js", "jsconfig.json", "postcss.config.js", "tailwind.config.js"]) {
  cpSync(join(root, entry), join(workspace, entry), { recursive: true });
}
symlinkSync(join(root, "node_modules"), join(workspace, "node_modules"), "dir");
} else if (!existsSync(join(workspace, ".next/BUILD_ID"))) {
  throw new Error("No completed isolated build at this path");
}
const env = {
  PATH: `${dirname(process.execPath)}:/usr/bin:/bin`,
  HOME: workspace,
  TMPDIR: tmpdir(),
  NODE_ENV: "production",
  NEXT_TELEMETRY_DISABLED: "1",
  AKTIVPAL_TEST_MODE: "1",
  MONGO_URI: "mongodb://127.0.0.1:27017/aktivpal_test?serverSelectionTimeoutMS=100",
  ADMIN_PASSWORD: "local-test-only",
  ADMIN_SECRET: "local-test-secret-not-for-production",
  GOOGLE_EMAIL: "test@example.invalid",
  GOOGLE_APP_PASSWORD: "local-test-only",
  GOOGLE_MAPS_API_KEY: "",
};
const next = join(root, "node_modules/next/dist/bin/next");
function run(args, options = {}) {
  return new Promise((resolveRun, reject) => {
    const child = spawn(process.execPath, args, { cwd: workspace, env, stdio: "inherit", ...options });
    child.on("error", reject);
    child.on("exit", (code) => code === 0 ? resolveRun() : reject(new Error(`Command failed with exit ${code}`)));
  });
}

console.log(`Isolated verification directory: ${workspace}`);
// Webpack permits the shared, read-only dependency symlink outside this copy.
if (reuseIndex < 0) await run([next, "build", "--webpack"]);
if (!process.argv.includes("--build-only")) {
  const port = "3217";
  const server = spawn(process.execPath, [next, "start", "--hostname", "127.0.0.1", "--port", port], {
    cwd: workspace, env, stdio: "inherit",
  });
  try {
    let ready = false;
    for (let attempt = 0; attempt < 100; attempt++) {
      try {
        if ((await fetch(`http://127.0.0.1:${port}`)).ok) { ready = true; break; }
      } catch {}
      await new Promise((r) => setTimeout(r, 200));
    }
    if (!ready) throw new Error("Local test server did not start");
    await run([join(root, "tests/browser.mjs")], {
      env: {
        ...env,
        TEST_BASE_URL: `http://127.0.0.1:${port}`,
        TEST_ARTIFACTS: join(workspace, "browser-results"),
        PLAYWRIGHT_MODULE: process.env.PLAYWRIGHT_MODULE || "playwright",
        CHROMIUM_EXECUTABLE_PATH: process.env.CHROMIUM_EXECUTABLE_PATH || "",
      },
    });
  } finally {
    server.kill("SIGTERM");
  }
}
