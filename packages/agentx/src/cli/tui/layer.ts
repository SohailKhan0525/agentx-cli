import { run as runTui, type TuiInput } from "@agent-qofeno/tui"
import { Global } from "@agent-qofeno/core/global"
import { AppNodeBuilder } from "@agent-qofeno/core/effect/app-node-builder"
import { Effect } from "effect"

export function run(input: TuiInput) {
  return runTui(input).pipe(Effect.provide(AppNodeBuilder.build(Global.node)))
}
