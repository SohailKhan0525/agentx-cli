#!/usr/bin/env node

import fs from "node:fs/promises"
import { existsSync } from "node:fs"
import { execSync } from "node:child_process"
import { Script } from "../packages/script/src/index.ts"

const output = [`version=${Script.version}`]

if (!Script.preview) {
  let sha = process.env.GITHUB_SHA || ""
  if (!sha) {
    try {
      sha = execSync("git rev-parse HEAD", { encoding: "utf8" }).trim()
    } catch {}
  }
  const file = `${process.cwd()}/UPCOMING_CHANGELOG.md`
  let body = "No notable changes"
  if (existsSync(file)) {
    body = await fs.readFile(file, "utf8").catch(() => "No notable changes")
  }
  const dir = process.env.RUNNER_TEMP ?? "/tmp"
  const notesFile = `${dir}/agentx-release-notes.txt`
  await fs.writeFile(notesFile, body, "utf8").catch(() => {})
}

output.push(`repo=${process.env.GH_REPO || ""}`)

if (process.env.GITHUB_OUTPUT) {
  await fs.writeFile(process.env.GITHUB_OUTPUT, output.join("\n"), "utf8").catch(() => {})
}

process.exit(0)
