import os from "os"
import child_process from "child_process"
import { createOpenAICompatible } from "@ai-sdk/openai-compatible"

async function execa(cmd: string, args: string[]) {
  return new Promise<{ stdout: string; stderr: string }>((resolve, reject) => {
    child_process.execFile(cmd, args, (err, stdout, stderr) => {
      if (err) return reject(err)
      resolve({ stdout: stdout?.toString() || "", stderr: stderr?.toString() || "" })
    })
  })
}

// Supported local providers with their base URLs
export const LOCAL_PROVIDERS: Record<string, string> = {
  ollama: "http://localhost:11434/v1",
  lmstudio: "http://localhost:1234/v1",
  jan: "http://localhost:1337/v1",
  gpt4all: "http://localhost:4891/v1",
  llamacpp: "http://localhost:8080/v1",
  localai: "http://localhost:8080/v1",
}

export async function detectLocalProviders() {
  const results: Array<{ name: string; url: string; models: any[]; running: boolean }> = []
  const checks = Object.entries(LOCAL_PROVIDERS).map(async ([name, url]) => {
    try {
      const controller = new AbortController()
      const timer = setTimeout(() => controller.abort(), 3000)
      const res = await fetch(url.replace("/v1", "/api/tags"), {
        signal: controller.signal,
      }).catch(() =>
        fetch(url + "/models", {
          signal: controller.signal,
        }),
      )
      clearTimeout(timer)
      if (res && res.ok) {
        const data = await res.json()
        const models = data.models || data.data || []
        results.push({ name, url, models, running: true })
      }
    } catch {
      /* provider not running */
    }
  })
  await Promise.all(checks)
  return results
}

export function createLocalModel(baseUrl: string, modelId: string) {
  const provider = createOpenAICompatible({
    name: "local",
    baseURL: baseUrl,
  })
  return provider(modelId)
}

export async function detectHardware() {
  const ram = Math.round(os.totalmem() / 1024 / 1024 / 1024)
  const freeRam = Math.round(os.freemem() / 1024 / 1024 / 1024)
  let gpu: string | null = null
  let vram = 0
  let acceleration = "cpu-only"

  try {
    if (process.platform === "darwin") {
      const r = await execa("system_profiler", ["SPDisplaysDataType"])
      if (r.stdout.includes("Apple M")) {
        gpu = r.stdout.match(/Chip Model:.*?(M\d[^,\n]*)/)?.[1] || "Apple Silicon"
        vram = ram // unified memory
        acceleration = "metal"
      }
    } else if (process.platform === "win32") {
      const r = await execa("powershell", [
        "-Command",
        "Get-CimInstance Win32_VideoController | Select-Object Name,AdapterRAM | ConvertTo-Json",
      ])
      const data = JSON.parse(r.stdout)
      const gpuInfo = Array.isArray(data) ? data[0] : data
      gpu = gpuInfo?.Name ?? null
      vram = Math.round((gpuInfo?.AdapterRAM || 0) / 1024 / 1024 / 1024)
      const nvidiaSmi = await execa("nvidia-smi", [
        "--query-gpu=name,memory.total",
        "--format=csv,noheader",
      ]).catch(() => null)
      if (nvidiaSmi) {
        acceleration = "cuda"
      }
    } else {
      const nvidiaSmi = await execa("nvidia-smi", [
        "--query-gpu=name,memory.total",
        "--format=csv,noheader",
      ]).catch(() => null)
      if (nvidiaSmi) {
        const [name, mem] = nvidiaSmi.stdout.split(",")
        gpu = name?.trim() || null
        vram = parseInt(mem) / 1024
        acceleration = "cuda"
      }
    }
  } catch {
    /* hardware detection failed, use defaults */
  }

  return { ram, freeRam, gpu, vram, acceleration, os: process.platform }
}
