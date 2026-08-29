import type { InstalledModelInfo, LocalRuntimeInfo } from "./types"

type ProbeTarget = {
  type: LocalRuntimeInfo["type"]
  name: string
  defaultPort: number
  envVar?: string
  tagsPath: string
  modelsParser: (data: any, endpoint: string) => InstalledModelInfo[]
}

const RUNTIME_PROBES: ProbeTarget[] = [
  {
    type: "ollama",
    name: "Ollama",
    defaultPort: 11434,
    envVar: "OLLAMA_HOST",
    tagsPath: "/api/tags",
    modelsParser: (data: any, endpoint: string) => {
      const models = data?.models || []
      return models.map((m: any) => {
        const sizeBytes = Number(m.size) || 0
        const sizeGb = Math.round((sizeBytes / 1024 / 1024 / 1024) * 10) / 10
        const quant = m.details?.quantization_level || m.details?.parameter_size || "unknown"
        const family = m.details?.family || "unknown"
        return {
          id: `ollama/${m.name}`,
          name: m.name,
          runtime: "ollama",
          sizeBytes,
          sizeFormatted: `${sizeGb} GB`,
          quantization: quant,
          family,
          format: m.details?.format || "gguf",
          modifiedAt: m.modified_at,
          digest: m.digest,
          healthy: true,
        }
      })
    },
  },
  {
    type: "lmstudio",
    name: "LM Studio",
    defaultPort: 1234,
    envVar: "LMSTUDIO_HOST",
    tagsPath: "/v1/models",
    modelsParser: (data: any, endpoint: string) => {
      const models = data?.data || []
      return models.map((m: any) => ({
        id: `lmstudio/${m.id}`,
        name: m.id,
        runtime: "lmstudio",
        format: "gguf",
        healthy: true,
      }))
    },
  },
  {
    type: "llamacpp",
    name: "llama.cpp server",
    defaultPort: 8080,
    envVar: "LLAMACPP_HOST",
    tagsPath: "/v1/models",
    modelsParser: (data: any, endpoint: string) => {
      const models = data?.data || []
      return models.map((m: any) => ({
        id: `llamacpp/${m.id}`,
        name: m.id,
        runtime: "llamacpp",
        format: "gguf",
        healthy: true,
      }))
    },
  },
  {
    type: "vllm",
    name: "vLLM",
    defaultPort: 8000,
    envVar: "VLLM_HOST",
    tagsPath: "/v1/models",
    modelsParser: (data: any, endpoint: string) => {
      const models = data?.data || []
      return models.map((m: any) => ({
        id: `vllm/${m.id}`,
        name: m.id,
        runtime: "vllm",
        healthy: true,
      }))
    },
  },
]

export async function discoverLocalRuntimes(): Promise<LocalRuntimeInfo[]> {
  const probePromises = RUNTIME_PROBES.map(async (target) => {
    let host = "http://127.0.0.1"
    if (target.envVar && process.env[target.envVar]) {
      const custom = process.env[target.envVar]!.trim()
      host = custom.startsWith("http") ? custom : `http://${custom}`
    } else {
      host = `http://127.0.0.1:${target.defaultPort}`
    }

    // Ensure host does not have trailing slash
    host = host.replace(/\/+$/, "")
    const url = `${host}${target.tagsPath}`

    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 1200)
      const res = await fetch(url, { signal: controller.signal, headers: { Accept: "application/json" } })
      clearTimeout(timeoutId)

      if (res.ok) {
        const data = await res.json().catch(() => null)
        if (data) {
          const models = target.modelsParser(data, host)
          return {
            type: target.type,
            name: target.name,
            endpoint: host,
            running: true,
            models,
          }
        }
      }
    } catch {
      // Endpoint is not running or unreachable
    }

    return {
      type: target.type,
      name: target.name,
      endpoint: host,
      running: false,
      models: [],
    }
  })

  return Promise.all(probePromises)
}

export async function checkModelHealth(
  endpoint: string,
  modelName: string,
  runtime: LocalRuntimeInfo["type"],
): Promise<{
  healthy: boolean
  latencyMs: number
  error?: string
}> {
  const startTime = Date.now()
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000)

    if (runtime === "ollama") {
      const res = await fetch(`${endpoint}/api/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: modelName,
          prompt: "Hi",
          stream: false,
          options: { num_predict: 1 },
        }),
        signal: controller.signal,
      })
      clearTimeout(timeoutId)
      const latencyMs = Date.now() - startTime
      if (res.ok) {
        return { healthy: true, latencyMs }
      }
      return { healthy: false, latencyMs, error: `HTTP ${res.status}: ${res.statusText}` }
    }

    // OpenAI compatible endpoints (LM Studio, llama.cpp, vLLM)
    const res = await fetch(`${endpoint}/v1/chat/completions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: modelName,
        messages: [{ role: "user", content: "Hi" }],
        max_tokens: 1,
      }),
      signal: controller.signal,
    })
    clearTimeout(timeoutId)
    const latencyMs = Date.now() - startTime
    if (res.ok) {
      return { healthy: true, latencyMs }
    }
    return { healthy: false, latencyMs, error: `HTTP ${res.status}: ${res.statusText}` }
  } catch (e: any) {
    return {
      healthy: false,
      latencyMs: Date.now() - startTime,
      error: e?.message || "Health check timed out or failed",
    }
  }
}
