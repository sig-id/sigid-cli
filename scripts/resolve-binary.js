"use strict";

const fs = require("node:fs");
const path = require("node:path");
const { packageNameFor, binaryName, platformKey, supportedPlatforms } = require("./platform.js");

/**
 * Resolve the absolute path to the platform-specific sigid binary.
 * Throws if the platform is unsupported or the optional package is missing.
 */
function resolveBinaryPath(opts = {}) {
  const platform = opts.platform || process.platform;
  const arch = opts.arch || process.arch;
  const requireFn = opts.requireFn || require;
  const pkgName = packageNameFor(platform, arch);

  if (!pkgName) {
    const key = platformKey(platform, arch);
    const supported = supportedPlatforms().join(", ");
    const err = new Error(
      `Unsupported platform ${key} for @sigid/cli. Supported: ${supported}. ` +
        `Install from source: cargo install --path crates/sigid-cli`,
    );
    err.code = "SIGID_CLI_UNSUPPORTED_PLATFORM";
    throw err;
  }

  let pkgRoot;
  try {
    // Prefer require.resolve so nested installs / pnpm layouts still work.
    const pkgJson = requireFn.resolve(`${pkgName}/package.json`);
    pkgRoot = path.dirname(pkgJson);
  } catch {
    const err = new Error(
      `Missing optional dependency ${pkgName}. Reinstall @sigid/cli, or install ` +
        `from source: cargo install --path crates/sigid-cli`,
    );
    err.code = "SIGID_CLI_BINARY_MISSING";
    throw err;
  }

  const binPath = path.join(pkgRoot, "bin", binaryName());
  if (!fs.existsSync(binPath)) {
    const err = new Error(
      `Binary not found at ${binPath} (package ${pkgName}). Reinstall @sigid/cli.`,
    );
    err.code = "SIGID_CLI_BINARY_MISSING";
    throw err;
  }

  return binPath;
}

module.exports = { resolveBinaryPath };
