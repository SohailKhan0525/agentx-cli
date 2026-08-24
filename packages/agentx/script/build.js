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

// Copy typescript declarations
const dts = `/**
 * @file AgentX CLI — The AI agent that builds production-ready websites from your terminal.
 * @module @agent-qofeno/agentx-cli
 */

/**
 * Configuration options for running the AgentX website builder agent.
 */
export interface AgentXOptions {
  /** The model identifier to use (e.g., 'gpt-4o', 'claude-3-5-sonnet', 'gemini-2.0-flash', 'ollama/qwen2.5-coder:7b') */
  model?: string;
  /** Working directory where the project will be created or edited */
  cwd?: string;
  /** Optional AI provider name */
  provider?: 'openai' | 'anthropic' | 'google' | 'copilot' | 'ollama' | 'lmstudio';
  /** Whether to run in verbose debug mode */
  verbose?: boolean;
}

/**
 * Main entry point function for AgentX CLI.
 * Initializes the terminal UI and starts the website builder agent loop.
 *
 * @param args - CLI arguments or configuration options.
 * @returns A promise that resolves when the agent process completes.
 *
 * @example
 * \`\`\`ts
 * import { run } from '@agent-qofeno/agentx-cli';
 *
 * await run(['--help']);
 * \`\`\`
 */
export declare function run(args?: string[] | AgentXOptions): Promise<void>;

/**
 * Returns the current version of the AgentX CLI package.
 *
 * @returns The semantic version string (e.g., '2.0.4').
 */
export declare function getVersion(): string;

/**
 * Default export representing the AgentX runner.
 */
declare const _default: {
  run: typeof run;
  getVersion: typeof getVersion;
};

export default _default;
`;
fs.writeFileSync(path.join("dist", "index.d.ts"), dts, 'utf8');
