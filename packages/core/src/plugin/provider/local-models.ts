import { Effect } from "effect"
import { define } from "../internal"
import { ProviderV2 } from "../../provider"
import { ModelV2 } from "../../model"
import os from "node:os"
import { execSync } from "node:child_process"

function detectHardware() {
  let gpuName = "Unknown GPU"
  let vram = 0
  let acceleration = "cpu-only"

  try {
    if (process.platform === "darwin") {
      const output = execSync("system_profiler SPDisplaysDataType", { encoding: "utf8", stdio: "pipe" })
      if (output.includes("Apple")) {
        gpuName = "Apple Silicon"
        acceleration = "metal"
        vram = os.totalmem() // Unified memory
      }
    } else if (process.platform === "win32") {
      const output = execSync("powershell -Command \"Get-CimInstance Win32_VideoController | Select-Object -ExpandProperty Name\"", { encoding: "utf8", stdio: "pipe" })
      gpuName = output.trim().split("\n")[0].trim()
      try {
        const smi = execSync("nvidia-smi --query-gpu=memory.total --format=csv,noheader,nounits", { encoding: "utf8", stdio: "pipe" })
        vram = parseInt(smi.trim()) * 1024 * 1024
        acceleration = "cuda"
      } catch (e) {
        // No nvidia-smi
      }
    } else if (process.platform === "linux") {
      try {
        const smi = execSync("nvidia-smi --query-gpu=name,memory.total --format=csv,noheader,nounits", { encoding: "utf8", stdio: "pipe" })
        const parts = smi.trim().split(",")
        gpuName = parts[0].trim()
        vram = parseInt(parts[1].trim()) * 1024 * 1024
        acceleration = "cuda"
      } catch (e) {
        // No nvidia-smi
      }
    }
  } catch (e) {
    // Ignore detection errors
  }

  return {
    os: process.platform,
    cpu: os.cpus()[0]?.model || "Unknown CPU",
    ram: os.totalmem(),
    gpu: gpuName,
    vram,
    acceleration,
  }
}

export const LocalModelsPlugin = define({
  id: "local-models",
  effect: Effect.fn(function* (ctx) {
    const hw = detectHardware()
    
    // Model catalog based on hardware
    const catalog = [
      { id: "qwen2.5-coder:1.5b", name: "Qwen 2.5 Coder (1.5B) - Fast", tier: "fast", minRam: 4, minVram: 0 },
      { id: "qwen2.5-coder:7b", name: "Qwen 2.5 Coder (7B) - Balanced", tier: "balanced", minRam: 8, minVram: 4 },
      { id: "deepseek-coder:6.7b", name: "DeepSeek Coder (6.7B) - Balanced", tier: "balanced", minRam: 8, minVram: 4 },
      { id: "codellama:13b", name: "CodeLlama (13B) - Quality", tier: "quality", minRam: 16, minVram: 8 },
    ]

    const availableModels = catalog.filter(m => 
      (hw.ram >= m.minRam * 1024 * 1024 * 1024) && 
      (hw.vram >= m.minVram * 1024 * 1024 * 1024 || m.minVram === 0)
    )

    yield* ctx.catalog.transform(
      Effect.fn(function* (evt) {
        const localProviders = [
          { id: "ollama", name: "Ollama", baseURL: "http://localhost:11434/v1" },
          { id: "lmstudio", name: "LM Studio", baseURL: "http://localhost:1234/v1" },
          { id: "jan", name: "Jan", baseURL: "http://localhost:1337/v1" },
          { id: "gpt4all", name: "GPT4All", baseURL: "http://localhost:4891/v1" },
          { id: "llamacpp", name: "Llama.cpp", baseURL: "http://localhost:8080/v1" },
          { id: "localai", name: "LocalAI", baseURL: "http://localhost:8080/v1" },
        ]

        for (const local of localProviders) {
          evt.provider.update(ProviderV2.ID.make(local.id), (provider) => {
            provider.name = local.name
            provider.api = {
              type: "aisdk",
              package: "@ai-sdk/openai-compatible"
            }
            provider.request.body.baseURL = local.baseURL
            provider.request.body.apiKey = "local"
          })

          for (const m of availableModels) {
            evt.model.update(ProviderV2.ID.make(local.id), ModelV2.ID.make(m.id), (model) => {
              model.name = m.name
              
            })
          }
        }
      }),
    )
  }),
})
