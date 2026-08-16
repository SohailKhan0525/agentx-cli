import { Effect } from "effect"
import { define } from "../internal"
import { ProviderV2 } from "../../provider"
import { ModelV2 } from "../../model"
import os from "os"
import { execSync } from "child_process"

export interface HardwareProfile {
  os: string
  arch: string
  cpuCores: number
  cpuModel: string
  totalRamGb: number
  freeRamGb: number
  gpuName: string
  vramGb: number
  acceleration: "metal" | "cuda" | "rocm" | "cpu-only"
  recommendedTier: "fast" | "balanced" | "quality" | "max"
}

export interface CatalogModel {
  id: string
  name: string
  size: string
  minRamGb: number
  recommendedRamGb: number
  minVramGb: number
  contextWindow: number
  quantizations: string[]
  pullCommand: string
  tier: "fast" | "balanced" | "quality" | "champions"
  description: string
  temperature: number
}

export const LOCAL_MODEL_CATALOG: CatalogModel[] = [
  // Fast tier (<8GB RAM)
  {
    id: "qwen2.5-coder:1.5b",
    name: "Qwen 2.5 Coder 1.5B",
    size: "1.5B parameters (~1.0 GB)",
    minRamGb: 4,
    recommendedRamGb: 8,
    minVramGb: 0,
    contextWindow: 32768,
    quantizations: ["Q4_K_M", "Q8_0", "F16"],
    pullCommand: "ollama run qwen2.5-coder:1.5b",
    tier: "fast",
    description: "Ultra-fast lightweight coding model. Runs smoothly on any CPU or laptop.",
    temperature: 0.0,
  },
  {
    id: "llama3.2:3b",
    name: "Llama 3.2 3B",
    size: "3.2B parameters (~2.0 GB)",
    minRamGb: 6,
    recommendedRamGb: 8,
    minVramGb: 0,
    contextWindow: 131072,
    quantizations: ["Q4_K_M", "Q8_0"],
    pullCommand: "ollama run llama3.2:3b",
    tier: "fast",
    description: "Meta's efficient small language model with fast generation speed.",
    temperature: 0.2,
  },
  {
    id: "deepseek-r1:1.5b",
    name: "DeepSeek R1 1.5B",
    size: "1.5B parameters (~1.1 GB)",
    minRamGb: 4,
    recommendedRamGb: 8,
    minVramGb: 0,
    contextWindow: 32768,
    quantizations: ["Q4_K_M", "Q8_0"],
    pullCommand: "ollama run deepseek-r1:1.5b",
    tier: "fast",
    description: "Small reasoning distillation model with step-by-step chain of thought.",
    temperature: 0.6,
  },

  // Balanced tier (8-16GB RAM)
  {
    id: "qwen2.5-coder:7b",
    name: "Qwen 2.5 Coder 7B",
    size: "7.6B parameters (~4.7 GB)",
    minRamGb: 8,
    recommendedRamGb: 16,
    minVramGb: 4,
    contextWindow: 32768,
    quantizations: ["Q4_K_M", "Q5_K_M", "Q8_0"],
    pullCommand: "ollama run qwen2.5-coder:7b",
    tier: "balanced",
    description: "Exceptional coding performance matching GPT-4o-mini on software tasks.",
    temperature: 0.0,
  },
  {
    id: "deepseek-coder-v2:16b",
    name: "DeepSeek Coder V2 16B",
    size: "16B parameters (~8.9 GB)",
    minRamGb: 12,
    recommendedRamGb: 16,
    minVramGb: 6,
    contextWindow: 128000,
    quantizations: ["Q4_K_M", "Q8_0"],
    pullCommand: "ollama run deepseek-coder-v2:16b",
    tier: "balanced",
    description: "State-of-the-art MoE architecture specialized for 300+ programming languages.",
    temperature: 0.0,
  },
  {
    id: "llama3.1:8b",
    name: "Llama 3.1 8B",
    size: "8.0B parameters (~4.9 GB)",
    minRamGb: 8,
    recommendedRamGb: 16,
    minVramGb: 4,
    contextWindow: 128000,
    quantizations: ["Q4_K_M", "Q8_0"],
    pullCommand: "ollama run llama3.1:8b",
    tier: "balanced",
    description: "Meta's flagship 8B foundation model with large 128k context support.",
    temperature: 0.2,
  },
  {
    id: "deepseek-r1:8b",
    name: "DeepSeek R1 8B",
    size: "8.0B parameters (~4.9 GB)",
    minRamGb: 8,
    recommendedRamGb: 16,
    minVramGb: 4,
    contextWindow: 32768,
    quantizations: ["Q4_K_M", "Q8_0"],
    pullCommand: "ollama run deepseek-r1:8b",
    tier: "balanced",
    description: "Powerful reasoning model for complex debugging and architectural planning.",
    temperature: 0.6,
  },

  // Quality tier (16-32GB RAM / 8-16GB VRAM)
  {
    id: "qwen2.5-coder:14b",
    name: "Qwen 2.5 Coder 14B",
    size: "14.7B parameters (~9.0 GB)",
    minRamGb: 16,
    recommendedRamGb: 32,
    minVramGb: 8,
    contextWindow: 32768,
    quantizations: ["Q4_K_M", "Q8_0"],
    pullCommand: "ollama run qwen2.5-coder:14b",
    tier: "quality",
    description: "Near frontier-level coding capabilities with deep understanding of complex codebases.",
    temperature: 0.0,
  },
  {
    id: "qwen2.5-coder:32b",
    name: "Qwen 2.5 Coder 32B",
    size: "32.5B parameters (~19 GB)",
    minRamGb: 24,
    recommendedRamGb: 32,
    minVramGb: 16,
    contextWindow: 32768,
    quantizations: ["Q4_K_M", "Q8_0"],
    pullCommand: "ollama run qwen2.5-coder:32b",
    tier: "quality",
    description: "Industry-leading open-source coding model rivaling proprietary cloud models.",
    temperature: 0.0,
  },
  {
    id: "deepseek-r1:14b",
    name: "DeepSeek R1 14B",
    size: "14.7B parameters (~9.0 GB)",
    minRamGb: 16,
    recommendedRamGb: 32,
    minVramGb: 8,
    contextWindow: 32768,
    quantizations: ["Q4_K_M", "Q8_0"],
    pullCommand: "ollama run deepseek-r1:14b",
    tier: "quality",
    description: "Advanced reasoning model for difficult algorithmic and architectural challenges.",
    temperature: 0.6,
  },
  {
    id: "deepseek-r1:32b",
    name: "DeepSeek R1 32B",
    size: "32.5B parameters (~19 GB)",
    minRamGb: 24,
    recommendedRamGb: 32,
    minVramGb: 16,
    contextWindow: 32768,
    quantizations: ["Q4_K_M", "Q8_0"],
    pullCommand: "ollama run deepseek-r1:32b",
    tier: "quality",
    description: "Frontier open reasoning model for full-system planning and generation.",
    temperature: 0.6,
  },

  // Coding Champions
  {
    id: "qwen2.5-coder:latest",
    name: "Qwen 2.5 Coder (Latest)",
    size: "Latest default tag (~4.7 GB)",
    minRamGb: 8,
    recommendedRamGb: 16,
    minVramGb: 4,
    contextWindow: 32768,
    quantizations: ["Q4_K_M"],
    pullCommand: "ollama run qwen2.5-coder",
    tier: "champions",
    description: "Recommended general-purpose coding champion.",
    temperature: 0.0,
  },
  {
    id: "deepseek-coder-v2:latest",
    name: "DeepSeek Coder V2 (Latest)",
    size: "Latest default tag (~8.9 GB)",
    minRamGb: 12,
    recommendedRamGb: 16,
    minVramGb: 6,
    contextWindow: 128000,
    quantizations: ["Q4_K_M"],
    pullCommand: "ollama run deepseek-coder-v2",
    tier: "champions",
    description: "Champion multi-language architecture for full-stack web development.",
    temperature: 0.0,
  },
]

