import esbuild from "esbuild"
import path from "path"
import fs from "fs"

const pkg = JSON.parse(fs.readFileSync("package.json", "utf8"))

const reactDevtoolsStubPlugin = {
  name: "react-devtools-stub",
  setup(build) {
    build.onResolve({ filter: /^react-devtools-core$/ }, () => {
      return { path: "react-devtools-core", namespace: "devtools-stub" }
    })
    build.onLoad({ filter: /.*/, namespace: "devtools-stub" }, () => {
      return {
        contents: "export default {}; export const initialize = () => {}; export const connectToDevTools = () => {};",
        loader: "js",
      }
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
  jsx: "transform",
  banner: {
    js: `import { createRequire as __agentx_createRequire } from "node:module";
const require = __agentx_createRequire(import.meta.url);

(() => {
  const [nodeMajor] = process.versions.node.split('.').map(Number);
  if (nodeMajor < 18) {
    process.stderr.write(
      '\\nAgentX requires Node.js 18 or higher.\\n' +
      'You are running: v' + process.versions.node + '\\n' +
      'Download: https://nodejs.org\\n\\n'
    );
    process.exit(1);
  }
})();
`,
  },
  define: {
    AGENTX_VERSION: JSON.stringify(pkg.version),
    AGENTX_CHANNEL: JSON.stringify("prod"),
  },
  plugins: [reactDevtoolsStubPlugin],
  loader: {
    ".txt": "text",
    ".wasm": "binary",
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
    "ioredis",
    "better-sqlite3",
    "fsevents",
  ],
})

// Ensure yoga.wasm is copied to dist/
const wasmCandidates = [
  path.resolve("../../node_modules/yoga-wasm-web/dist/yoga.wasm"),
  path.resolve("node_modules/yoga-wasm-web/dist/yoga.wasm"),
]
for (const cand of wasmCandidates) {
  if (fs.existsSync(cand)) {
    fs.copyFileSync(cand, path.resolve("dist/yoga.wasm"))
    break
  }
}

console.log("Build successful: dist/index.js")
