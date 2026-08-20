import { Schema } from "effect"
import * as path from "path"
import * as fs from "fs"
import { Effect } from "effect"
import * as Tool from "./tool"
import { InstanceState } from "@/effect/instance-state"

export const Parameters = Schema.Struct({
  componentName: Schema.String.annotate({
    description: "The name of the component file to write (e.g. 'HeroSection.tsx' or 'Navbar.tsx')",
  }),
  code: Schema.String.annotate({
    description: "The customized component code to write",
  }),
  targetPath: Schema.optional(Schema.String).annotate({
    description: "Optional custom relative destination path (defaults to 'src/components/<componentName>')",
  }),
})

export const RegistryInjectTool = Tool.define(
  "registry_inject",
  Effect.gen(function* () {
    return {
      description: "Writes a customized production UI component directly into the target website project.",
      parameters: Parameters,
      execute: (params: { componentName: string; code: string; targetPath?: string }, ctx: Tool.Context) =>
        Effect.gen(function* () {
          const instance = yield* InstanceState.context
          const fileName = params.componentName.endsWith(".tsx") || params.componentName.endsWith(".jsx")
            ? params.componentName
            : `${params.componentName}.tsx`

          const relPath = params.targetPath ?? path.join("src", "components", fileName)
          const absPath = path.isAbsolute(relPath) ? relPath : path.join(instance.directory, relPath)

          yield* ctx.ask({
            permission: "edit",
            patterns: [path.relative(instance.worktree, absPath)],
            always: ["*"],
            metadata: {
              filepath: absPath,
            },
          })

          const dir = path.dirname(absPath)
          if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true })
          }

          fs.writeFileSync(absPath, params.code, "utf8")

          return {
            title: `Injected component ${fileName}`,
            output: `Successfully written to ${relPath}`,
          }
        }),
    }
  }),
)
