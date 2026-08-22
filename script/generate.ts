#!/usr/bin/env node

import { execSync } from "node:child_process"
import path from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, "..")

try {
  execSync("node ./script/format.ts", { cwd: root, stdio: "inherit" })
} catch (e) {
  console.warn("Format script warning:", e)
}
