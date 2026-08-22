#!/usr/bin/env node

import { Script } from "../../../script/src/index.ts"
import { readFileSync, writeFileSync } from "node:fs"
import { execSync } from "node:child_process"
import { fileURLToPath } from "node:url"

const dir = fileURLToPath(new URL("..", import.meta.url))
process.chdir(dir)

execSync("npx tsc", { stdio: "inherit" })
const pkg = JSON.parse(readFileSync("package.json", "utf8"))
const original = JSON.parse(JSON.stringify(pkg))

for (const [key, value] of Object.entries(pkg.exports as Record<string, string>)) {
  const file = value.replace("./src/", "./dist/").replace(".ts", "")
  pkg.exports[key] = {
    import: file + ".js",
    types: file + ".d.ts",
  }
}

writeFileSync("package.json", JSON.stringify(pkg, null, 2), "utf8")
try {
  execSync("npm pack", { stdio: "inherit" })
} finally {
  writeFileSync("package.json", JSON.stringify(original, null, 2), "utf8")
}
