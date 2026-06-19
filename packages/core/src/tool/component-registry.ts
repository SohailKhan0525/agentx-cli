export * as ComponentRegistryTool from "./component-registry"

import { ToolFailure } from "@agentx-cli/llm"
import { Effect, Layer, Schema } from "effect"
import fs from "fs"
import path from "path"
import { Tool } from "./tool"
import { Tools } from "./tools"

export const name = "component_registry"

const Input = Schema.Struct({
  action: Schema.Literals(["list", "get"]),
  query: Schema.optional(Schema.String),
  componentName: Schema.optional(Schema.String),
})

const Output = Schema.String

function findComponentFiles(): string[] {
  let currentDir = import.meta.dirname
  for (let i = 0; i < 5; i++) {
    const p1 = path.join(currentDir, "components.txt")
    const p2 = path.join(currentDir, "components2.txt")
    if (fs.existsSync(p1)) {
      return [p1, p2].filter((p) => fs.existsSync(p))
    }
    currentDir = path.dirname(currentDir)
  }
  const cwd1 = path.join(process.cwd(), "components.txt")
  const cwd2 = path.join(process.cwd(), "components2.txt")
  return [cwd1, cwd2].filter((p) => fs.existsSync(p))
}

function parseComponents(files: string[]) {
  const components = new Map<string, string>()
  for (const file of files) {
    const content = fs.readFileSync(file, "utf8")
    const blocks = content.split(/^name:\s*/m)
    for (const block of blocks) {
      if (!block.trim()) continue
      const lines = block.split("\n")
      const firstLine = lines[0].trim()
      if (firstLine) {
        components.set(firstLine.toLowerCase(), "name: " + block.trim())
      }
    }
  }
  return components
}

export const layer = Layer.effectDiscard(
  Effect.gen(function* () {
    const tools = yield* Tools.Service

    yield* tools
      .register({
        [name]: Tool.make({
          description:
            "Query the local component registry for premium UI components. Use 'list' to search for components, and 'get' with the exact component name to get the full source code and integration instructions.",
          input: Input,
          output: Output,
          execute: (input) =>
            Effect.gen(function* () {
              const files = findComponentFiles()
              if (files.length === 0) {
                return "Error: components.txt and components2.txt not found in the install directory."
              }

              const components = parseComponents(files)

              if (input.action === "list") {
                const query = input.query?.toLowerCase() || ""
                const results: string[] = []
                for (const compName of components.keys()) {
                  if (compName.includes(query)) {
                    results.push(compName)
                  }
                }
                if (results.length === 0) {
                  return `No components found matching "${query}".`
                }
                return `Available components matching "${query}":\n\n` + results.map((r) => "- " + r).join("\n")
              }

              if (input.action === "get") {
                if (!input.componentName) {
                  return "Error: componentName is required for 'get' action."
                }
                const compName = input.componentName.toLowerCase()
                const data = components.get(compName)
                if (!data) {
                  return `Component "${input.componentName}" not found. Try using the 'list' action to find the exact name.`
                }
                return data
              }

              return "Invalid action."
            }),
        }),
      })
      .pipe(Effect.orDie)
  }),
)
