#!/usr/bin/env bun

import { $ } from "bun"
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"
import { createSolidTransformPlugin } from "@opentui/solid/bun-plugin"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const dir = path.resolve(__dirname, "..")

process.chdir(dir)

const generated = await import("./generate.ts")

import { Script } from "@agentx-cli/script"

const sourcemapsFlag = process.argv.includes("--sourcemaps")
const plugin = createSolidTransformPlugin()

await $`rm -rf dist`
await $`mkdir -p dist`

console.log("building cross-platform js bundle")

const localPath = path.resolve(dir, "node_modules/@opentui/core/parser.worker.js")
const rootPath = path.resolve(dir, "../../node_modules/@opentui/core/parser.worker.js")
const parserWorker = fs.realpathSync(fs.existsSync(localPath) ? localPath : rootPath)
const workerPath = "./src/cli/tui/worker.ts"

// Use a generic bunfs root for worker
const bunfsRoot = "/$bunfs/root/"
const workerRelativePath = path.relative(dir, parserWorker).replaceAll("\\", "/")

await Bun.build({
  target: "bun",
  tsconfig: "./tsconfig.json",
  plugins: [plugin],
  external: ["node-gyp"],
  format: "esm",
  minify: true,
  sourcemap: sourcemapsFlag ? "linked" : "none",
  outdir: "dist",
  entrypoints: ["./src/index.ts", parserWorker, workerPath],
  define: {
    AGENTX_VERSION: `'${Script.version}'`,
    AGENTX_MODELS_DEV: generated.modelsData,
    OTUI_TREE_SITTER_WORKER_PATH: JSON.stringify(bunfsRoot + workerRelativePath),
    AGENTX_WORKER_PATH: JSON.stringify(workerPath),
    AGENTX_CHANNEL: `'${Script.channel}'`,
  },
})

// Rename index.js to agentx.js
if (fs.existsSync("dist/index.js")) {
  fs.renameSync("dist/index.js", "dist/agentx.js")
}

console.log("build completed successfully!")

