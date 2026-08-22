import { Config } from "effect"

function truthy(key: string) {
  const value = process.env[key]?.toLowerCase()
  return value === "true" || value === "1"
}

function falsy(key: string) {
  const value = process.env[key]?.toLowerCase()
  return value === "false" || value === "0"
}

export namespace Flag {
  export const OTEL_EXPORTER_OTLP_ENDPOINT = process.env["OTEL_EXPORTER_OTLP_ENDPOINT"]
  export const OTEL_EXPORTER_OTLP_HEADERS = process.env["OTEL_EXPORTER_OTLP_HEADERS"]

  export const AGENTX_AUTO_SHARE = truthy("AGENTX_AUTO_SHARE")
  export const AGENTX_AUTO_HEAP_SNAPSHOT = truthy("AGENTX_AUTO_HEAP_SNAPSHOT")
  export const AGENTX_GIT_BASH_PATH = process.env["AGENTX_GIT_BASH_PATH"]
  export const AGENTX_CONFIG = process.env["AGENTX_CONFIG"]
  export declare const AGENTX_PURE: boolean
  export declare const AGENTX_TUI_CONFIG: string | undefined
  export declare const AGENTX_CONFIG_DIR: string | undefined
  export declare const AGENTX_PLUGIN_META_FILE: string | undefined
  export const AGENTX_CONFIG_CONTENT = process.env["AGENTX_CONFIG_CONTENT"]
  export const AGENTX_DISABLE_AUTOUPDATE = truthy("AGENTX_DISABLE_AUTOUPDATE")
  export const AGENTX_ALWAYS_NOTIFY_UPDATE = truthy("AGENTX_ALWAYS_NOTIFY_UPDATE")
  export const AGENTX_DISABLE_PRUNE = truthy("AGENTX_DISABLE_PRUNE")
  export const AGENTX_DISABLE_TERMINAL_TITLE = truthy("AGENTX_DISABLE_TERMINAL_TITLE")
  export const AGENTX_SHOW_TTFD = truthy("AGENTX_SHOW_TTFD")
  export const AGENTX_PERMISSION = process.env["AGENTX_PERMISSION"]
  export const AGENTX_DISABLE_DEFAULT_PLUGINS = truthy("AGENTX_DISABLE_DEFAULT_PLUGINS")
  export const AGENTX_DISABLE_LSP_DOWNLOAD = truthy("AGENTX_DISABLE_LSP_DOWNLOAD")
  export const AGENTX_ENABLE_EXPERIMENTAL_MODELS = truthy("AGENTX_ENABLE_EXPERIMENTAL_MODELS")
  export const AGENTX_DISABLE_AUTOCOMPACT = truthy("AGENTX_DISABLE_AUTOCOMPACT")
  export const AGENTX_DISABLE_MODELS_FETCH = truthy("AGENTX_DISABLE_MODELS_FETCH")
  export const AGENTX_DISABLE_MOUSE = truthy("AGENTX_DISABLE_MOUSE")
  export const AGENTX_DISABLE_CLAUDE_CODE = truthy("AGENTX_DISABLE_CLAUDE_CODE")
  export const AGENTX_DISABLE_CLAUDE_CODE_PROMPT =
    AGENTX_DISABLE_CLAUDE_CODE || truthy("AGENTX_DISABLE_CLAUDE_CODE_PROMPT")
  export const AGENTX_DISABLE_CLAUDE_CODE_SKILLS =
    AGENTX_DISABLE_CLAUDE_CODE || truthy("AGENTX_DISABLE_CLAUDE_CODE_SKILLS")
  export const AGENTX_DISABLE_EXTERNAL_SKILLS =
    AGENTX_DISABLE_CLAUDE_CODE_SKILLS || truthy("AGENTX_DISABLE_EXTERNAL_SKILLS")
  export declare const AGENTX_DISABLE_PROJECT_CONFIG: boolean
  export const AGENTX_FAKE_VCS = process.env["AGENTX_FAKE_VCS"]
  export declare const AGENTX_CLIENT: string
  export const AGENTX_SERVER_PASSWORD = process.env["AGENTX_SERVER_PASSWORD"]
  export const AGENTX_SERVER_USERNAME = process.env["AGENTX_SERVER_USERNAME"]
  export const AGENTX_ENABLE_QUESTION_TOOL = truthy("AGENTX_ENABLE_QUESTION_TOOL")

  // Experimental
  export const AGENTX_EXPERIMENTAL = truthy("AGENTX_EXPERIMENTAL")
  export const AGENTX_EXPERIMENTAL_FILEWATCHER = Config.boolean("AGENTX_EXPERIMENTAL_FILEWATCHER").pipe(
    Config.withDefault(false),
  )
  export const AGENTX_EXPERIMENTAL_DISABLE_FILEWATCHER = Config.boolean(
    "AGENTX_EXPERIMENTAL_DISABLE_FILEWATCHER",
  ).pipe(Config.withDefault(false))
  export const AGENTX_EXPERIMENTAL_ICON_DISCOVERY =
    AGENTX_EXPERIMENTAL || truthy("AGENTX_EXPERIMENTAL_ICON_DISCOVERY")

