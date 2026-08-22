import fs from "node:fs/promises"
import { existsSync, readFileSync } from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { execSync } from "node:child_process"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootPkgPath = path.resolve(__dirname, "../../../package.json")
const rootPkg = existsSync(rootPkgPath) ? JSON.parse(readFileSync(rootPkgPath, "utf8")) : {}

const env = {
  AGENTX_CHANNEL: process.env["AGENTX_CHANNEL"],
  AGENTX_BUMP: process.env["AGENTX_BUMP"],
  AGENTX_VERSION: process.env["AGENTX_VERSION"],
  AGENTX_RELEASE: process.env["AGENTX_RELEASE"],
}

const CHANNEL = (() => {
  if (env.AGENTX_CHANNEL) return env.AGENTX_CHANNEL
  if (env.AGENTX_BUMP) return "latest"
  if (env.AGENTX_VERSION && !env.AGENTX_VERSION.startsWith("0.0.0-")) return "latest"
  try {
    return execSync("git branch --show-current", { encoding: "utf8" }).trim() || "main"
  } catch {
    return "main"
  }
})()

const IS_PREVIEW = CHANNEL !== "latest" && CHANNEL !== "main" && CHANNEL !== "master"

const VERSION = (() => {
  if (env.AGENTX_VERSION) return env.AGENTX_VERSION
  if (rootPkg.version && rootPkg.version !== "0.0.0") return rootPkg.version
  return "2.0.1"
})()

const bot = ["actions-user", "agentx", "agentx-agent[bot]", "agentx"]
const teamPath = path.resolve(__dirname, "../../../.github/TEAM_MEMBERS")
const team = [
  ...(existsSync(teamPath)
    ? readFileSync(teamPath, "utf8")
        .split(/\r?\n/)
        .map((x) => x.trim())
        .filter((x) => x && !x.startsWith("#"))
    : ["SohailKhan0525", "agentx"]),
  ...bot,
]

export const Script = {
  get channel() {
    return CHANNEL
  },
  get version() {
    return VERSION
  },
  get preview() {
    return IS_PREVIEW
  },
  get release() {
    return env.AGENTX_RELEASE === "true"
  },
  get team() {
    return team
  },
}
