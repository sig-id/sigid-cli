"use strict";

const { describe, it } = require("node:test");
const assert = require("node:assert/strict");
const {
  packageNameFor,
  platformKey,
  supportedPlatforms,
  binaryName,
  normalizeArch,
} = require("./platform.js");

describe("platform mapping", () => {
  it("maps linux/darwin x64 and arm64", () => {
    assert.equal(packageNameFor("linux", "x64"), "@sigid/cli-linux-x64");
    assert.equal(packageNameFor("linux", "arm64"), "@sigid/cli-linux-arm64");
    assert.equal(packageNameFor("darwin", "x64"), "@sigid/cli-darwin-x64");
    assert.equal(packageNameFor("darwin", "arm64"), "@sigid/cli-darwin-arm64");
  });

  it("normalizes amd64 and aarch64", () => {
    assert.equal(normalizeArch("amd64"), "x64");
    assert.equal(normalizeArch("aarch64"), "arm64");
    assert.equal(packageNameFor("linux", "amd64"), "@sigid/cli-linux-x64");
  });

  it("returns null for unsupported platforms", () => {
    assert.equal(packageNameFor("win32", "x64"), null);
    assert.equal(packageNameFor("linux", "ia32"), null);
    assert.equal(packageNameFor("freebsd", "x64"), null);
  });

  it("lists supported platforms", () => {
    const keys = supportedPlatforms();
    assert.ok(keys.includes("linux-x64"));
    assert.ok(keys.includes("darwin-arm64"));
    assert.equal(platformKey("linux", "x64"), "linux-x64");
  });

  it("uses unix binary name", () => {
    assert.equal(binaryName(), "sigid");
  });
});
