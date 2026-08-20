import readline from "node:readline/promises"
import { stdin as input, stdout as output } from "node:process"
import { EOL } from "node:os"
import { Style } from "../ui"
import { createAgentXClient, type AgentXClient, type ToolPart } from "@agentx-cli/sdk/v2"
import { InstallationVersion } from "@agentx-cli/core/installation/version"
import { ServerAuth } from "@/server/auth"

export interface ReplOptions {
  directory?: string
  model?: string
  agent?: string
  continue?: boolean
  session?: string
  variant?: string
}

export async function startNodeRepl(options: ReplOptions = {}) {
  const isWindows = process.platform === "win32"
  const pointer = isWindows ? ">" : "❯"
  const check = isWindows ? "[+]" : "✓"
  const arrow = isWindows ? "->" : "→"
  const bullet = isWindows ? "*" : "◆"

  // In-process fetch router to internal AgentX server
  const fetchFn = (async (inputReq: RequestInfo | URL, init?: RequestInit) => {
    const { Server } = await import("@/server/server")
    const request = new Request(inputReq, init)
    const headers = new Headers(request.headers)
    const auth = ServerAuth.header()
    if (auth) headers.set("Authorization", auth)
    return Server.Default().app.fetch(new Request(request, { headers }))
  }) as typeof globalThis.fetch

  const directory = options.directory ?? process.cwd()
  const client = createAgentXClient({
    baseUrl: "http://localhost:4096",
    directory,
    fetch: fetchFn,
  })

  // Resolve or create session
  let sessionID: string
  try {
    if (options.session) {
      sessionID = options.session
    } else if (options.continue) {
      const list = await client.session.list()
      const latest = list.data?.[0]
      if (latest?.id) {
        sessionID = latest.id
      } else {
        const created = await client.session.create({ title: "Interactive Session" })
        sessionID = created.data!.id
      }
    } else {
      const created = await client.session.create({ title: "Interactive Session" })
      sessionID = created.data!.id
    }
  } catch {
    sessionID = "sess_" + Math.random().toString(36).slice(2, 10)
  }

  // Model & Agent state
  let currentModel = options.model
  let currentAgent = options.agent
  let currentVariant = options.variant

  // Print Claude Code-style header
  process.stdout.write(EOL)
  process.stdout.write(Style.TEXT_NORMAL_BOLD + `  AgentX v${InstallationVersion}` + Style.TEXT_NORMAL + ` (Autonomous Website Builder)` + EOL)
  process.stdout.write(Style.TEXT_DIM + `  Working directory: ${directory}` + Style.TEXT_NORMAL + EOL)
  process.stdout.write(Style.TEXT_DIM + `  Commands: /help, /models, /providers, /stats, /clear, /exit` + Style.TEXT_NORMAL + EOL + EOL)

  const rl = readline.createInterface({ input, output, terminal: true })

  async function handleSlashCommand(cmd: string): Promise<boolean> {
    const parts = cmd.trim().split(/\s+/)
    const name = parts[0].toLowerCase()
    const arg = parts.slice(1).join(" ")

    switch (name) {
      case "/help":
        process.stdout.write(EOL + Style.TEXT_NORMAL_BOLD + "  AgentX Commands:" + Style.TEXT_NORMAL + EOL)
        process.stdout.write(`    /help               Show this help message` + EOL)
        process.stdout.write(`    /models             List available AI models` + EOL)
        process.stdout.write(`    /model <name>       Switch active model (e.g. /model anthropic/claude-3-7-sonnet)` + EOL)
        process.stdout.write(`    /providers          View configured AI providers & API keys` + EOL)
        process.stdout.write(`    /stats              View token usage and cost stats` + EOL)
        process.stdout.write(`    /clear              Clear terminal screen` + EOL)
        process.stdout.write(`    /exit, /quit        Exit AgentX` + EOL + EOL)
        return true

      case "/model":
        if (arg) {
          currentModel = arg
          process.stdout.write(EOL + Style.TEXT_SUCCESS + `  ${check} Active model switched to: ${currentModel}` + Style.TEXT_NORMAL + EOL + EOL)
        } else {
          process.stdout.write(EOL + `  Current model: ${currentModel ?? "default (from configuration)"}` + EOL + EOL)
        }
        return true

      case "/models":
        try {
          const res = await client.models.list()
          process.stdout.write(EOL + Style.TEXT_NORMAL_BOLD + "  Available Models:" + Style.TEXT_NORMAL + EOL)
          for (const m of (res.data ?? []).slice(0, 20)) {
            process.stdout.write(`    - ${m.provider}/${m.id}` + EOL)
          }
          process.stdout.write(EOL)
        } catch {
          process.stdout.write(EOL + Style.TEXT_DIM + "  Run 'agentx models' to see all providers and models." + Style.TEXT_NORMAL + EOL + EOL)
        }
        return true

      case "/providers":
        try {
          const auth = await client.auth.list()
          process.stdout.write(EOL + Style.TEXT_NORMAL_BOLD + "  Configured Providers:" + Style.TEXT_NORMAL + EOL)
          for (const p of auth.data ?? []) {
            process.stdout.write(`    ${check} ${p.provider}` + EOL)
          }
          process.stdout.write(EOL)
        } catch {
          process.stdout.write(EOL + Style.TEXT_DIM + "  Run 'agentx providers' for full provider management." + Style.TEXT_NORMAL + EOL + EOL)
        }
        return true

      case "/stats":
        process.stdout.write(EOL + `  Active session: ${sessionID}` + EOL + EOL)
        return true

      case "/clear":
        console.clear()
        return true

      case "/exit":
      case "/quit":
        process.stdout.write(EOL + "Goodbye!" + EOL)
        rl.close()
        process.exit(0)
    }

    return false
  }

  async function promptLoop() {
    while (true) {
      let line: string
      try {
        line = await rl.question(Style.TEXT_NORMAL_BOLD + `${pointer} ` + Style.TEXT_NORMAL)
      } catch {
        break
      }

      const trimmed = line.trim()
      if (!trimmed) continue

      if (trimmed.startsWith("/")) {
        const handled = await handleSlashCommand(trimmed)
        if (handled) continue
      }

      // Execute prompt
      process.stdout.write(EOL)
      let textBuffer = ""
      const toggles = new Map<string, boolean>()

      try {
        const events = await client.event.subscribe()
        const eventPromise = (async () => {
          for await (const event of events.stream) {
            if (event.type === "permission.requested") {
              const req = event.properties
              process.stdout.write(
                EOL +
                  Style.TEXT_WARNING_BOLD +
                  `  ${bullet} Permission requested: ${req.permission} (${req.patterns?.join(", ") ?? ""})` +
                  Style.TEXT_NORMAL +
                  EOL,
              )
              const answer = await rl.question("  Allow this action? (y/n/a) [y]: ")
              const reply = answer.toLowerCase().startsWith("a") ? "always" : answer.toLowerCase().startsWith("n") ? "reject" : "once"
              await client.permission.reply({ requestID: req.id, reply })
              process.stdout.write(EOL)
            }

            if (event.type === "message.part.updated") {
              const part = event.properties.part
              if (part.sessionID !== sessionID) continue

              if (part.type === "tool") {
                if (part.state.status === "running" && !toggles.get(part.id)) {
                  toggles.set(part.id, true)
                  process.stdout.write(Style.TEXT_DIM + `  ${arrow} ${part.tool}...` + Style.TEXT_NORMAL + EOL)
                } else if (part.state.status === "completed" && toggles.get(part.id) !== false) {
                  toggles.set(part.id, false)
                  process.stdout.write(Style.TEXT_SUCCESS + `  ${check} ${part.tool} completed` + Style.TEXT_NORMAL + EOL)
                } else if (part.state.status === "error") {
                  toggles.set(part.id, false)
                  process.stdout.write(Style.TEXT_DANGER + `  [x] ${part.tool} failed: ${part.state.error}` + Style.TEXT_NORMAL + EOL)
                }
              }

              if (part.type === "text") {
                if (part.text && part.text.length > textBuffer.length) {
                  const delta = part.text.slice(textBuffer.length)
                  textBuffer = part.text
                  process.stdout.write(delta)
                }
              }
            }

            if (event.type === "session.idle" && event.properties.sessionID === sessionID) {
              break
            }
          }
        })()

        const modelParam = currentModel ? {
          providerID: currentModel.split("/")[0],
          modelID: currentModel.split("/").slice(1).join("/"),
        } : undefined

        const promptRes = await client.session.prompt({
          sessionID,
          agent: currentAgent,
          model: modelParam as any,
          variant: currentVariant,
          parts: [{ type: "text", text: trimmed }],
        })

        if (promptRes.error) {
          process.stdout.write(Style.TEXT_DANGER + `\nError: ${promptRes.error}\n` + Style.TEXT_NORMAL)
        } else {
          await eventPromise
        }
      } catch (err: any) {
        process.stdout.write(Style.TEXT_DANGER + `\nError: ${err?.message ?? err}\n` + Style.TEXT_NORMAL)
      }

      process.stdout.write(EOL + EOL)
    }
  }

  await promptLoop()
}

