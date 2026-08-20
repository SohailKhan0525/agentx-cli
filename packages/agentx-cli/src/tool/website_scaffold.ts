import { Schema } from "effect"
import * as path from "path"
import { spawn } from "node:child_process"
import { Effect } from "effect"
import * as Tool from "./tool"
import { InstanceState } from "@/effect/instance-state"

export const Parameters = Schema.Struct({
  framework: Schema.Literal("nextjs", "vite", "astro", "nuxt").annotate({
    description: "The framework to scaffold: 'nextjs', 'vite', 'astro', or 'nuxt'",
  }),
  name: Schema.String.annotate({
    description: "The project or directory name to scaffold",
  }),
  template: Schema.optional(Schema.String).annotate({
    description: "Optional template variant (e.g., 'react-ts' for Vite)",
  }),
})

export const WebsiteScaffoldTool = Tool.define(
  "website_scaffold",
  Effect.gen(function* () {
    return {
      description: "Scaffolds a production-ready website project using official CLI commands (e.g. create-next-app, create-vite).",
      parameters: Parameters,
      execute: (params: { framework: "nextjs" | "vite" | "astro" | "nuxt"; name: string; template?: string }, ctx: Tool.Context) =>
        Effect.gen(function* () {
          const instance = yield* InstanceState.context
          const targetDir = path.isAbsolute(params.name)
            ? params.name
            : path.join(instance.directory, params.name)

          yield* ctx.ask({
            permission: "shell",
            patterns: ["*"],
            always: ["*"],
            metadata: {
              command: `scaffold ${params.framework} ${params.name}`,
            },
          })

          let command = process.platform === "win32" ? "npx.cmd" : "npx"
          let args: string[] = []

          switch (params.framework) {
            case "nextjs":
              args = [
                "create-next-app@latest",
                params.name,
                "--typescript",
                "--tailwind",
                "--eslint",
                "--app",
                "--src-dir",
                '--import-alias="@/*"',
                "--yes",
              ]
              break
            case "vite":
              args = [
                "create-vite@latest",
                params.name,
                "--template",
                params.template ?? "react-ts",
                "--yes",
              ]
              break
            case "astro":
              args = ["create-astro@latest", params.name, "--template", "minimal", "--typescript", "strict", "--yes"]
              break
            case "nuxt":
              args = ["nuxi@latest", "init", params.name, "--packageManager", "npm", "--gitInit"]
              break
          }

          const res = yield* Effect.promise(
            () =>
              new Promise<{ title: string; output: string }>((resolve) => {
                const child = spawn(command, args, {
                  cwd: instance.directory,
                  shell: process.platform === "win32",
                })
                let out = ""
                let err = ""
                child.stdout?.on("data", (d) => (out += d.toString()))
                child.stderr?.on("data", (d) => (err += d.toString()))
                child.on("close", (code) => {
                  if (code === 0) {
                    resolve({
                      title: `Scaffolded ${params.framework} project`,
                      output: out || `Successfully initialized ${params.framework} at ${targetDir}`,
                    })
                  } else {
                    resolve({
                      title: `Scaffold failed (code ${code})`,
                      output: `Error scaffolding ${params.framework}: ${err || out}`,
                    })
                  }
                })
                child.on("error", (e) => {
                  resolve({
                    title: `Scaffold failed`,
                    output: `Process error: ${e.message}`,
                  })
                })
              }),
          )

          return res
        }),
    }
  }),
)
