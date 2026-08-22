#!/usr/bin/env node

import { Script } from "../packages/script/src/index.ts"
import fs from "node:fs/promises"
import { existsSync } from "node:fs"
import path from "node:path"
import { execSync } from "node:child_process"
import { fileURLToPath } from "node:url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, "..")
process.chdir(root)

console.log("=== publishing AgentX ===\n")

const targetPkgs = [
  path.join(root, "package.json"),
  path.join(root, "packages/agentx/package.json"),
  path.join(root, "packages/plugin/package.json"),
  path.join(root, "packages/sdk/package.json"),
  path.join(root, "packages/ui/package.json"),
  path.join(root, "packages/script/package.json"),
]

for (const file of targetPkgs) {
  if (existsSync(file)) {
    let pkg = await fs.readFile(file, "utf8")
    pkg = pkg.replaceAll(/"version": "[^"]+"/g, `"version": "${Script.version}"`)
    await fs.writeFile(file, pkg, "utf8")
    console.log("updated:", file)
  }
}

console.log("\n=== cli ===\n")
execSync("npm run --prefix packages/agentx build", { stdio: "inherit" })

console.log("Publish preparation complete for version", Script.version)
