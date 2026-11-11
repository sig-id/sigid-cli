"use strict";

/**
 * Map Node's process.platform / process.arch to an optionalDependency package
 * name and the relative path of the native binary inside that package.
 */

const PLATFORMS = {
  "linux-x64": "@sigid/cli-linux-x64",
  "linux-arm64": "@sigid/cli-linux-arm64",
  "darwin-x64": "@sigid/cli-darwin-x64",
  "darwin-arm64": "@sigid/cli-darwin-arm64",
};

function normalizeArch(arch) {
  if (arch === "x64" || arch === "amd64") return "x64";
  if (arch === "arm64" || arch === "aarch64") return "arm64";
  return arch;
}

function platformKey(platform = process.platform, arch = process.arch) {
  const p = platform === "win32" ? "win32" : platform;
  const a = normalizeArch(arch);
  return `${p}-${a}`;
}

function packageNameFor(platform = process.platform, arch = process.arch) {
  const key = platformKey(platform, arch);
  return PLATFORMS[key] || null;
}

function binaryName() {
  // Unix-only targets today; Windows would use .exe when added.
  return "sigid";
}

function supportedPlatforms() {
  return Object.keys(PLATFORMS);
}

module.exports = {
  PLATFORMS,
  platformKey,
  packageNameFor,
  binaryName,
  supportedPlatforms,
  normalizeArch,
};
