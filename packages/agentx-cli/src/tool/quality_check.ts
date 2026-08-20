import { Schema } from "effect"
import * as path from "path"
import * as fs from "fs"
import { Effect } from "effect"
import * as Tool from "./tool"
import { InstanceState } from "@/effect/instance-state"

export const Parameters = Schema.Struct({
  filePath: Schema.String.annotate({
    description: "The path of the file to check for forbidden placeholders and mock data",
  }),
})

const FORBIDDEN_PATTERNS: { name: string; pattern: RegExp }[] = [
  { name: "TODO comment", pattern: /\bTODO\b/i },
  { name: "FIXME comment", pattern: /\bFIXME\b/i },
  { name: "Lorem Ipsum placeholder", pattern: /lorem\s+ipsum/i },
  { name: "Placeholder text", pattern: /\bplaceholder\b/i },
  { name: "Mock data indicator", pattern: /\bmock(Data|User|Item|Product|Response)\b/i },
  { name: "Unimplemented stub", pattern: /write your logic here|replace with your|dummy data/i },
  { name: "Empty function stub", pattern: /\{\s*\/\/\s*to\s*be\s*implemented\s*\}/i },
]

export const QualityCheckTool = Tool.define(
  "quality_check",
  Effect.gen(function* () {
    return {
      description: "Scans a file to ensure zero forbidden patterns exist (e.g. TODO, lorem ipsum, mock data, dummy text, unimplemented logic).",
      parameters: Parameters,
      execute: (params: { filePath: string }, ctx: Tool.Context) =>
        Effect.gen(function* () {
          const instance = yield* InstanceState.context
          const absPath = path.isAbsolute(params.filePath)
            ? params.filePath
            : path.join(instance.directory, params.filePath)

          if (!fs.existsSync(absPath)) {
            return {
              title: "File not found",
              output: `File does not exist: ${params.filePath}`,
            }
          }

          const content = fs.readFileSync(absPath, "utf8")
          const lines = content.split("\n")
          const violations: { line: number; rule: string; snippet: string }[] = []

          lines.forEach((line, idx) => {
            for (const { name, pattern } of FORBIDDEN_PATTERNS) {
              if (pattern.test(line)) {
                violations.push({
                  line: idx + 1,
                  rule: name,
                  snippet: line.trim(),
                })
              }
            }
          })

          if (violations.length === 0) {
            return {
              title: "Quality check passed",
              output: `✓ ${params.filePath} has zero forbidden patterns. Production quality verified.`,
            }
          }

          return {
            title: `Quality check failed (${violations.length} violations)`,
            output: `✗ Found violations in ${params.filePath}:\n` +
              violations.map((v) => `  - Line ${v.line}: [${v.rule}] "${v.snippet}"`).join("\n") +
              `\nPlease regenerate or fix the file to remove all placeholders and mock data.`,
          }
        }),
    }
  }),
)
