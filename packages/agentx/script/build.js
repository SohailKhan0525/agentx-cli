import esbuild from "esbuild"
import path from "path"
import fs from "fs"

const openTuiPlugin = {
  name: "opentui-fix",
  setup(build) {
    build.onResolve({ filter: /^(bun|bun:.*)$/ }, (args) => {
      return { path: args.path, namespace: "bun-stub" }
    })
    build.onLoad({ filter: /.*/, namespace: "bun-stub" }, () => {
      return {
        contents: `
          export default {};
          export const ptr = () => 0;
          export const toArrayBuffer = () => new ArrayBuffer(0);
          export const JSCallback = class {};
          export const CString = class {};
          export const cc = {};
          export const FFIType = {};
          export const dlopen = () => ({ symbols: {} });
          export const Database = class {};
          export const plugin = () => {};
        `,
        loader: "js",
      }
    })
    build.onResolve({ filter: /\.(scm|wasm)$/ }, (args) => {
      return { path: args.path, namespace: "opentui-asset" }
    })
    build.onLoad({ filter: /.*/, namespace: "opentui-asset" }, () => {
      return { contents: 'export default ""', loader: "js" }
    })
    build.onLoad({ filter: /@opentui[\\/]core/ }, async (args) => {
      let contents = await fs.promises.readFile(args.path, "utf8")
      contents = contents.replace(/with\s*\{\s*type:\s*["']file["']\s*\}/g, "")
      return { contents, loader: "js" }
    })
  },
}

await esbuild.build({
  entryPoints: ["src/index.ts"],
  bundle: true,
  platform: "node",
  target: "node18",
  outfile: "dist/index.js",
  format: "esm",
  banner: {
    js: `#!/usr/bin/env node
import { createRequire as __agentx_createRequire } from "node:module";
import { fileURLToPath as __agentx_fileURLToPath } from "node:url";
import { dirname as __agentx_dirname } from "node:path";
const require = __agentx_createRequire(import.meta.url);
const __filename = __agentx_fileURLToPath(import.meta.url);
const __dirname = __agentx_dirname(__filename);
`,
  },
  define: {
    AGENTX_VERSION: JSON.stringify("2.0.1"),
    AGENTX_CHANNEL: JSON.stringify("prod"),
  },
  plugins: [openTuiPlugin],
  loader: {
    ".txt": "text",
  },
  alias: {
    "@": path.resolve("src"),
    "@tui": path.resolve("src/cli/cmd/tui"),
    "@agentx-cli/util": path.resolve("../util/src"),
    "@agentx-cli/plugin": path.resolve("../plugin/src"),
    "@agentx-cli/script": path.resolve("../script/src"),
    "@agentx-cli/sdk": path.resolve("../sdk/js/src"),
    "jsonc-parser": path.resolve("../../node_modules/jsonc-parser/lib/esm/main.js"),
  },
  external: [
    "keytar",
    "@parcel/watcher",
    "@lydell/node-pty",
    "bun-pty",
    "ioredis",
    "better-sqlite3",
    "fsevents",
  ],
})
console.log("Build successful: dist/index.js")
