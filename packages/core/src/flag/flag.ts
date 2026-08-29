import { Config } from "effect"

export function truthy(key: string) {
  const legacyKey = key.startsWith("AGENTX_")
    ? key.replace(/^AGENTX_/, "OPENCODE_")
    : key.replace(/^OPENCODE_/, "AGENTX_")
  const value = (process.env[key] ?? process.env[legacyKey])?.toLowerCase()
  return value === "true" || value === "1"
}

export function env(key: string) {
  const legacyKey = key.startsWith("AGENTX_")
    ? key.replace(/^AGENTX_/, "OPENCODE_")
    : key.replace(/^OPENCODE_/, "AGENTX_")
  return process.env[key] ?? process.env[legacyKey]
}

function enabledByExperimental(key: string) {
  const legacyKey = key.startsWith("AGENTX_")
    ? key.replace(/^AGENTX_/, "OPENCODE_")
    : key.replace(/^OPENCODE_/, "AGENTX_")
  const isSet = process.env[key] !== undefined || process.env[legacyKey] !== undefined
  return isSet ? truthy(key) : truthy("AGENTX_EXPERIMENTAL")
}

export const Flag = {
  get OTEL_EXPORTER_OTLP_ENDPOINT() {
    return env("OTEL_EXPORTER_OTLP_ENDPOINT")
  },
  get OTEL_EXPORTER_OTLP_HEADERS() {
    return env("OTEL_EXPORTER_OTLP_HEADERS")
  },

  get AGENTX_AUTO_HEAP_SNAPSHOT() {
    return truthy("AGENTX_AUTO_HEAP_SNAPSHOT")
  },
  get AGENTX_GIT_BASH_PATH() {
    return env("AGENTX_GIT_BASH_PATH")
  },
  get AGENTX_CONFIG() {
    return env("AGENTX_CONFIG")
  },
  get AGENTX_CONFIG_CONTENT() {
    return env("AGENTX_CONFIG_CONTENT")
  },
  get AGENTX_DISABLE_AUTOUPDATE() {
    return truthy("AGENTX_DISABLE_AUTOUPDATE")
  },
  get AGENTX_ALWAYS_NOTIFY_UPDATE() {
    return truthy("AGENTX_ALWAYS_NOTIFY_UPDATE")
  },
  get AGENTX_DISABLE_PRUNE() {
    return truthy("AGENTX_DISABLE_PRUNE")
  },
  get AGENTX_DISABLE_TERMINAL_TITLE() {
    return truthy("AGENTX_DISABLE_TERMINAL_TITLE")
  },
  get AGENTX_SHOW_TTFD() {
    return truthy("AGENTX_SHOW_TTFD")
  },
  get AGENTX_DISABLE_AUTOCOMPACT() {
    return truthy("AGENTX_DISABLE_AUTOCOMPACT")
  },
  get AGENTX_DISABLE_MODELS_FETCH(): boolean {
    return truthy("AGENTX_DISABLE_MODELS_FETCH")
  },
  set AGENTX_DISABLE_MODELS_FETCH(val: boolean | undefined) {
    if (val === undefined) {
      delete process.env.AGENTX_DISABLE_MODELS_FETCH
      delete process.env.OPENCODE_DISABLE_MODELS_FETCH
    } else {
      process.env.AGENTX_DISABLE_MODELS_FETCH = String(val)
    }
  },
  get AGENTX_DISABLE_MOUSE() {
    return truthy("AGENTX_DISABLE_MOUSE")
  },
  get AGENTX_FAKE_VCS() {
    return env("AGENTX_FAKE_VCS")
  },
  get AGENTX_SERVER_PASSWORD() {
    return env("AGENTX_SERVER_PASSWORD")
  },
  get AGENTX_SERVER_USERNAME() {
    return env("AGENTX_SERVER_USERNAME")
  },
  get AGENTX_DISABLE_FFF() {
    const fff = env("AGENTX_DISABLE_FFF")
    return fff === undefined ? process.platform === "win32" : truthy("AGENTX_DISABLE_FFF")
  },

  // Experimental
  AGENTX_EXPERIMENTAL_FILEWATCHER: Config.boolean("AGENTX_EXPERIMENTAL_FILEWATCHER").pipe(
    Config.orElse(() => Config.boolean("OPENCODE_EXPERIMENTAL_FILEWATCHER")),
    Config.withDefault(false),
  ),
  AGENTX_EXPERIMENTAL_DISABLE_FILEWATCHER: Config.boolean("AGENTX_EXPERIMENTAL_DISABLE_FILEWATCHER").pipe(
    Config.orElse(() => Config.boolean("OPENCODE_EXPERIMENTAL_DISABLE_FILEWATCHER")),
    Config.withDefault(false),
  ),
  get AGENTX_EXPERIMENTAL_DISABLE_COPY_ON_SELECT() {
    const copy = env("AGENTX_EXPERIMENTAL_DISABLE_COPY_ON_SELECT")
    return copy === undefined ? process.platform === "win32" : truthy("AGENTX_EXPERIMENTAL_DISABLE_COPY_ON_SELECT")
  },
  get AGENTX_MODELS_URL() {
    return env("AGENTX_MODELS_URL")
  },
  get AGENTX_MODELS_PATH(): string | undefined {
    return env("AGENTX_MODELS_PATH")
  },
  set AGENTX_MODELS_PATH(val: string | undefined) {
    if (val === undefined) {
      delete process.env.AGENTX_MODELS_PATH
      delete process.env.OPENCODE_MODELS_PATH
    } else {
      process.env.AGENTX_MODELS_PATH = val
    }
  },
  get AGENTX_DB() {
    return env("AGENTX_DB")
  },

  get AGENTX_WORKSPACE_ID() {
    return env("AGENTX_WORKSPACE_ID")
  },
  get AGENTX_EXPERIMENTAL_WORKSPACES() {
    return enabledByExperimental("AGENTX_EXPERIMENTAL_WORKSPACES")
  },

  // Evaluated at access time (not module load) because tests, the CLI, and
  // external tooling set these env vars at runtime.
  get AGENTX_DISABLE_PROJECT_CONFIG() {
    return truthy("AGENTX_DISABLE_PROJECT_CONFIG")
  },
  get AGENTX_EXPERIMENTAL_REFERENCES() {
    return enabledByExperimental("AGENTX_EXPERIMENTAL_REFERENCES")
  },
  get AGENTX_TUI_CONFIG() {
    return env("AGENTX_TUI_CONFIG")
  },
  get AGENTX_CONFIG_DIR() {
    return env("AGENTX_CONFIG_DIR")
  },
  get AGENTX_PURE() {
    return truthy("AGENTX_PURE")
  },
  get AGENTX_PERMISSION() {
    return env("AGENTX_PERMISSION")
  },
  get AGENTX_PLUGIN_META_FILE() {
    return env("AGENTX_PLUGIN_META_FILE")
  },
  get AGENTX_CLIENT() {
    return env("AGENTX_CLIENT") ?? "cli"
  },

  // OPENCODE aliases
  get OPENCODE_DISABLE_PROJECT_CONFIG() {
    return truthy("AGENTX_DISABLE_PROJECT_CONFIG")
  },
  get OPENCODE_CONFIG_DIR() {
    return env("AGENTX_CONFIG_DIR")
  },
  get OPENCODE_TUI_CONFIG() {
    return env("AGENTX_TUI_CONFIG")
  },
  get OPENCODE_CONFIG() {
    return env("AGENTX_CONFIG")
  },
  get OPENCODE_PURE() {
    return truthy("AGENTX_PURE")
  },
}
