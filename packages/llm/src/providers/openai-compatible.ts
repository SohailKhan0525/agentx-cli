import { ProviderID, type ModelID } from "../schema"
import * as OpenAICompatibleChat from "../protocols/openai-compatible-chat"
import type { RouteDefaultsInput } from "../route/client"
import { AuthOptions, type ProviderAuthOption } from "../route/auth-options"
import os from "os"
import { execSync } from "child_process"

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

// Hardware detection
export const detectHardware = () => {
  const platform = process.platform
  let hasGPU = false
  let gpuInfo = ""
  try {
    if (platform === "win32") {
      gpuInfo = execSync("powershell -NoProfile -Command \"Get-CimInstance -ClassName Win32_VideoController | Select-Object -Property Name\"", { stdio: "pipe" }).toString()
      hasGPU = gpuInfo.toLowerCase().includes("nvidia") || gpuInfo.toLowerCase().includes("amd") || gpuInfo.toLowerCase().includes("radeon")
    } else if (platform === "darwin") {
      gpuInfo = execSync("system_profiler SPDisplaysDataType", { stdio: "pipe" }).toString()
      hasGPU = gpuInfo.toLowerCase().includes("apple") || gpuInfo.toLowerCase().includes("amd")
    } else if (platform === "linux") {
      gpuInfo = execSync("lspci | grep -i vga", { stdio: "pipe" }).toString()
      hasGPU = gpuInfo.toLowerCase().includes("nvidia") || gpuInfo.toLowerCase().includes("amd")
    }
  } catch (e) {
    // Detection fallback
  }
  return { hasGPU, gpuInfo, totalRam: os.totalmem(), freeRam: os.freemem() }
}

export const provider = {
  id,
  configure,
}

// Default local initialization pointing to Ollama endpoint
export const local = configure({ baseURL: "http://localhost:11434/v1" })
