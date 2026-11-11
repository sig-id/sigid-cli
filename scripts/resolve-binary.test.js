"use strict";

const { describe, it } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { resolveBinaryPath } = require("./resolve-binary.js");

describe("resolveBinaryPath", () => {
  it("throws on unsupported platform", () => {
    assert.throws(
      () => resolveBinaryPath({ platform: "win32", arch: "x64" }),
      (err) => err.code === "SIGID_CLI_UNSUPPORTED_PLATFORM",
    );
  });

  it("throws when optional package is missing", () => {
    const requireFn = {
      resolve() {
        const e = new Error("not found");
        e.code = "MODULE_NOT_FOUND";
        throw e;
      },
    };
    assert.throws(
      () => resolveBinaryPath({ platform: "linux", arch: "x64", requireFn }),
      (err) => err.code === "SIGID_CLI_BINARY_MISSING",
    );
  });

  it("returns binary path when package and file exist", () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "sigid-"));
    const binDir = path.join(dir, "bin");
    fs.mkdirSync(binDir);
    const binPath = path.join(binDir, "sigid");
    fs.writeFileSync(binPath, "#!/bin/sh\necho ok\n", { mode: 0o755 });
    fs.writeFileSync(path.join(dir, "package.json"), JSON.stringify({ name: "@sigid/cli-linux-x64" }));

    const requireFn = {
      resolve(id) {
        if (id === "@sigid/cli-linux-x64/package.json") {
          return path.join(dir, "package.json");
        }
        throw new Error(`unexpected resolve: ${id}`);
      },
    };

    const resolved = resolveBinaryPath({ platform: "linux", arch: "x64", requireFn });
    assert.equal(resolved, binPath);
  });
});
