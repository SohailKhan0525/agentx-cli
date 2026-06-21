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

// We don't need bunfs root for worker anymore, we'll copy it to dist directly.
// And we don't pass parserWorker as an entrypoint, since we copy it manually.
const res = await Bun.build({
  target: "bun",
  tsconfig: "./tsconfig.json",
  plugins: [plugin],
  external: ["node-gyp"],
  format: "esm",
  minify: true,
  sourcemap: sourcemapsFlag ? "linked" : "none",
  outdir: "dist",
  entrypoints: ["./src/index.ts", workerPath],
  define: {
    AGENTX_VERSION: `'${Script.version}'`,
    AGENTX_MODELS_DEV: generated.modelsData,
    OTUI_TREE_SITTER_WORKER_PATH: 'import.meta.dir + "/parser.worker.js"',
    AGENTX_WORKER_PATH: 'import.meta.dir + "/cli/tui/worker.js"',
    AGENTX_CHANNEL: `'${Script.channel}'`,
  },
})

// Copy parser.worker.js to dist
fs.copyFileSync(parserWorker, "dist/parser.worker.js")

// Patch the bundle to use absolute paths for native modules
const bundlePath = "dist/index.js"
if (fs.existsSync(bundlePath)) {
  let code = fs.readFileSync(bundlePath, "utf8")
  // Replace: fv1.exports="../opentui-c5en9p2g.dll"
  // With:    fv1.exports=import.meta.dir + "/../opentui-c5en9p2g.dll"
  code = code.replace(
    /([a-zA-Z0-9_]+)\.exports="\.\.\/(opentui-[a-zA-Z0-9_]+\.dll|libopentui-[a-zA-Z0-9_]+\.(?:so|dylib))"/g,
    `$1.exports=import.meta.dir + "/../$2"`
  )
  fs.writeFileSync(bundlePath, code)
}

console.log(res.outputs.map(o => o.path))
console.log("build completed successfully!")

