import { Effect } from "effect"
import * as Prompt from "../../effect/prompt"
import { Auth } from "../../../auth"
import { Process } from "@/util/process"
import { text } from "node:stream/consumers"
import os from "os"

const cliTry = <Value>(message: string, fn: () => PromiseLike<Value>) =>
  Effect.tryPromise({
    try: fn,
    catch: (error) => new Error(message + String(error)),
  })

const put = Effect.fn("Cli.local.put")(function* (key: string, info: Auth.Info) {
  const auth = yield* Auth.Service
  yield* Effect.orDie(auth.set(key, info))
})

interface LocalModel {
  id: string
  name: string
  provider: "ollama" | "lmstudio" | "llamacpp"
  baseURL: string
}

const checkOllama = Effect.tryPromise(async (): Promise<LocalModel[]> => {
  try {
    const res = await fetch("http://localhost:11434/api/tags", { signal: AbortSignal.timeout(1000) })
    if (!res.ok) return []
    const data = await res.json()
    return data.models.map((m: any) => ({
      id: m.name,
      name: m.name,
      provider: "ollama",
      baseURL: "http://localhost:11434/v1"
    }))
  } catch {
    return []
  }
})

const checkLMStudio = Effect.tryPromise(async (): Promise<LocalModel[]> => {
  try {
    const res = await fetch("http://localhost:1234/v1/models", { signal: AbortSignal.timeout(1000) })
    if (!res.ok) return []
    const data = await res.json()
    return data.data.map((m: any) => ({
      id: m.id,
      name: m.id,
      provider: "lmstudio",
      baseURL: "http://localhost:1234/v1"
    }))
  } catch {
    return []
  }
})

const checkLlamaCpp = Effect.tryPromise(async (): Promise<LocalModel[]> => {
  try {
    const res = await fetch("http://localhost:8080/v1/models", { signal: AbortSignal.timeout(1000) })
    if (!res.ok) return []
    const data = await res.json()
    return data.data.map((m: any) => ({
      id: m.id,
      name: m.id,
      provider: "llamacpp",
      baseURL: "http://localhost:8080/v1"
    }))
  } catch {
    return []
  }
})

function checkHardware() {
  const cpus = os.cpus()
  const mem = os.totalmem()
  const hasGPU = cpus.some(c => c.model.toLowerCase().includes("nvidia") || c.model.toLowerCase().includes("amd") || c.model.toLowerCase().includes("apple"))
  
  const gb = mem / 1024 / 1024 / 1024
  
  if (gb < 8) return "llama3.2:1b"
  if (gb < 16) return "llama3.2:3b"
  return "llama3.1:8b"
}

export const setupLocalModel = Effect.fn("Cli.local.setupLocalModel")(function* () {
  const spinner = Prompt.spinner()
  yield* spinner.start("Scanning for local models (Ollama, LM Studio, llama.cpp)...")
  
  const [ollama, lmstudio, llamacpp] = yield* Effect.all([checkOllama, checkLMStudio, checkLlamaCpp])
  yield* spinner.stop("Done scanning")

  const models = [...ollama, ...lmstudio, ...llamacpp]

  let selectedModel: LocalModel | undefined = undefined

  if (models.length > 0) {
    const options = models.map(m => ({
      label: `${m.name} (${m.provider})`,
      value: m
    }))

    const result = yield* Prompt.select({
      message: "Select an existing local model",
      options: [...options, { label: "Download a new model", value: null }]
    })

    if (result._tag === "None") return
    selectedModel = result.value as LocalModel | undefined
  }

  if (!selectedModel) {
    // Recommend and download
    const recommended = checkHardware()
    const confirm = yield* Prompt.confirm({
      message: `No suitable model found or user opted for a new one. Based on your hardware, we recommend ${recommended}. Download now via Ollama?`,
      initial: true
    })
    
    if (confirm._tag === "None" || !confirm.value) {
      yield* Prompt.log.info("Aborted.")
      return
    }

    const downloadSpinner = Prompt.spinner()
    yield* downloadSpinner.start(`Downloading ${recommended}...`)
    
    const proc = Process.spawn(["ollama", "pull", recommended], { stdout: "pipe", stderr: "inherit" })
    if (!proc.stdout) {
      yield* downloadSpinner.stop("Failed to start Ollama. Is it installed?", 1)
      return
    }
    
    const [exit] = yield* cliTry("Failed to run ollama: ", () => Promise.all([proc.exited, text(proc.stdout!)]))
    
    if (exit !== 0) {
      yield* downloadSpinner.stop("Failed to download model.", 1)
      return
    }
    
    yield* downloadSpinner.stop(`Successfully downloaded ${recommended}`)
    
    selectedModel = {
      id: recommended,
      name: recommended,
      provider: "ollama",
      baseURL: "http://localhost:11434/v1"
    }
  }

  // Configure
  yield* put("openai-compatible", {
    type: "api",
    key: selectedModel.provider,
    metadata: {
      baseURL: selectedModel.baseURL
    }
  })
  
  yield* Prompt.log.success(`Configured AgentX to use ${selectedModel.name} via openai-compatible provider.`)
  yield* Prompt.log.info(`You can now run agentx with: agentx --model openai-compatible/${selectedModel.id}`)
})
