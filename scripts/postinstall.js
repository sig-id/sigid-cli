"use strict";

/**
 * Best-effort check that the platform optional package installed.
 * Never fails the install (optionalDependencies may be skipped on
 * unsupported platforms); the bin wrapper reports a clear error at runtime.
 */

const { packageNameFor, platformKey, supportedPlatforms } = require("./platform.js");

function main() {
  const pkg = packageNameFor();
  if (!pkg) {
    const key = platformKey();
    console.warn(
      `[@sigid/cli] No prebuilt binary for ${key}. Supported: ${supportedPlatforms().join(", ")}. ` +
        `Use cargo install --path crates/sigid-cli, or run on a supported OS/arch.`,
    );
    return;
  }

  try {
    require.resolve(`${pkg}/package.json`);
  } catch {
    console.warn(
      `[@sigid/cli] Optional package ${pkg} was not installed. ` +
        `sigid will fail until you reinstall with optional deps enabled, ` +
        `or install from source (cargo install --path crates/sigid-cli).`,
    );
  }
}

main();
