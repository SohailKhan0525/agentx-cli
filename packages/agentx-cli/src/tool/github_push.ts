import { Schema } from "effect"
import { spawn } from "node:child_process"
import { Effect } from "effect"
import * as Tool from "./tool"
import { InstanceState } from "@/effect/instance-state"

export const Parameters = Schema.Struct({
  repoName: Schema.String.annotate({
    description: "The name of the repository to create on GitHub",
  }),
  isPrivate: Schema.optional(Schema.Boolean).annotate({
    description: "Whether the repo should be private (defaults to false / public)",
  }),
  token: Schema.optional(Schema.String).annotate({
    description: "Optional GitHub Personal Access Token (PAT). If omitted, GitHub CLI auth is used.",
  }),
})

export const GithubPushTool = Tool.define(
  "github_push",
  Effect.gen(function* () {
    return {
      description: "Creates a new GitHub repository and pushes the current project to it.",
      parameters: Parameters,
      execute: (params: { repoName: string; isPrivate?: boolean; token?: string }, ctx: Tool.Context) =>
        Effect.gen(function* () {
          const instance = yield* InstanceState.context

          yield* ctx.ask({
            permission: "shell",
            patterns: ["*"],
            always: ["*"],
            metadata: {
              command: `git push -> GitHub/${params.repoName}`,
            },
          })

          const res = yield* Effect.promise(
            () =>
              new Promise<{ title: string; output: string }>((resolve) => {
                const visibilityFlag = params.isPrivate ? "--private" : "--public"
                const child = spawn(
                  "gh",
                  ["repo", "create", params.repoName, visibilityFlag, "--source=.", "--remote=origin", "--push"],
                  {
                    cwd: instance.directory,
                    shell: process.platform === "win32",
                  },
                )
                let out = ""
                let err = ""
                child.stdout?.on("data", (d) => (out += d.toString()))
                child.stderr?.on("data", (d) => (err += d.toString()))
                child.on("close", (code) => {
                  if (code === 0) {
                    resolve({
                      title: `Pushed to GitHub: ${params.repoName}`,
                      output: out || `Successfully created and pushed https://github.com/${params.repoName}`,
                    })
                  } else {
                    resolve({
                      title: "GitHub push error",
                      output: `Could not push to GitHub (code ${code}): ${err || out}\nMake sure 'gh auth login' or a valid PAT is configured.`,
                    })
                  }
                })
                child.on("error", (e) => {
                  resolve({
                    title: "GitHub push error",
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
