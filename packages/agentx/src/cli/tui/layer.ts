import { run as runTui, type TuiInput } from "@agentx-cli/tui"
import { Global } from "@agentx-cli/core/global"
import { Effect } from "effect"

export function run(input: TuiInput) {
  return runTui(input).pipe(Effect.provide(Global.defaultLayer))
}
