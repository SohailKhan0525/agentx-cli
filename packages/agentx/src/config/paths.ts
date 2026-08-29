export * as ConfigPaths from "./paths"

import path from "path"
import { Flag } from "@agent-qofeno/core/flag/flag"
import { Global } from "@agent-qofeno/core/global"
import { unique } from "remeda"
import * as Effect from "effect/Effect"
import { FSUtil } from "@agent-qofeno/core/fs-util"

export const files = Effect.fn("ConfigPaths.projectFiles")(function* (
  name: string,
  directory: string,
  worktree?: string,
) {
  const afs = yield* FSUtil.Service
  const targets =
    name === "agentx" || name === "opencode"
      ? ["agentx.jsonc", "agentx.json", "opencode.jsonc", "opencode.json"]
      : [`${name}.jsonc`, `${name}.json`]
  return (yield* afs.up({
    targets,
    start: directory,
    stop: worktree,
  })).toReversed()
})

export const directories = Effect.fn("ConfigPaths.directories")(function* (directory: string, worktree?: string) {
  const afs = yield* FSUtil.Service
  return unique([
    Global.Path.config,
    ...(!Flag.AGENTX_DISABLE_PROJECT_CONFIG
      ? yield* afs.up({
          targets: [".agentx", ".opencode"],
          start: directory,
          stop: worktree,
        })
      : []),
    ...(yield* afs.up({
      targets: [".agentx", ".opencode"],
      start: Global.Path.home,
      stop: Global.Path.home,
    })),
    ...(Flag.AGENTX_CONFIG_DIR ? [Flag.AGENTX_CONFIG_DIR] : []),
  ])
})

export function fileInDirectory(dir: string, name: string) {
  if (name === "agentx" || name === "opencode") {
    return [
      path.join(dir, "agentx.json"),
      path.join(dir, "agentx.jsonc"),
      path.join(dir, "opencode.json"),
      path.join(dir, "opencode.jsonc"),
    ]
  }
  return [path.join(dir, `${name}.json`), path.join(dir, `${name}.jsonc`)]
}
