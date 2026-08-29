import { checkModelHealth } from "./discovery"
import type { LocalRuntimeType } from "./types"

export type InstallProgressCallback = (event: {
  status: string
  progressPercent?: number
  completedBytes?: number
  totalBytes?: number
  error?: string
}) => void

export type InstallResult = {
  success: boolean
  modelId: string
  runtime: LocalRuntimeType
  endpoint: string
  healthLatencyMs?: number
  error?: string
}

export async function installModel(
  modelTag: string,
  runtime: LocalRuntimeType = "ollama",
  endpoint: string = "http://127.0.0.1:11434",
  onProgress?: InstallProgressCallback,
  signal?: AbortSignal,
): Promise<InstallResult> {
  if (runtime === "ollama") {
    return installOllamaModel(modelTag, endpoint, onProgress, signal)
  }

  // Generic runtime validation
  onProgress?.({ status: "Verifying endpoint and model availability..." })
  const health = await checkModelHealth(endpoint, modelTag, runtime)
  if (!health.healthy) {
    return {
      success: false,
      modelId: modelTag,
      runtime,
      endpoint,
      error: health.error || "Model health check failed on local runtime",
    }
  }

  return {
    success: true,
    modelId: modelTag,
    runtime,
    endpoint,
    healthLatencyMs: health.latencyMs,
  }
}

async function installOllamaModel(
  modelTag: string,
  endpoint: string,
  onProgress?: InstallProgressCallback,
  signal?: AbortSignal,
): Promise<InstallResult> {
  onProgress?.({ status: `Initiating download for ${modelTag}...`, progressPercent: 0 })

  try {
    const pullUrl = `${endpoint.replace(/\/+$/, "")}/api/pull`
    const res = await fetch(pullUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: modelTag, stream: true }),
      signal,
    })

    if (!res.ok) {
      const errText = await res.text().catch(() => "")
      return {
        success: false,
        modelId: modelTag,
        runtime: "ollama",
        endpoint,
        error: `Ollama pull failed: HTTP ${res.status} ${res.statusText} ${errText}`,
      }
    }

    if (res.body) {
      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ""

      while (true) {
        if (signal?.aborted) {
          await reader.cancel()
          return {
            success: false,
            modelId: modelTag,
            runtime: "ollama",
            endpoint,
            error: "Installation was cancelled by user.",
          }
        }

        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split("\n")
        buffer = lines.pop() || ""

        for (const line of lines) {
          if (!line.trim()) continue
          try {
            const data = JSON.parse(line)
            const status = data.status || "Downloading..."
            const completed = Number(data.completed) || 0
            const total = Number(data.total) || 0
            const progressPercent = total > 0 ? Math.round((completed / total) * 100) : undefined

            onProgress?.({
              status,
              completedBytes: completed,
              totalBytes: total,
              progressPercent,
            })

            if (data.error) {
              return {
                success: false,
                modelId: modelTag,
                runtime: "ollama",
                endpoint,
                error: data.error,
              }
            }
          } catch {
            // Ignore parse errors on partial stream chunks
          }
        }
      }
    }

    // Step 2: Verification and Real Inference Health Check
    onProgress?.({ status: "Verifying model and running test inference...", progressPercent: 100 })
    const health = await checkModelHealth(endpoint, modelTag, "ollama")

    if (!health.healthy) {
      return {
        success: false,
        modelId: modelTag,
        runtime: "ollama",
        endpoint,
        error: `Model installed but failed live inference test: ${health.error}`,
      }
    }

    onProgress?.({ status: `Model ${modelTag} is ready for inference (${health.latencyMs}ms)!` })

    return {
      success: true,
      modelId: modelTag,
      runtime: "ollama",
      endpoint,
      healthLatencyMs: health.latencyMs,
    }
  } catch (e: any) {
    if (signal?.aborted) {
      return {
        success: false,
        modelId: modelTag,
        runtime: "ollama",
        endpoint,
        error: "Installation was cancelled by user.",
      }
    }
    return {
      success: false,
      modelId: modelTag,
      runtime: "ollama",
      endpoint,
      error: e?.message || "Failed to install model",
    }
  }
}
