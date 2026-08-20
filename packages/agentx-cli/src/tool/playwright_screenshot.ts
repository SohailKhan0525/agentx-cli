import { Schema } from "effect"
import * as path from "path"
import * as fs from "fs"
import { spawn } from "node:child_process"
import { Effect } from "effect"
import * as Tool from "./tool"
import { InstanceState } from "@/effect/instance-state"

export const Parameters = Schema.Struct({
  url: Schema.String.annotate({
    description: "The local or live URL to visit and screenshot (e.g. 'http://localhost:3000' or 'http://localhost:3000/pricing')",
  }),
  name: Schema.String.annotate({
    description: "The screenshot name (e.g. 'homepage' or 'pricing')",
  }),
})

export const PlaywrightScreenshotTool = Tool.define(
  "playwright_screenshot",
  Effect.gen(function* () {
    return {
      description: "Captures a full-page browser screenshot of a route using Playwright and saves it to .agentx/screenshots/.",
      parameters: Parameters,
      execute: (params: { url: string; name: string }, ctx: Tool.Context) =>
        Effect.gen(function* () {
          const instance = yield* InstanceState.context
          const screenshotDir = path.join(instance.directory, ".agentx", "screenshots")
          if (!fs.existsSync(screenshotDir)) {
            fs.mkdirSync(screenshotDir, { recursive: true })
          }

          const outputPath = path.join(screenshotDir, `${params.name.replace(/\.png$/, "")}.png`)

          yield* ctx.ask({
            permission: "shell",
            patterns: ["*"],
            always: ["*"],
            metadata: {
              command: `screenshot ${params.url} -> ${outputPath}`,
            },
          })

          const script = `
const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  try {
    await page.goto(${JSON.stringify(params.url)}, { waitUntil: 'networkidle', timeout: 15000 });
  } catch {
    await page.goto(${JSON.stringify(params.url)}, { waitUntil: 'load', timeout: 15000 });
  }
  await page.screenshot({ path: ${JSON.stringify(outputPath)}, fullPage: true });
  await browser.close();
  console.log('Screenshot saved');
})();
`
          const res = yield* Effect.promise(
            () =>
              new Promise<{ title: string; output: string }>((resolve) => {
                const child = spawn(process.execPath || "node", ["-e", script], {
                  cwd: instance.directory,
                })
                let out = ""
                let err = ""
                child.stdout?.on("data", (d) => (out += d.toString()))
                child.stderr?.on("data", (d) => (err += d.toString()))
                child.on("close", (code) => {
                  if (code === 0) {
                    resolve({
                      title: `Screenshot captured: ${params.name}`,
                      output: `Saved full-page screenshot to .agentx/screenshots/${params.name}.png`,
                    })
                  } else {
                    resolve({
                      title: "Screenshot error",
                      output: `Could not capture screenshot via Playwright: ${err || out}\nMake sure dev server is running at ${params.url}`,
                    })
                  }
                })
                child.on("error", (e) => {
                  resolve({
                    title: "Screenshot error",
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
