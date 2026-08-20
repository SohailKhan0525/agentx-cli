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
    build.onResolve({ filter: /^@opentui\/core-(darwin|linux|win32)/ }, (args: any) => {
      try {
        const resolved = require.resolve(args.path, { paths: [dir, path.resolve(dir, "../..")] })
        return { path: resolved }
      } catch {
        return { path: path.resolve(__dirname, "./opentui-platform-shim.ts") }
      }
    })
  },
}

// Clean dist directory
if (fs.existsSync("dist")) fs.rmSync("dist", { recursive: true, force: true })
fs.mkdirSync("dist", { recursive: true })

// Ensure all platform native binaries are present in dist
const requiredBinaries = [
  { name: "opentui.dll", pkg: "@opentui/core-win32-x64@0.3.4" },
  { name: "libopentui.so", pkg: "@opentui/core-linux-x64@0.3.4" },
  { name: "libopentui.dylib", pkg: "@opentui/core-darwin-arm64@0.3.4" },
]

for (const { name, pkg: npmPkg } of requiredBinaries) {
  const dest = path.join("dist", name)
  if (fs.existsSync(dest)) continue

  let copied = false
  const directPaths = [
    `../../node_modules/.bun/${npmPkg.replace("@", "").replace("/", "+")}/node_modules/${npmPkg.split("@")[0] || npmPkg.split("@")[1]}/${name}`,
    `node_modules/${npmPkg.split("@")[0] || npmPkg.split("@")[1]}/${name}`,
  ]
  for (const rel of directPaths) {
    const src = path.resolve(dir, rel)
    if (fs.existsSync(src)) {
      try {
        fs.copyFileSync(src, dest)
        console.log(`Copied ${name} from local node_modules to dist/`)
        copied = true
        break
      } catch {}
    }
  }

  // If missing (e.g. on Linux CI where win32 package is not installed), unpack from npm
  if (!copied) {
    try {
      console.log(`Downloading ${npmPkg} for ${name}...`)
      const { execSync } = require("child_process")
      const tarball = execSync(`npm pack ${npmPkg}`, { cwd: "dist", encoding: "utf8" }).trim().split("\n").pop()!.trim()
      const tarballPath = path.join("dist", tarball)
      execSync(`tar -xzf ${tarball} --strip-components=1 package/${name}`, { cwd: "dist" })
      if (fs.existsSync(tarballPath)) fs.unlinkSync(tarballPath)
      console.log(`Successfully unpacked ${name} into dist/`)
    } catch (e) {
      console.error(`Warning: Failed to fetch native binary ${name}:`, e)
    }
  }
}

console.log(`Building Node.js bundle for ${pkg.name}@${Script.version}...`)

