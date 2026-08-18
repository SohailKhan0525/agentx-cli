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
import pkg from "../package.json"

const sourcemapsFlag = process.argv.includes("--sourcemaps")
const plugin = createSolidTransformPlugin()
const skipEmbedWebUi = true

const createEmbeddedWebUIBundle = async () => {
  console.log(`Building Web UI to embed in the package`)
  const appDir = path.join(import.meta.dirname, "../../app")
  const dist = path.join(appDir, "dist")
  await $`AGENTX_CHANNEL=${Script.channel} bun run --cwd ${appDir} build`
  const files = (await Array.fromAsync(new Bun.Glob("**/*").scan({ cwd: dist })))
    .map((file) => file.replaceAll("\\", "/"))
    .filter((file) => !file.endsWith(".map"))
    .sort()
  const imports = files.map((file, i) => {
    const spec = path.relative(dir, path.join(dist, file)).replaceAll("\\", "/")
    return `import file_${i} from ${JSON.stringify(spec.startsWith(".") ? spec : `./${spec}`)} with { type: "file" };`
  })
  const entries = files.map((file, i) => `  ${JSON.stringify(file)}: file_${i},`)
  return [
    `// Import all files as file_$i with type: "file"`,
    ...imports,
    `// Export with original mappings`,
    `export default {`,
    ...entries,
    `}`,
  ].join("\n")
}

const embeddedFileMap = skipEmbedWebUi ? null : await createEmbeddedWebUIBundle()

const bunShimPlugin = {
  name: "bun-shim",
  setup(build: any) {
    build.onResolve({ filter: /^bun$/ }, () => ({
      path: path.resolve(__dirname, "./bun-shim.ts"),
    }))
    build.onResolve({ filter: /^jsonc-parser$/ }, () => ({
      path: require.resolve("jsonc-parser/lib/esm/main.js", { paths: [dir, path.resolve(dir, "../..")] }),
    }))
    build.onResolve({ filter: /^bun-ffi-structs$/ }, () => ({
      path: path.resolve(__dirname, "./bun-ffi-structs-shim.ts"),
    }))
  },
}

// Clean dist directory
if (fs.existsSync("dist")) fs.rmSync("dist", { recursive: true, force: true })
fs.mkdirSync("dist", { recursive: true })

console.log(`Building Node.js bundle for ${pkg.name}@${Script.version}...`)

const buildResult = await Bun.build({
  target: "node",
  entrypoints: ["./src/index.ts"],
  outdir: "./dist",
  format: "esm",
  minify: false,
  sourcemap: sourcemapsFlag ? "linked" : "none",
  plugins: [bunShimPlugin, plugin],
  external: ["node-gyp", "fsevents"],
  define: {
    AGENTX_VERSION: `'${Script.version}'`,
    AGENTX_MODELS_DEV: generated.modelsData,
    AGENTX_CHANNEL: `'${Script.channel}'`,
    "process.env.AGENTX_CHANNEL": `'${Script.channel}'`,
  },
  files: embeddedFileMap ? { "agentx-web-ui.gen.ts": embeddedFileMap } : {},
})

if (!buildResult.success) {
  console.error("Build failed:", buildResult.logs)
  process.exit(1)
}

// Ensure shebang exists at top of output file
const outputPath = path.resolve(dir, "dist/index.js")
let content = fs.readFileSync(outputPath, "utf8")
if (!content.startsWith("#!/usr/bin/env node")) {
  content = "#!/usr/bin/env node\n" + content
}

// Patch inlined bun-ffi-structs FFI_LOAD_ERROR in pre-bundled @opentui/core
content = content.replaceAll(
  /throw new Error\(FFI_LOAD_ERROR[\s\S]*?\);/g,
  `return { ptr(value) { if (ArrayBuffer.isView(value)) return BigInt(value.byteOffset); return 0n; }, toArrayBuffer(pointer, offset, length) { return new ArrayBuffer(length ?? 0); } };`
)

fs.writeFileSync(outputPath, content, "utf8")

// Make executable
try {
  fs.chmodSync(outputPath, 0o755)
} catch {}

console.log(`✓ Node.js bundle successfully generated at ${outputPath}`)

