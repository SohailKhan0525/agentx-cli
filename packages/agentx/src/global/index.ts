import fs from "fs"
import { xdgData, xdgCache, xdgConfig, xdgState } from "xdg-basedir"
import path from "path"
import os from "os"

const app = "agentx"

const data = path.join(xdgData || path.join(os.homedir(), ".local", "share"), app)
const cache = path.join(xdgCache || path.join(os.homedir(), ".cache"), app)
const config = path.join(xdgConfig || path.join(os.homedir(), ".config"), app)
const state = path.join(xdgState || path.join(os.homedir(), ".local", "state"), app)

export function getConfigDir(): string {
  switch (process.platform) {
    case "win32":
      return path.join(process.env.APPDATA ?? os.homedir(), "agentx-cli")
    case "darwin":
      return path.join(os.homedir(), "Library", "Application Support", "agentx-cli")
    default:
      return path.join(
        process.env.XDG_CONFIG_HOME ?? path.join(os.homedir(), ".config"),
        "agentx-cli",
      )
  }
}

export namespace Global {
  export const Path = {
    // Allow override via AGENTX_TEST_HOME for test isolation
    get home() {
      return process.env.AGENTX_TEST_HOME || os.homedir()
    },
    data,
    bin: path.join(cache, "bin"),
    log: path.join(data, "log"),
    cache,
    config,
    state,
  }
}

try {
  fs.mkdirSync(Global.Path.data, { recursive: true })
  fs.mkdirSync(Global.Path.config, { recursive: true })
  fs.mkdirSync(Global.Path.state, { recursive: true })
  fs.mkdirSync(Global.Path.log, { recursive: true })
  fs.mkdirSync(Global.Path.bin, { recursive: true })
} catch {}

const CACHE_VERSION = "21"

let version = "0"
try {
  version = fs.readFileSync(path.join(Global.Path.cache, "version"), "utf8")
} catch {}

if (version !== CACHE_VERSION) {
  try {
    const contents = fs.readdirSync(Global.Path.cache)
    for (const item of contents) {
      try {
        fs.rmSync(path.join(Global.Path.cache, item), {
          recursive: true,
          force: true,
        })
      } catch {}
    }
  } catch (e) {}
  try {
    fs.mkdirSync(Global.Path.cache, { recursive: true })
    fs.writeFileSync(path.join(Global.Path.cache, "version"), CACHE_VERSION)
  } catch {}
}