export function detectHardware(): HardwareProfile {
  const totalRam = os.totalmem()
  const freeRam = os.freemem()
  const totalRamGb = Math.round(totalRam / (1024 * 1024 * 1024))
  const freeRamGb = Math.round(freeRam / (1024 * 1024 * 1024))
  const cpuModel = os.cpus()[0]?.model || "Unknown CPU"
  const cpuCores = os.cpus().length

  let gpuName = "Integrated / CPU"
  let vramGb = 0
  let acceleration: HardwareProfile["acceleration"] = "cpu-only"

  try {
    if (process.platform === "darwin") {
      try {
        const brand = execSync("sysctl -n machdep.cpu.brand_string", { encoding: "utf8", stdio: "pipe" })
        if (brand.includes("Apple")) {
          gpuName = brand.trim()
          acceleration = "metal"
          vramGb = totalRamGb // Apple Silicon unified memory
        }
      } catch {
        const output = execSync("system_profiler SPDisplaysDataType", { encoding: "utf8", stdio: "pipe" })
        if (output.includes("Apple") || output.includes("M1") || output.includes("M2") || output.includes("M3") || output.includes("M4")) {
          gpuName = "Apple Silicon"
          acceleration = "metal"
          vramGb = totalRamGb
        }
      }
    } else if (process.platform === "win32") {
      try {
        const smi = execSync("nvidia-smi --query-gpu=name,memory.total --format=csv,noheader,nounits", {
          encoding: "utf8",
          stdio: "pipe",
        })
        const [name, mem] = smi.trim().split(",")
        gpuName = name?.trim() || "NVIDIA GPU"
        vramGb = Math.round(parseInt(mem?.trim() || "0") / 1024)
        acceleration = "cuda"
      } catch {
        try {
          const output = execSync(
            "powershell -NoProfile -Command \"Get-CimInstance Win32_VideoController | Select-Object -ExpandProperty Name\"",
            { encoding: "utf8", stdio: "pipe" },
          )
          gpuName = output.trim().split("\n")[0].trim() || "Standard GPU"
        } catch {}
      }
    } else if (process.platform === "linux") {
      try {
        const smi = execSync("nvidia-smi --query-gpu=name,memory.total --format=csv,noheader,nounits", {
          encoding: "utf8",
          stdio: "pipe",
        })
        const [name, mem] = smi.trim().split(",")
        gpuName = name?.trim() || "NVIDIA GPU"
        vramGb = Math.round(parseInt(mem?.trim() || "0") / 1024)
        acceleration = "cuda"
      } catch {
        try {
          const rocm = execSync("rocm-smi --showid", { encoding: "utf8", stdio: "pipe" })
          if (rocm) {
            gpuName = "AMD ROCm GPU"
            acceleration = "rocm"
          }
        } catch {}
      }
    }
  } catch {}

  let recommendedTier: HardwareProfile["recommendedTier"] = "fast"
  if (totalRamGb >= 32 || vramGb >= 16) {
    recommendedTier = "max"
  } else if (totalRamGb >= 16 || vramGb >= 8) {
    recommendedTier = "quality"
  } else if (totalRamGb >= 8 || vramGb >= 4) {
    recommendedTier = "balanced"
  }

  return {
    os: process.platform,
    arch: process.arch,
    cpuCores,
    cpuModel,
    totalRamGb,
    freeRamGb,
    gpuName,
    vramGb,
    acceleration,
    recommendedTier,
  }
}

