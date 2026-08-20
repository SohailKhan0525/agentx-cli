import { Schema } from "effect"
import * as path from "path"
import * as fs from "fs"
import { Effect } from "effect"
import * as Tool from "./tool"
import { InstanceState } from "@/effect/instance-state"

export const Parameters = Schema.Struct({
  category: Schema.optional(Schema.String).annotate({
    description: "Optional category filter (e.g. 'hero', 'navigation', 'pricing', 'features', 'footer')",
  }),
})

export type RegistryComponent = {
  name: string
  category: string
  dependencies: string[]
  code: string
}

export function parseRegistryFile(content: string): RegistryComponent[] {
  const components: RegistryComponent[] = []
  const blocks = content.split(/\n---\n/)

  for (const block of blocks) {
    const lines = block.trim().split("\n")
    let name = ""
    let category = "general"
    let dependencies: string[] = []
    let codeLines: string[] = []
    let inCode = false

    for (const line of lines) {
      if (line.startsWith("NAME:")) {
        name = line.replace("NAME:", "").trim()
      } else if (line.startsWith("CATEGORY:")) {
        category = line.replace("CATEGORY:", "").trim()
      } else if (line.startsWith("DEPENDENCIES:")) {
        dependencies = line
          .replace("DEPENDENCIES:", "")
          .split(",")
          .map((d) => d.trim())
          .filter(Boolean)
      } else if (line.startsWith("CODE:")) {
        inCode = true
      } else if (inCode) {
        codeLines.push(line)
      }
    }

    if (name && codeLines.length > 0) {
      components.push({
        name,
        category,
        dependencies,
        code: codeLines.join("\n").trim(),
      })
    }
  }

  return components
}

export const RegistryReadTool = Tool.define(
  "registry_read",
  Effect.gen(function* () {
    return {
      description: "Reads and parses the component registry files (components.txt and components2.txt) to retrieve production UI components.",
      parameters: Parameters,
      execute: (params: { category?: string }, ctx: Tool.Context) =>
        Effect.gen(function* () {
          const instance = yield* InstanceState.context
          const candidates = [
            path.join(instance.directory, "components.txt"),
            path.join(instance.directory, "components2.txt"),
            path.join(instance.worktree, "components.txt"),
            path.join(instance.worktree, "components2.txt"),
            path.join(import.meta.dirname, "../../../components.txt"),
            path.join(import.meta.dirname, "../../../components2.txt"),
          ]

          let allComponents: RegistryComponent[] = []

          for (const file of candidates) {
            if (fs.existsSync(file)) {
              try {
                const text = fs.readFileSync(file, "utf8")
                const parsed = parseRegistryFile(text)
                allComponents.push(...parsed)
              } catch {}
            }
          }

          // Deduplicate by name
          const unique = Array.from(new Map(allComponents.map((c) => [c.name, c])).values())
          const filtered = params.category
            ? unique.filter((c) => c.category.toLowerCase() === params.category!.toLowerCase())
            : unique

          return {
            title: `Read ${filtered.length} components from registry`,
            output: JSON.stringify(filtered, null, 2),
          }
        }),
    }
  }),
)
