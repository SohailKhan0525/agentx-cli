#!/usr/bin/env node

import { execSync } from "node:child_process"
import { readFileSync, writeFileSync } from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const dir = path.resolve(__dirname, "..")
process.chdir(dir)

console.log("Publishing pure Node.js CLI package...")

// Run build first
execSync("node ./script/build.ts", { stdio: "inherit" })

console.log("Packaging ready for npm publish")
