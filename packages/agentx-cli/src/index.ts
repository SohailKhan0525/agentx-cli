#!/usr/bin/env node

const [nodeMajor] = process.versions.node ? process.versions.node.split(".").map(Number) : [22]
if (nodeMajor < 22) {
  process.stderr.write(
    "\n✗ AgentX requires Node.js 22 or higher (for built-in SQLite support).\n" +
      "  You are running: v" +
      process.versions.node +
      "\n" +
      "  Download Node.js: https://nodejs.org\n\n",
  )
  process.exit(1)
}

import fs from "node:fs"
import path from "node:path"
import { readFile, writeFile, access } from "node:fs/promises"
import { Worker as NodeWorker } from "node:worker_threads"

if (typeof (globalThis as any).Worker === "undefined") {
  ;(globalThis as any).Worker = NodeWorker
}

if (typeof (globalThis as any).Bun === "undefined") {
  const BunPolyfill: any = {
    version: "1.3.14",
    env: process.env,
    main: process.argv[1],
    sleep: (ms: number) => new Promise((resolve) => setTimeout(resolve, ms)),
    stringWidth: (str: string) => {
      if (!str) return 0
      const clean = str.replace(/\x1B\[[0-?]*[ -/]*[@-~]/g, "")
      return clean.length
    },
    file: (filePath: string) => ({
      name: filePath,
      text: () => readFile(filePath, "utf8"),
      json: async () => JSON.parse(await readFile(filePath, "utf8")),
      arrayBuffer: async () => (await readFile(filePath)).buffer,
      bytes: async () => new Uint8Array(await readFile(filePath)),
      exists: () => access(filePath).then(() => true, () => false),
      size: fs.existsSync(filePath) ? fs.statSync(filePath).size : 0,
      type: "text/plain",
    }),
    write: (dest: string, data: any) => writeFile(dest, data, "utf8"),
    nanoseconds: () => Number(process.hrtime.bigint()),
    stdin: {
      async text() {
        if (process.stdin.isTTY) return ""
        try {
          return fs.readFileSync(0, "utf8")
        } catch {
          return ""
        }
      },
    },
    which: (bin: string) => {
      const pathEnv = process.env.PATH || ""
      const pathDirs = pathEnv.split(process.platform === "win32" ? ";" : ":")
      const extensions = process.platform === "win32" ? [".exe", ".cmd", ".bat", ""] : [""]
      for (const dir of pathDirs) {
        for (const ext of extensions) {
          const full = path.join(dir, bin + ext)
          if (fs.existsSync(full)) return full
        }
      }
      return null
    },
  }
  ;(globalThis as any).Bun = BunPolyfill
}

import yargs from "yargs"
import { hideBin } from "yargs/helpers"
import { RunCommand } from "./cli/cmd/run"
import { GenerateCommand } from "./cli/cmd/generate"
import { ConsoleCommand } from "./cli/cmd/account"
import { ProvidersCommand } from "./cli/cmd/providers"
import { AgentCommand } from "./cli/cmd/agent"
import { UpgradeCommand } from "./cli/cmd/upgrade"
import { UninstallCommand } from "./cli/cmd/uninstall"
import { ModelsCommand } from "./cli/cmd/models"
import { UI } from "./cli/ui"
import { InstallationVersion } from "@agentx-cli/core/installation/version"
import { FormatError } from "./cli/error"
import { ServeCommand } from "./cli/cmd/serve"
import { DebugCommand } from "./cli/cmd/debug"
import { StatsCommand } from "./cli/cmd/stats"
import { McpCommand } from "./cli/cmd/mcp"
import { GithubCommand } from "./cli/cmd/github"
import { ExportCommand } from "./cli/cmd/export"
import { ImportCommand } from "./cli/cmd/import"
import { AttachCommand } from "./cli/cmd/attach"
import { TuiThreadCommand } from "./cli/cmd/tui"
import { AcpCommand } from "./cli/cmd/acp"
import { EOL } from "os"
import { WebCommand } from "./cli/cmd/web"
import { PrCommand } from "./cli/cmd/pr"
import { SessionCommand } from "./cli/cmd/session"
import { DbCommand } from "./cli/cmd/db"
import { errorMessage } from "./util/error"
import { PluginCommand } from "./cli/cmd/plug"
import { Heap } from "./cli/heap"

const args = hideBin(process.argv)

function show(out: string) {
  const text = out.trimStart()
  if (!text.startsWith("agentx ")) {
    process.stderr.write(UI.logo() + EOL + EOL)
    process.stderr.write(text + EOL)
    return
  }
  process.stderr.write(out)
}

const cli = yargs(args)
  .parserConfiguration({ "populate--": true })
  .scriptName("agentx")
  .wrap(100)
  .help("help", "show help")
  .alias("help", "h")
  .version("version", "show version number", InstallationVersion)
  .alias("version", "v")
  .option("print-logs", {
    describe: "print logs to stderr",
    type: "boolean",
  })
  .option("log-level", {
    describe: "log level",
    type: "string",
    choices: ["DEBUG", "INFO", "WARN", "ERROR"],
  })
  .option("pure", {
    describe: "run without external plugins",
    type: "boolean",
  })
  .middleware(async (opts) => {
    if (opts.printLogs) process.env.AGENTX_PRINT_LOGS = "1"
    if (opts.logLevel) process.env.AGENTX_LOG_LEVEL = opts.logLevel
    if (opts.pure) {
      process.env.AGENTX_PURE = "1"
    }

    Heap.start()

    process.env.AGENT = "1"
    process.env.AGENTX = "1"
    process.env.AGENTX_PID = String(process.pid)
  })
  .usage("")
  .completion("completion", "generate shell completion script")
  .command(AcpCommand)
  .command(McpCommand)
  .command(TuiThreadCommand)
  .command(AttachCommand)
  .command(RunCommand)
  .command(GenerateCommand)
  .command(DebugCommand)
  .command(ConsoleCommand)
  .command(ProvidersCommand)
  .command(AgentCommand)
  .command(UpgradeCommand)
  .command(UninstallCommand)
  .command(ServeCommand)
  .command(WebCommand)
  .command(ModelsCommand)
  .command(StatsCommand)
  .command(ExportCommand)
  .command(ImportCommand)
  .command(GithubCommand)
  .command(PrCommand)
  .command(SessionCommand)
  .command(PluginCommand)
  .command(DbCommand)
  .fail((msg, err) => {
    if (
      msg?.startsWith("Unknown argument") ||
      msg?.startsWith("Not enough non-option arguments") ||
      msg?.startsWith("Invalid values:")
    ) {
      if (err) throw err
      cli.showHelp(show)
    }
    if (err) throw err
    process.exit(1)
  })
  .strict()

try {
  if (args.includes("-h") || args.includes("--help")) {
    await cli.parse(args, (err: Error | undefined, _argv: unknown, out: string) => {
      if (err) throw err
      if (!out) return
      show(out)
    })
  } else {
    await cli.parse()
  }
} catch (e) {
  const formatted = FormatError(e)
  if (formatted) UI.error(formatted)
  if (formatted === undefined) {
    UI.error("Unexpected error" + EOL)
    process.stderr.write((e instanceof Error && e.stack ? e.stack : errorMessage(e)) + EOL)
  }
  process.exitCode = 1
} finally {
  // Some subprocesses don't react properly to SIGTERM and similar signals.
  // Most notably, some docker-container-based MCP servers don't handle such signals unless
  // run using `docker run --init`.
  // Explicitly exit to avoid any hanging subprocesses.
  process.exit()
}
