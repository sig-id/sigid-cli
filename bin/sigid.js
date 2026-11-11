#!/usr/bin/env node
"use strict";

// Thin npm launcher for the platform-specific native `sigid` executable.

const { spawn } = require("node:child_process");
const { resolveBinaryPath } = require("../scripts/resolve-binary.js");

function main() {
  let binary;
  try {
    binary = resolveBinaryPath();
  } catch (err) {
    console.error(err && err.message ? err.message : String(err));
    process.exit(1);
  }

  const child = spawn(binary, process.argv.slice(2), {
    stdio: "inherit",
    windowsHide: true,
  });

  child.on("error", (err) => {
    console.error(`Failed to execute sigid binary at ${binary}: ${err.message}`);
    process.exit(1);
  });

  child.on("exit", (code, signal) => {
    if (signal) {
      process.kill(process.pid, signal);
      return;
    }
    process.exit(code == null ? 1 : code);
  });
}

main();
