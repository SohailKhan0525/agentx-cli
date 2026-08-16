import { ProviderID, type ModelID } from "../schema"
import * as OpenAICompatibleChat from "../protocols/openai-compatible-chat"
import type { RouteDefaultsInput } from "../route/client"
import { AuthOptions, type ProviderAuthOption } from "../route/auth-options"
import os from "os"
import { spawnSync } from "child_process"

export const id = ProviderID.make("openai-compatible")

type GenericModelOptions = RouteDefaultsInput &
  ProviderAuthOption<"optional"> & {
    readonly provider?: string
    readonly baseURL: string
  }

export type FamilyModelOptions = RouteDefaultsInput &
  ProviderAuthOption<"optional"> & {
    readonly baseURL?: string
  }

export const routes = [OpenAICompatibleChat.route]

export const configure = (input: GenericModelOptions) => {
  const provider = input.provider ?? "openai-compatible"
  const { provider: _, baseURL, apiKey: _apiKey, auth: _auth, ...rest } = input
  const route = OpenAICompatibleChat.route.with({
    ...rest,
    provider,
    endpoint: { baseURL },
    auth: AuthOptions.bearer(input, []),
  })
  return {
    id: ProviderID.make(provider),
    model: (modelID: string | ModelID) => route.model({ id: modelID, provider: ProviderID.make(provider) }),
    configure,
  }
}

export const model = (modelID: string | ModelID, options?: GenericModelOptions) =>
  configure(options ?? { baseURL: "http://localhost:11434/v1" }).model(modelID)

// Local service detection with timeout
const checkService = async (url: string, timeoutMs = 3000) => {
  try {
    const ctl = new AbortController()
    const t = setTimeout(() => ctl.abort(), timeoutMs)
    const res = await fetch(url, { signal: ctl.signal })
    clearTimeout(t)
    return res.ok
  } catch {
    return false
  }
}

export const detectLocalServices = async (timeoutMs = 3000) => {
  const services = [
    { name: "Ollama", port: 11434, url: "http://localhost:11434/api/tags" },
    { name: "LM Studio", port: 1234, url: "http://localhost:1234/v1/models" },
    { name: "Jan", port: 1337, url: "http://localhost:1337/v1/models" },
    { name: "GPT4All", port: 4891, url: "http://localhost:4891/v1/models" },
    { name: "llama.cpp", port: 8080, url: "http://localhost:8080/v1/models" },
    { name: "LocalAI", port: 8080, url: "http://localhost:8080/v1/models" },
  ]
  const results = await Promise.all(
    services.map(async (s) => {
      const running = await checkService(s.url, timeoutMs)
      return { ...s, running }
    }),
  )
  return results.filter((s) => s.running)
}

// Hardware detection — cross-platform, no bash dependency
export const detectHardware = () => {
  const platform = process.platform
  let hasGPU = false
  let gpuInfo = ""

  /** Run a command safely as an array — no shell, no bash pipe, no string injection */
  const runCmd = (cmd: string, args: string[], timeoutMs = 2000): string => {
    const result = spawnSync(cmd, args, { stdio: "pipe", timeout: timeoutMs, windowsHide: true, encoding: "utf8" })
    if (result.status !== 0 || result.error) throw new Error(String(result.error))
    return result.stdout || ""
  }

  try {
    if (platform === "win32") {
      try {
        gpuInfo = runCmd("nvidia-smi", ["--query-gpu=name", "--format=csv,noheader"], 1500).trim()
        hasGPU = Boolean(gpuInfo)
      } catch {
        try {
          // PowerShell passed as array — no embedded shell quoting needed
          gpuInfo = runCmd(
            "powershell",
            ["-NoProfile", "-NonInteractive", "-Command",
              "Get-CimInstance -ClassName Win32_VideoController | Select-Object -ExpandProperty Name"],
            2000,
          ).trim()
          const lower = gpuInfo.toLowerCase()
          hasGPU = lower.includes("nvidia") || lower.includes("amd") || lower.includes("radeon") || lower.includes("intel")
        } catch {}
      }
    } else if (platform === "darwin") {
      try {
        gpuInfo = runCmd("system_profiler", ["SPDisplaysDataType"], 2000).trim()
        const lower = gpuInfo.toLowerCase()
        hasGPU = lower.includes("apple") || lower.includes("amd") || lower.includes("metal")
      } catch {}
    } else if (platform === "linux") {
      try {
        gpuInfo = runCmd("nvidia-smi", ["--query-gpu=name", "--format=csv,noheader"], 1500).trim()
        hasGPU = Boolean(gpuInfo)
      } catch {
        try {
          gpuInfo = runCmd("lspci", [], 1500)
          const lower = gpuInfo.toLowerCase()
          hasGPU = lower.includes("vga") || lower.includes("3d controller") || lower.includes("nvidia") || lower.includes("amd")
        } catch {}
      }
    }
  } catch {}
  return { hasGPU, gpuInfo, totalRam: os.totalmem(), freeRam: os.freemem() }
}

export const provider = {
  id,
  configure,
}

// Default local initialization pointing to Ollama endpoint
export const local = configure({ baseURL: "http://localhost:11434/v1" })