export interface LocalServiceInfo {
  id: string
  name: string
  baseURL: string
  port: number
  running: boolean
  models: { id: string; name: string; size?: number }[]
}

export async function probeService(
  id: string,
  name: string,
  baseURL: string,
  port: number,
  timeoutMs = 3000,
): Promise<LocalServiceInfo> {
  const ctl = new AbortController()
  const timer = setTimeout(() => ctl.abort(), timeoutMs)

  try {
    const res = await fetch(`${baseURL}/models`, {
      signal: ctl.signal,
      headers: { Accept: "application/json" },
    })
    clearTimeout(timer)
    if (res.ok) {
      const data = (await res.json()) as any
      const models = Array.isArray(data.data)
        ? data.data.map((m: any) => ({ id: m.id, name: m.id }))
        : []
      return { id, name, baseURL, port, running: true, models }
    }
  } catch {}
  clearTimeout(timer)

  // Secondary check for Ollama native endpoint
  if (id === "ollama") {
    const ctl2 = new AbortController()
    const timer2 = setTimeout(() => ctl2.abort(), timeoutMs)
    try {
      const res = await fetch("http://localhost:11434/api/tags", {
        signal: ctl2.signal,
      })
      clearTimeout(timer2)
      if (res.ok) {
        const data = (await res.json()) as any
        const models = Array.isArray(data.models)
          ? data.models.map((m: any) => ({ id: m.name, name: m.name, size: m.size }))
          : []
        return { id, name, baseURL, port, running: true, models }
      }
    } catch {}
    clearTimeout(timer2)
  }

  return { id, name, baseURL, port, running: false, models: [] }
}

export async function detectAllLocalServices(timeoutMs = 3000): Promise<LocalServiceInfo[]> {
  const endpoints = [
    { id: "ollama", name: "Ollama", baseURL: "http://localhost:11434/v1", port: 11434 },
    { id: "lmstudio", name: "LM Studio", baseURL: "http://localhost:1234/v1", port: 1234 },
    { id: "jan", name: "Jan", baseURL: "http://localhost:1337/v1", port: 1337 },
    { id: "gpt4all", name: "GPT4All", baseURL: "http://localhost:4891/v1", port: 4891 },
    { id: "llamacpp", name: "llama.cpp", baseURL: "http://localhost:8080/v1", port: 8080 },
    { id: "localai", name: "LocalAI", baseURL: "http://localhost:8080/v1", port: 8080 },
  ]

  return Promise.all(endpoints.map((e) => probeService(e.id, e.name, e.baseURL, e.port, timeoutMs)))
}