  const copy = process.env["AGENTX_EXPERIMENTAL_DISABLE_COPY_ON_SELECT"]
  export const AGENTX_EXPERIMENTAL_DISABLE_COPY_ON_SELECT =
    copy === undefined ? process.platform === "win32" : truthy("AGENTX_EXPERIMENTAL_DISABLE_COPY_ON_SELECT")
  export const AGENTX_ENABLE_EXA =
    truthy("AGENTX_ENABLE_EXA") || AGENTX_EXPERIMENTAL || truthy("AGENTX_EXPERIMENTAL_EXA")
  export const AGENTX_EXPERIMENTAL_BASH_DEFAULT_TIMEOUT_MS = number("AGENTX_EXPERIMENTAL_BASH_DEFAULT_TIMEOUT_MS")
  export const AGENTX_EXPERIMENTAL_OUTPUT_TOKEN_MAX = number("AGENTX_EXPERIMENTAL_OUTPUT_TOKEN_MAX")
  export const AGENTX_EXPERIMENTAL_OXFMT = AGENTX_EXPERIMENTAL || truthy("AGENTX_EXPERIMENTAL_OXFMT")
  export const AGENTX_EXPERIMENTAL_LSP_TY = truthy("AGENTX_EXPERIMENTAL_LSP_TY")
  export const AGENTX_EXPERIMENTAL_LSP_TOOL = AGENTX_EXPERIMENTAL || truthy("AGENTX_EXPERIMENTAL_LSP_TOOL")
  export const AGENTX_DISABLE_FILETIME_CHECK = Config.boolean("AGENTX_DISABLE_FILETIME_CHECK").pipe(
    Config.withDefault(false),
  )
  export const AGENTX_EXPERIMENTAL_PLAN_MODE = AGENTX_EXPERIMENTAL || truthy("AGENTX_EXPERIMENTAL_PLAN_MODE")
  export const AGENTX_EXPERIMENTAL_WORKSPACES = AGENTX_EXPERIMENTAL || truthy("AGENTX_EXPERIMENTAL_WORKSPACES")
  export const AGENTX_EXPERIMENTAL_MARKDOWN = !falsy("AGENTX_EXPERIMENTAL_MARKDOWN")
  export const AGENTX_MODELS_URL = process.env["AGENTX_MODELS_URL"]
  export const AGENTX_MODELS_PATH = process.env["AGENTX_MODELS_PATH"]
  export const AGENTX_DISABLE_EMBEDDED_WEB_UI = truthy("AGENTX_DISABLE_EMBEDDED_WEB_UI")
  export const AGENTX_DB = process.env["AGENTX_DB"]
  export const AGENTX_DISABLE_CHANNEL_DB = truthy("AGENTX_DISABLE_CHANNEL_DB")
  export const AGENTX_SKIP_MIGRATIONS = truthy("AGENTX_SKIP_MIGRATIONS")
  export const AGENTX_STRICT_CONFIG_DEPS = truthy("AGENTX_STRICT_CONFIG_DEPS")

  function number(key: string) {
    const value = process.env[key]
    if (!value) return undefined
    const parsed = Number(value)
    return Number.isInteger(parsed) && parsed > 0 ? parsed : undefined
  }
}

// Dynamic getter for AGENTX_DISABLE_PROJECT_CONFIG
// This must be evaluated at access time, not module load time,
// because external tooling may set this env var at runtime
Object.defineProperty(Flag, "AGENTX_DISABLE_PROJECT_CONFIG", {
  get() {
    return truthy("AGENTX_DISABLE_PROJECT_CONFIG")
  },
  enumerable: true,
  configurable: false,
})

// Dynamic getter for AGENTX_TUI_CONFIG
// This must be evaluated at access time, not module load time,
// because tests and external tooling may set this env var at runtime
Object.defineProperty(Flag, "AGENTX_TUI_CONFIG", {
  get() {
    return process.env["AGENTX_TUI_CONFIG"]
  },
  enumerable: true,
  configurable: false,
})

// Dynamic getter for AGENTX_CONFIG_DIR
// This must be evaluated at access time, not module load time,
// because external tooling may set this env var at runtime
Object.defineProperty(Flag, "AGENTX_CONFIG_DIR", {
  get() {
    return process.env["AGENTX_CONFIG_DIR"]
  },
  enumerable: true,
  configurable: false,
})

// Dynamic getter for AGENTX_PURE
// This must be evaluated at access time, not module load time,
// because the CLI can set this flag at runtime
Object.defineProperty(Flag, "AGENTX_PURE", {
  get() {
    return truthy("AGENTX_PURE")
  },
  enumerable: true,
  configurable: false,
})

// Dynamic getter for AGENTX_PLUGIN_META_FILE
// This must be evaluated at access time, not module load time,
// because tests and external tooling may set this env var at runtime
Object.defineProperty(Flag, "AGENTX_PLUGIN_META_FILE", {
  get() {
    return process.env["AGENTX_PLUGIN_META_FILE"]
  },
  enumerable: true,
  configurable: false,
})

// Dynamic getter for AGENTX_CLIENT
// This must be evaluated at access time, not module load time,
// because some commands override the client at runtime
Object.defineProperty(Flag, "AGENTX_CLIENT", {
  get() {
    return process.env["AGENTX_CLIENT"] ?? "cli"
  },
  enumerable: true,
  configurable: false,
})
