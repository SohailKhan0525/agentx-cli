#!/usr/bin/env node

import fs from "node:fs/promises"
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import esbuild from "esbuild"
import { Script } from "@agentx-cli/script"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const dir = path.resolve(__dirname, "..")

process.chdir(dir)

// Generate models snapshot if needed
try {
  await import("./generate.ts")
} catch (e) {
  console.warn("Warning: generate.ts skipped or failed:", e)
}

// Load migrations from migration directories
const migrationDir = path.join(dir, "migration")
let migrations = []
if (existsSync(migrationDir)) {
  const migrationDirs = (await fs.readdir(migrationDir, { withFileTypes: true }))
    .filter((entry) => entry.isDirectory() && /^\d{4}\d{2}\d{2}\d{2}\d{2}\d{2}/.test(entry.name))
    .map((entry) => entry.name)
    .sort()

  migrations = await Promise.all(
    migrationDirs.map(async (name) => {
      const file = path.join(dir, "migration", name, "migration.sql")
      const sql = existsSync(file) ? await fs.readFile(file, "utf8") : ""
      const match = /^(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/.exec(name)
      const timestamp = match
        ? Date.UTC(
            Number(match[1]),
            Number(match[2]) - 1,
            Number(match[3]),
            Number(match[4]),
            Number(match[5]),
            Number(match[6]),
          )
        : 0
      return { sql, timestamp, name }
    }),
  )
}
console.log(`Loaded ${migrations.length} migrations`)

if (!existsSync(path.join(dir, "dist"))) {
  mkdirSync(path.join(dir, "dist"), { recursive: true })
}

console.log("Building pure Node.js bundle for agentx CLI...")

await esbuild.build({
  entryPoints: ["./src/index.ts"],
  bundle: true,
  platform: "node",
  target: "node18",
  outfile: "./dist/index.js",
  format: "esm",
  banner: {
    js: `#!/usr/bin/env node
const [major] = process.versions.node.split('.').map(Number);
if (major < 18) {
  process.stderr.write('\\nAgentX requires Node.js 18 or higher.\\nYou are running: v' + process.versions.node + '\\nDownload: https://nodejs.org\\n\\n');
  process.exit(1);
}
// Suppress experimental sqlite/warning output
const __origEmitWarning = process.emitWarning;
process.emitWarning = function(w, ...a) {
  if (typeof w === "string" && (w.includes("SQLite") || w.includes("ExperimentalWarning"))) return;
  if (w && typeof w === "object" && (w.name === "ExperimentalWarning" || (w.message && w.message.includes("SQLite")))) return;
  if (a[0] === "ExperimentalWarning") return;
  return Reflect.apply(__origEmitWarning, process, [w, ...a]);
};
`,
  },
  external: [
    "@lydell/node-pty",
    "fsevents",
    "keytar",
    "canvas",
    "node-gyp",
  ],
  define: {
    AGENTX_VERSION: JSON.stringify(Script.version || "2.0.1"),
    AGENTX_MIGRATIONS: JSON.stringify(migrations),
    AGENTX_CHANNEL: JSON.stringify(Script.channel || "latest"),
    AGENTX_WORKER_PATH: JSON.stringify("./worker.js"),
    OTUI_TREE_SITTER_WORKER_PATH: JSON.stringify(""),
    AGENTX_LIBC: JSON.stringify(""),
  },
})

console.log("✓ Successfully built Node.js bundle at dist/index.js")
