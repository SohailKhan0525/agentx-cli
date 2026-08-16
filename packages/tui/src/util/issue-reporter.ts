import { release } from "os"
import open from "open"
import { InstallationVersion } from "@agentx-cli/core/installation/version"

export function describeOS() {
  const name =
    process.platform === "darwin"
      ? "macOS"
      : process.platform === "win32"
        ? "Windows"
        : process.platform === "linux"
          ? "Linux"
          : process.platform
  return `${name} ${release()} (${process.arch})`
}

export function describeTerminal() {
  const program = process.env.TERM_PROGRAM || process.env.TERM || "unknown"
  const version = process.env.TERM_PROGRAM_VERSION ? ` ${process.env.TERM_PROGRAM_VERSION}` : ""
  const multiplexer = process.env.TMUX ? " in tmux" : process.env.STY ? " in screen" : ""
  return `${program}${version}${multiplexer}`
}

export function buildGitHubIssueURL(options: {
  title?: string
  error?: unknown
  context?: string
}) {
  const url = new URL("https://github.com/SohailKhan0525/agentx-cli/issues/new?template=bug-report.yml")
  const errMessage =
    options.error instanceof Error
      ? options.error.message
      : typeof options.error === "string"
        ? options.error
        : options.title || "Unexpected issue"

  const stack = options.error instanceof Error ? options.error.stack || "" : ""

  url.searchParams.set("title", `[Bug]: ${options.title || errMessage}`)
  url.searchParams.set("agentx-version", InstallationVersion)
  url.searchParams.set("os", describeOS())
  url.searchParams.set("terminal", describeTerminal())
  url.searchParams.set(
    "reproduce",
    options.context || "Reported automatically from AgentX CLI. Everything is pre-filled.",
  )

  const head = `**Error details:**\n\`\`\`\n${errMessage}\n${stack ? `\nStack trace:\n${stack}\n` : ""}\`\`\`\n`
  url.searchParams.set("description", head)

  return url.toString()
}

export async function openGitHubIssue(options: {
  title?: string
  error?: unknown
  context?: string
}) {
  const url = buildGitHubIssueURL(options)
  await open(url).catch(() => {})
  return url
}