const buildResult = await Bun.build({
  target: "node",
  entrypoints: ["./src/index.ts", "./src/cli/tui/worker.ts"],
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

function patchBundleFile(filePath: string, isEntry = false) {
  if (!fs.existsSync(filePath)) return
  let content = fs.readFileSync(filePath, "utf8")
  if (isEntry) {
    const warningSuppressor = `#!/usr/bin/env node
(() => {
  const [major] = (process.versions.node || "18").split(".").map(Number);
  if (major < 18) {
    process.stderr.write("AgentX requires Node.js 18+\\nhttps://nodejs.org\\n");
    process.exit(1);
  }
  const __orig = process.emitWarning;
  process.emitWarning = function(w, ...a) {
    if (typeof w === "string" && (w.includes("SQLite") || w.includes("ExperimentalWarning") || w.includes("DeprecationWarning"))) return;
    if (w && typeof w === "object" && (w.name === "ExperimentalWarning" || w.name === "DeprecationWarning" || (w.message && w.message.includes("SQLite")))) return;
    if (a[0] === "ExperimentalWarning" || a[0] === "DeprecationWarning") return;
    return Reflect.apply(__orig, process, [w, ...a]);
  };
})();
`
    if (content.startsWith("#!/usr/bin/env node")) {
      content = content.replace(/^#!\/usr\/bin\/env node\r?\n/, warningSuppressor)
    } else {
      content = warningSuppressor + content
    }
  }

  // Patch inlined bun-ffi-structs FFI_LOAD_ERROR in pre-bundled @opentui/core
  content = content.replaceAll(
    /throw new Error\(FFI_LOAD_ERROR[\s\S]*?\);/g,
    `return { ptr(value) { if (ArrayBuffer.isView(value)) return BigInt(value.byteOffset); return 0n; }, toArrayBuffer(pointer, offset, length) { return new ArrayBuffer(length ?? 0); } };`
  )

  // Patch opentui unsupported backend to provide safe JS fallback instead of throwing
  content = content.replaceAll(
    /function unavailable\d*\(cause\) \{\s*throw new Error\(FFI_UNAVAILABLE, \{ cause \}\);\s*\}/g,
    `function unavailable2(cause) { return 0; }`
  )
  content = content.replaceAll(
    /function createUnsupportedBackend\(cause\) \{[\s\S]*?^\}/gm,
    `function createUnsupportedBackend(cause) {
  let counter = 1;
  const dummySymbols = new Proxy({}, {
    get(target, prop) {
      if (typeof prop !== "string") return () => 0;
      if (prop === "encodeUnicode") return (textBytes, len, outPtr, outLen, widthMethod) => 1;
      if (prop === "getBufferWidth") return () => (process.stdout.columns || 80);
      if (prop === "getBufferHeight") return () => (process.stdout.rows || 24);
      if (prop === "getTerminalCapabilities" || prop.startsWith("set") || prop.startsWith("destroy") || prop.startsWith("clear") || prop.startsWith("reset") || prop.startsWith("sync")) {
        return (...args) => {};
      }
      return (...args) => counter++;
    }
  });
  return {
    dlopen(path, symbols) {
      const callbacks = new Set();
      return {
        symbols: dummySymbols,
        createCallback(cb, def) {
          const raw = {
            ptr: BigInt(counter++),
            threadsafe: false,
            close() {}
          };
          return createManagedCallback(raw, callbacks);
        },
        close() {}
      };
    },
    ptr(value) {
      if (ArrayBuffer.isView(value)) return BigInt(value.byteOffset || 1);
      return 1n;
    },
    suffix: process.platform === "win32" ? ".dll" : process.platform === "darwin" ? ".dylib" : ".so",
    toArrayBuffer(pointer, offset, length) {
      return new ArrayBuffer(length || 4096);
    }
  };
}`
  )

  // Patch resolveNativePackage to return the real opentui binary path located in dist/
  content = content.replaceAll(
    /async function resolveNativePackage\(\) \{[\s\S]*?^\}/gm,
    `async function resolveNativePackage() {
  const libName = process.platform === "win32" ? "opentui.dll" : process.platform === "darwin" ? "libopentui.dylib" : "libopentui.so";
  const { fileURLToPath } = createRequire(import.meta.url)("node:url");
  const libPath = fileURLToPath(new URL(libName, import.meta.url));
  return { default: libPath };
}`
  )

  // Ensure init_index_54s7pk0d finishes before init_index_0nvgrgam to prevent class extends undefined race condition
  content = content.replaceAll(
    /await __promiseAll\(\[\s*init_index_0nvgrgam\(\),\s*init_index_54s7pk0d\(\)\s*\]\);/g,
    `await init_index_54s7pk0d(); await init_index_0nvgrgam();`
  )
  content = content.replaceAll(
    /var init_index_0nvgrgam = __esm\(async \(\) => \{/g,
    `var init_index_0nvgrgam = __esm(async () => { await init_index_54s7pk0d();`
  )

  // Prepend __BunDatabaseSync definition once at the top of the file
  const bunDatabaseSyncDefinition = `var __BunDatabaseSync = (() => {
  try {
    if (typeof Bun !== "undefined") {
      const b = createRequire(import.meta.url)("bun:sqlite");
      class BunDatabaseSync extends b.Database {
        constructor(filename, options) {
          const opts = {};
          if (options) {
            if (options.readOnly || options.readonly) opts.readonly = true;
            if (options.create !== undefined) opts.create = options.create;
            if (options.readwrite !== undefined) opts.readwrite = options.readwrite;
            if (options.safeIntegers !== undefined) opts.safeIntegers = options.safeIntegers;
            if (options.strict !== undefined) opts.strict = options.strict;
          }
          super(filename, Object.keys(opts).length > 0 ? opts : undefined);
        }
        prepare(sql) {
          const stmt = super.prepare(sql);
          let returnArrays = false;
          const origAll = stmt.all.bind(stmt);
          const origGet = stmt.get.bind(stmt);
          const origValues = stmt.values.bind(stmt);
          stmt.setReadBigInts = function(val) {
            if (typeof this.safeIntegers === "function") this.safeIntegers(Boolean(val));
            return this;
          };
          stmt.setAllowBareNamedParameters = function() { return this; };
          stmt.setReturnArrays = function(val) {
            returnArrays = Boolean(val);
            return this;
          };
          stmt.all = function(...args) {
            if (returnArrays) return origValues(...args);
            return origAll(...args);
          };
          stmt.get = function(...args) {
            if (returnArrays) {
              const rows = origValues(...args);
              return rows && rows.length > 0 ? rows[0] : undefined;
            }
            return origGet(...args);
          };
          return stmt;
        }
      }
      return BunDatabaseSync;
    }
  } catch {}
  return null;
})();
`

  // Insert __BunDatabaseSync definition after shebang (or at top)
  if (content.startsWith("#!")) {
    const newlineIndex = content.indexOf("\n")
    content = content.slice(0, newlineIndex + 1) + bunDatabaseSyncDefinition + content.slice(newlineIndex + 1)
  } else {
    content = bunDatabaseSyncDefinition + content
  }

  // Convert static node:sqlite imports to dual runtime SQLite loader (bun:sqlite vs node:sqlite)
  if (content.includes('from "node:sqlite"')) {
    content = content.replace(
      /import \{ DatabaseSync \} from "node:sqlite";/g,
      'const DatabaseSync = (typeof Bun !== "undefined" && __BunDatabaseSync) ? __BunDatabaseSync : createRequire(import.meta.url)("node:sqlite").DatabaseSync;'
    ).replace(
      /import \{ DatabaseSync as DatabaseSync2 \} from "node:sqlite";/g,
      'const DatabaseSync2 = (typeof Bun !== "undefined" && __BunDatabaseSync) ? __BunDatabaseSync : createRequire(import.meta.url)("node:sqlite").DatabaseSync;'
    )
  }

  fs.writeFileSync(filePath, content, "utf8")
}

// Patch index.js and all generated worker bundles
patchBundleFile(path.resolve(dir, "dist/index.js"), true)
patchBundleFile(path.resolve(dir, "dist/worker.js"), true)
patchBundleFile(path.resolve(dir, "dist/cli/tui/worker.js"), true)

// Make executable
try {
  fs.chmodSync(path.resolve(dir, "dist/index.js"), 0o755)
} catch {}

console.log(`✓ Node.js bundle successfully generated at ${path.resolve(dir, "dist/index.js")}`)