export function getLocalProviderBinaryPaths(): { [provider: string]: string[] } {
  const home = os.homedir()
  const platform = process.platform

  if (platform === "win32") {
    const localAppData = process.env.LOCALAPPDATA || path.join(home, "AppData", "Local")
    const progFiles = process.env["ProgramFiles"] || "C:\\Program Files"
    return {
      ollama: [
        path.join(localAppData, "Programs", "Ollama", "ollama.exe"),
        path.join(progFiles, "Ollama", "ollama.exe"),
      ],
      lmstudio: [
        path.join(localAppData, "Programs", "LM-Studio", "LM Studio.exe"),
        path.join(localAppData, "LM-Studio", "LM Studio.exe"),
      ],
      jan: [
        path.join(localAppData, "Programs", "jan", "Jan.exe"),
        path.join(localAppData, "jan", "Jan.exe"),
      ],
    }
  }

  if (platform === "darwin") {
    return {
      ollama: ["/usr/local/bin/ollama", "/opt/homebrew/bin/ollama", path.join(home, ".ollama", "bin", "ollama")],
      lmstudio: ["/Applications/LM Studio.app", path.join(home, "Applications", "LM Studio.app")],
      jan: ["/Applications/Jan.app", path.join(home, "Applications", "Jan.app")],
    }
  }

  return {
    ollama: ["/usr/local/bin/ollama", "/usr/bin/ollama", path.join(home, ".local", "bin", "ollama")],
    lmstudio: [path.join(home, "Applications", "LM Studio.AppImage"), "/usr/local/bin/lm-studio"],
    jan: [path.join(home, "Applications", "jan.AppImage"), "/usr/local/bin/jan"],
  }
}

// Ollama Management API Utilities
export async function pullOllamaModel(
  modelName: string,
  onProgress?: (progress: { status: string; completed?: number; total?: number; percentage?: number }) => void,
): Promise<void> {
  const res = await fetch("http://localhost:11434/api/pull", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: modelName, stream: true }),
  })

  if (!res.ok || !res.body) {
    throw new Error(`Failed to initiate pull for ${modelName}: HTTP ${res.status}`)
  }

  const reader = res.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ""

  while (true) {
    const { done, value } = await reader.read()
    if (done) break

    buffer += decoder.decode(value, { stream: true })
    const lines = buffer.split("\n")
    buffer = lines.pop() ?? ""

    for (const line of lines) {
      if (!line.trim()) continue
      try {
        const parsed = JSON.parse(line)
        const completed = typeof parsed.completed === "number" ? parsed.completed : undefined
        const total = typeof parsed.total === "number" ? parsed.total : undefined
        const percentage = total && completed ? Math.round((completed / total) * 100) : undefined
        onProgress?.({
          status: parsed.status || "downloading",
          completed,
          total,
          percentage,
        })
      } catch {}
    }
  }
}

export async function deleteOllamaModel(modelName: string): Promise<boolean> {
  try {
    const res = await fetch("http://localhost:11434/api/delete", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: modelName }),
    })
    return res.ok
  } catch {
    return false
  }
}

export async function getOllamaRunningModels(): Promise<any[]> {
  try {
    const res = await fetch("http://localhost:11434/api/ps")
    if (res.ok) {
      const data = (await res.json()) as any
      return data.models || []
    }
  } catch {}
  return []
}

export const LocalModelsPlugin = define({
  id: "local-models",
  effect: Effect.fn(function* (ctx) {
    const hw = detectHardware()
    const services = yield* Effect.promise(() => detectAllLocalServices(3000))

    const recommendedModels = LOCAL_MODEL_CATALOG.filter(
      (m) => hw.totalRamGb >= m.minRamGb && (hw.vramGb >= m.minVramGb || m.minVramGb === 0),
    )

    yield* ctx.catalog.transform(
      Effect.fn(function* (evt) {
        for (const service of services) {
          evt.provider.update(ProviderV2.ID.make(service.id), (provider) => {
            provider.name = service.name
            provider.api = {
              type: "aisdk",
              package: "@ai-sdk/openai-compatible",
            }
            provider.request.body.baseURL = service.baseURL
            provider.request.body.apiKey = "local"
          })

          // Add discovered models from running service if any
          for (const m of service.models) {
            evt.model.update(ProviderV2.ID.make(service.id), ModelV2.ID.make(m.id), (model) => {
              model.name = m.name
            })
          }

          // Add recommended catalog models
          for (const m of recommendedModels) {
            evt.model.update(ProviderV2.ID.make(service.id), ModelV2.ID.make(m.id), (model) => {
              model.name = m.name
            })
          }
        }
      }),
    )
  }),
})
