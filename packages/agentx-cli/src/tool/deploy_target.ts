import { Schema } from "effect"
import { spawn } from "node:child_process"
import { Effect } from "effect"
import * as Tool from "./tool"
import { InstanceState } from "@/effect/instance-state"

export const Parameters = Schema.Struct({
  platform: Schema.Literal("vercel", "netlify", "railway", "flyio").annotate({
    description: "The deployment platform target: 'vercel', 'netlify', 'railway', or 'flyio'",
  }),
  prod: Schema.optional(Schema.Boolean).annotate({
    description: "Whether to trigger a production deployment (defaults to true)",
  }),
})

export const DeployTargetTool = Tool.define(
  "deploy_target",
  Effect.gen(function* () {
    return {
      description: "Deploys the website to a cloud platform (Vercel, Netlify, Railway, Fly.io) and returns the live URL.",
      parameters: Parameters,
      execute: (params: { platform: "vercel" | "netlify" | "railway" | "flyio"; prod?: boolean }, ctx: Tool.Context) =>
        Effect.gen(function* () {
          const instance = yield* InstanceState.context

          yield* ctx.ask({
            permission: "shell",
            patterns: ["*"],
            always: ["*"],
            metadata: {
              command: `deploy --platform ${params.platform}`,
            },
          })

          let command = process.platform === "win32" ? "npx.cmd" : "npx"
          let args: string[] = []

          switch (params.platform) {
            case "vercel":
              args = ["vercel", "--yes"]
              if (params.prod !== false) args.push("--prod")
              break
            case "netlify":
              args = ["netlify", "deploy"]
              if (params.prod !== false) args.push("--prod")
              break
            case "railway":
              args = ["railway", "up"]
              break
            case "flyio":
              args = ["flyctl", "deploy"]
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
                      title: `Deployed to ${params.platform}`,
                      output: out || `Successfully triggered deployment on ${params.platform}`,
                    })
                  } else {
                    resolve({
                      title: `Deployment failed (code ${code})`,
                      output: `Deploy error on ${params.platform}: ${err || out}`,
                    })
                  }
                })
                child.on("error", (e) => {
                  resolve({
                    title: `Deployment failed`,
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
