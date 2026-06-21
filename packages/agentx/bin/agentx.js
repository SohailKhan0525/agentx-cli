#!/usr/bin/env node
import { spawnSync } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const bundlePath = path.join(__dirname, "../dist/index.js");

const result = spawnSync("bun", [bundlePath, ...process.argv.slice(2)], {
  stdio: "inherit",
  shell: process.platform === 'win32'
});

if (result.error) {
    if (result.error.code === 'ENOENT') {
        console.error("agentx requires 'bun' to be installed. Please install Bun from https://bun.sh");
    } else {
        console.error(result.error);
    }
    process.exit(1);
}

process.exit(result.status ?? 0);
