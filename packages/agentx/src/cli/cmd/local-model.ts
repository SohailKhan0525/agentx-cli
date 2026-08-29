import { Effect } from "effect"
import { effectCmd } from "../effect-cmd"
import { UI } from "../ui"
import { runLocalModelDiscovery, formatLocalModelSummary, installModel } from "@/local-model"

export const LocalModelCommand = effectCmd({
  command: "local-model [subcommand] [model]",
  describe: "discover, inspect hardware fit, and install local AI models",
  builder: (yargs) =>
    yargs
      .positional("subcommand", {
        describe: "subcommand (discover, install, hardware)",
        type: "string",
        default: "discover",
      })
      .positional("model", {
        describe: "model tag to install (e.g., qwen2.5-coder:7b, deepseek-r1:8b)",
        type: "string",
      }),
  handler: Effect.fn("Cli.local-model")(function* (args) {
    if (args.subcommand === "install" && args.model) {
      UI.println(`Installing local model: ${args.model}...`)
      const res = yield* Effect.promise(() =>
        installModel(args.model!, "ollama", undefined, (evt) => {
          if (evt.progressPercent !== undefined) {
            UI.print(`\r${evt.status} [${evt.progressPercent}%]`)
          } else {
            UI.println(evt.status)
          }
        }),
      )
      if (res.success) {
        UI.println(
          `\n${UI.Style.TEXT_SUCCESS_BOLD}Successfully installed and verified ${args.model}!${UI.Style.TEXT_NORMAL}`,
        )
      } else {
        UI.println(`\n${UI.Style.TEXT_DANGER_BOLD}Installation failed: ${res.error}${UI.Style.TEXT_NORMAL}`)
      }
      return
    }

    const discovery = yield* Effect.promise(() => runLocalModelDiscovery())
    UI.println(formatLocalModelSummary(discovery))
  }),
})
