#!/usr/bin/env node

import { Script } from "../../../script/src/index.ts"
import fs from "node:fs/promises"
import { readFileSync, writeFileSync } from "node:fs"
import { execSync } from "node:child_process"
import { fileURLToPath } from "node:url"

const dir = fileURLToPath(new URL("..", import.meta.url))
process.chdir(dir)

const pkg = JSON.parse(readFileSync("package.json", "utf8"))
const original = JSON.parse(JSON.stringify(pkg))

function transformExports(exports: Record<string, string | object>) {
  for (const [key, value] of Object.entries(exports)) {
    if (typeof value === "object" && value !== null) {
      transformExports(value as Record<string, string | object>)
    } else if (typeof value === "string") {
      const file = value.replace("./src/", "./dist/").replace(".ts", "")
      exports[key] = {
        import: file + ".js",
        types: file + ".d.ts",
      }
    }
  }
}

transformExports(pkg.exports)
writeFileSync("package.json", JSON.stringify(pkg, null, 2), "utf8")
try {
  execSync("npm pack", { stdio: "inherit" })
} finally {
  writeFileSync("package.json", JSON.stringify(original, null, 2), "utf8")
}
