import { Config } from "effect"

export function truthy(key: string) {
  const value = process.env[key]?.toLowerCase()
  return value === "true" || value === "1"
}

const copy = process.env["AGENTX_EXPERIMENTAL_DISABLE_COPY_ON_SELECT"]
const fff = process.env["AGENTX_DISABLE_FFF"]

function enabledByExperimental(key: string) {
  return process.env[key] === undefined ? truthy("AGENTX_EXPERIMENTAL") : truthy(key)
}

export const Flag = {
  OTEL_EXPORTER_OTLP_ENDPOINT: process.env["OTEL_EXPORTER_OTLP_ENDPOINT"],
  OTEL_EXPORTER_OTLP_HEADERS: process.env["OTEL_EXPORTER_OTLP_HEADERS"],

  AGENTX_AUTO_HEAP_SNAPSHOT: truthy("AGENTX_AUTO_HEAP_SNAPSHOT"),
  AGENTX_GIT_BASH_PATH: process.env["AGENTX_GIT_BASH_PATH"],
  AGENTX_CONFIG: process.env["AGENTX_CONFIG"],
  AGENTX_CONFIG_CONTENT: process.env["AGENTX_CONFIG_CONTENT"],
  AGENTX_DISABLE_AUTOUPDATE: truthy("AGENTX_DISABLE_AUTOUPDATE"),
  AGENTX_ALWAYS_NOTIFY_UPDATE: truthy("AGENTX_ALWAYS_NOTIFY_UPDATE"),
  AGENTX_DISABLE_PRUNE: truthy("AGENTX_DISABLE_PRUNE"),
  AGENTX_DISABLE_TERMINAL_TITLE: truthy("AGENTX_DISABLE_TERMINAL_TITLE"),
  AGENTX_SHOW_TTFD: truthy("AGENTX_SHOW_TTFD"),
  AGENTX_DISABLE_AUTOCOMPACT: truthy("AGENTX_DISABLE_AUTOCOMPACT"),
  AGENTX_DISABLE_MODELS_FETCH: truthy("AGENTX_DISABLE_MODELS_FETCH"),
  AGENTX_DISABLE_MOUSE: truthy("AGENTX_DISABLE_MOUSE"),
  AGENTX_FAKE_VCS: process.env["AGENTX_FAKE_VCS"],
  AGENTX_SERVER_PASSWORD: process.env["AGENTX_SERVER_PASSWORD"],
  AGENTX_SERVER_USERNAME: process.env["AGENTX_SERVER_USERNAME"],
  AGENTX_DISABLE_FFF: fff === undefined ? process.platform === "win32" : truthy("AGENTX_DISABLE_FFF"),

  // Experimental
  AGENTX_EXPERIMENTAL_FILEWATCHER: Config.boolean("AGENTX_EXPERIMENTAL_FILEWATCHER").pipe(
    Config.withDefault(false),
  ),
  AGENTX_EXPERIMENTAL_DISABLE_FILEWATCHER: Config.boolean("AGENTX_EXPERIMENTAL_DISABLE_FILEWATCHER").pipe(
    Config.withDefault(false),
  ),
  AGENTX_EXPERIMENTAL_DISABLE_COPY_ON_SELECT:
    copy === undefined ? process.platform === "win32" : truthy("AGENTX_EXPERIMENTAL_DISABLE_COPY_ON_SELECT"),
  AGENTX_MODELS_URL: process.env["AGENTX_MODELS_URL"],
  AGENTX_MODELS_PATH: process.env["AGENTX_MODELS_PATH"],
  AGENTX_DB: process.env["AGENTX_DB"],

  AGENTX_WORKSPACE_ID: process.env["AGENTX_WORKSPACE_ID"],
  AGENTX_EXPERIMENTAL_WORKSPACES: enabledByExperimental("AGENTX_EXPERIMENTAL_WORKSPACES"),

  // Evaluated at access time (not module load) because tests, the CLI, and
  // external tooling set these env vars at runtime.
  get AGENTX_DISABLE_PROJECT_CONFIG() {
    return truthy("AGENTX_DISABLE_PROJECT_CONFIG")
  },
  get AGENTX_EXPERIMENTAL_REFERENCES() {
    return enabledByExperimental("AGENTX_EXPERIMENTAL_REFERENCES")
  },
  get AGENTX_TUI_CONFIG() {
    return process.env["AGENTX_TUI_CONFIG"]
  },
  get AGENTX_CONFIG_DIR() {
    return process.env["AGENTX_CONFIG_DIR"]
  },
  get AGENTX_PURE() {
    return truthy("AGENTX_PURE")
  },
  get AGENTX_PERMISSION() {
    return process.env["AGENTX_PERMISSION"]
  },
  get AGENTX_PLUGIN_META_FILE() {
    return process.env["AGENTX_PLUGIN_META_FILE"]
  },
  get AGENTX_CLIENT() {
    return process.env["AGENTX_CLIENT"] ?? "cli"
  },
}
