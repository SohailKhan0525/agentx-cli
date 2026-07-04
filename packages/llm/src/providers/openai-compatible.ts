import { ProviderID, type ModelID } from "../schema"
import * as OpenAICompatibleChat from "../protocols/openai-compatible-chat"
import type { RouteDefaultsInput } from "../route/client"
import { AuthOptions, type ProviderAuthOption } from "../route/auth-options"
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

// Local service detection
const checkService = async (url: string) => {
  try {
    const res = await fetch(url);
    return res.ok;
  } catch {
    return false;
  }
}

export const detectLocalServices = async () => {
  const services = [
    { name: "Ollama", port: 11434, url: "http://localhost:11434" },
    { name: "LM Studio", port: 1234, url: "http://localhost:1234/v1/models" },
    { name: "Jan", port: 1337, url: "http://localhost:1337/v1/models" },
    { name: "GPT4All", port: 4891, url: "http://localhost:4891/v1/models" },
    { name: "llama.cpp", port: 8080, url: "http://localhost:8080/v1/models" },
    { name: "LocalAI", port: 8080, url: "http://localhost:8080/v1/models" }
  ];
  const detected = [];
  for (const s of services) {
    if (await checkService(s.url)) {
      detected.push(s);
    }
  }
  return detected;
}

// Hardware detection
export const detectHardware = () => {
  const platform = process.platform;
  let hasGPU = false;
  let gpuInfo = "";
  try {
    if (platform === "win32") {
      gpuInfo = execSync("Get-CimInstance -ClassName Win32_VideoController | Select-Object -Property Name", { shell: "powershell" }).toString();
      hasGPU = gpuInfo.toLowerCase().includes("nvidia") || gpuInfo.toLowerCase().includes("amd") || gpuInfo.toLowerCase().includes("radeon");
    } else if (platform === "darwin") {
      gpuInfo = execSync("system_profiler SPDisplaysDataType").toString();
      hasGPU = gpuInfo.toLowerCase().includes("apple") || gpuInfo.toLowerCase().includes("amd");
    } else if (platform === "linux") {
      gpuInfo = execSync("lspci | grep -i vga").toString();
      hasGPU = gpuInfo.toLowerCase().includes("nvidia") || gpuInfo.toLowerCase().includes("amd");
    }
  } catch (e) {
    console.error("Hardware detection failed", e);
  }
  return { hasGPU, gpuInfo };
}

export const provider = {
  id,
  configure,
}

// Keep generic initialization if needed for backwards compatibility
export const local = configure({ baseURL: "http://localhost:11434/v1" })
