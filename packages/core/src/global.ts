import path from "path"
import fs from "fs/promises"
import { xdgData, xdgCache, xdgConfig, xdgState } from "xdg-basedir"
import os from "os"
import { Context, Effect, Layer } from "effect"
import { Flock } from "./util/flock"
import { Flag } from "./flag/flag"
import { makeGlobalNode } from "./effect/app-node"

const app = "agentx"

function resolveBaseDirs() {
  const home = process.env.AGENTX_TEST_HOME ?? os.homedir()
  const platform = process.platform

  let configBase: string
  let dataBase: string
  let cacheBase: string
  let stateBase: string

  if (platform === "win32") {
    configBase = process.env.APPDATA || path.join(home, "AppData", "Roaming")
    dataBase = process.env.LOCALAPPDATA || path.join(home, "AppData", "Local")
    cacheBase = path.join(dataBase, "cache")
    stateBase = path.join(dataBase, "state")
  } else if (platform === "darwin") {
    const appSupport = path.join(home, "Library", "Application Support")
    configBase = appSupport
    dataBase = appSupport
    cacheBase = path.join(home, "Library", "Caches")
    stateBase = path.join(appSupport, "state")
  } else {
    configBase = process.env.XDG_CONFIG_HOME || path.join(home, ".config")
    dataBase = process.env.XDG_DATA_HOME || path.join(home, ".local", "share")
    cacheBase = process.env.XDG_CACHE_HOME || path.join(home, ".cache")
    stateBase = process.env.XDG_STATE_HOME || path.join(home, ".local", "state")
  }

  if (xdgConfig) configBase = xdgConfig
  if (xdgData) dataBase = xdgData
  if (xdgCache) cacheBase = xdgCache
  if (xdgState) stateBase = xdgState

  return {
    config: path.join(configBase, app),
    data: path.join(dataBase, app),
    cache: path.join(cacheBase, app),
    state: path.join(stateBase, app),
    tmp: path.join(os.tmpdir(), app),
  }
}

const resolved = resolveBaseDirs()

const paths = {
  get home() {
    return process.env.AGENTX_TEST_HOME ?? os.homedir()
  },
  data: resolved.data,
  bin: path.join(resolved.cache, "bin"),
  log: path.join(resolved.data, "log"),
  repos: path.join(resolved.data, "repos"),
  cache: resolved.cache,
  config: resolved.config,
  state: resolved.state,
  tmp: resolved.tmp,
}

export const Path = paths

Flock.setGlobal({ state: resolved.state })

await Promise.all([
  fs.mkdir(Path.data, { recursive: true }),
  fs.mkdir(Path.config, { recursive: true }),
  fs.mkdir(Path.state, { recursive: true }),
  fs.mkdir(Path.tmp, { recursive: true }),
  fs.mkdir(Path.log, { recursive: true }),
  fs.mkdir(Path.bin, { recursive: true }),
  fs.mkdir(Path.repos, { recursive: true }),
])

export class Service extends Context.Service<Service, Interface>()("@agentx/Global") {}

export interface Interface {
  readonly home: string
  readonly data: string
  readonly cache: string
  readonly config: string
  readonly state: string
  readonly tmp: string
  readonly bin: string
  readonly log: string
  readonly repos: string
}

export function make(input: Partial<Interface> = {}): Interface {
  return {
    home: Path.home,
    data: Path.data,
    cache: Path.cache,
    config: Flag.AGENTX_CONFIG_DIR ?? Path.config,
    state: Path.state,
    tmp: Path.tmp,
    bin: Path.bin,
    log: Path.log,
    repos: Path.repos,
    ...input,
  }
}

const layer = Layer.effect(
  Service,
  Effect.sync(() => Service.of(make())),
)

export const node = makeGlobalNode({ service: Service, layer: layer, deps: [] })

export const layerWith = (input: Partial<Interface>) =>
  Layer.effect(
    Service,
    Effect.sync(() => Service.of(make(input))),
  )

export * as Global from "./global"
