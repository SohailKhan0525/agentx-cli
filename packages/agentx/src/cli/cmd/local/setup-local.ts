import { Effect } from "effect"
import * as Prompt from "../../effect/prompt"
import { Auth } from "../../../auth"
import { Config } from "@/config/config"
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

type LocalModelProvider = "ollama" | "lmstudio" | "llamacpp"

type LocalModel = {
  id: string
  name: string
  provider: LocalModelProvider
  baseURL: string
}

const LOCAL_PROVIDER_ID = "local"
const LOCAL_API_KEY = "not-needed"

const isRecord = (input: unknown): input is Record<string, unknown> =>
  typeof input === "object" && input !== null && !Array.isArray(input)

const localModel = (provider: LocalModelProvider, baseURL: string) => (input: unknown): LocalModel[] => {
  const key = provider === "ollama" ? "models" : "data"
  const items = isRecord(input) && Array.isArray(input[key]) ? input[key] : []
  return items.flatMap((item) => {
    if (!isRecord(item)) return []
    const id = typeof item.name === "string" ? item.name : typeof item.id === "string" ? item.id : undefined
    if (!id) return []
    return [{ id, name: id, provider, baseURL }]
  })
}

const checkOllama = Effect.tryPromise(async (): Promise<LocalModel[]> => {
  const res = await fetch("http://127.0.0.1:11434/api/tags", { signal: AbortSignal.timeout(1000) }).catch(() => undefined)
  if (!res?.ok) return []
  return localModel("ollama", "http://127.0.0.1:11434/v1")(await res.json())
})

const checkLMStudio = Effect.tryPromise(async (): Promise<LocalModel[]> => {
  const res = await fetch("http://127.0.0.1:1234/v1/models", { signal: AbortSignal.timeout(1000) }).catch(() => undefined)
  if (!res?.ok) return []
  return localModel("lmstudio", "http://127.0.0.1:1234/v1")(await res.json())
})

const checkLlamaCpp = Effect.tryPromise(async (): Promise<LocalModel[]> => {
  const res = await fetch("http://127.0.0.1:8080/v1/models", { signal: AbortSignal.timeout(1000) }).catch(() => undefined)
  if (!res?.ok) return []
  return localModel("llamacpp", "http://127.0.0.1:8080/v1")(await res.json())
})

function checkHardware() {
  const gb = os.totalmem() / 1024 / 1024 / 1024

  if (gb < 8) return "llama3.2:1b"
  if (gb < 16) return "llama3.2:3b"
  return "llama3.1:8b"
}

const configure = Effect.fn("Cli.local.configure")(function* (model: LocalModel) {
  const config = yield* Config.Service
  yield* put(LOCAL_PROVIDER_ID, {
    type: "api",
    key: LOCAL_API_KEY,
    metadata: {
      baseURL: model.baseURL,
    },
  })
  yield* config.updateGlobal({
    model: `${LOCAL_PROVIDER_ID}/${model.id}`,
    provider: {
      [LOCAL_PROVIDER_ID]: {
        name: "Local Model",
        npm: "@ai-sdk/openai-compatible",
        env: [],
        options: { apiKey: LOCAL_API_KEY, baseURL: model.baseURL },
        models: {
          [model.id]: {
            name: model.name,
            tool_call: true,
            limit: { context: 8192, output: 2048 },
          },
        },
      },
    },
  })
})

export const setupLocalModel = Effect.fn("Cli.local.setupLocalModel")(function* () {
  const spinner = Prompt.spinner()
  yield* spinner.start("Scanning for local models (Ollama, LM Studio, llama.cpp)...")

  const [ollama, lmstudio, llamacpp] = yield* Effect.all([checkOllama, checkLMStudio, checkLlamaCpp])
  yield* spinner.stop("Done scanning")

  const models = [...ollama, ...lmstudio, ...llamacpp]

  let selectedModel: LocalModel | undefined

  if (models.length > 0) {
    const options = models.map((model) => ({
      label: `${model.name} (${model.provider})`,
      value: model,
    }))

    const result = yield* Prompt.select({
      message: "Select an existing local model",
      options: [...options, { label: "Download a new model", value: undefined }],
    })

    if (result._tag === "None") return
    selectedModel = result.value
  }

  if (!selectedModel) {
    const recommended = checkHardware()
    const confirm = yield* Prompt.confirm({
      message: `No suitable model found or user opted for a new one. Based on your hardware, we recommend ${recommended}. Download now via Ollama?`,
      initial: true,
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
      baseURL: "http://127.0.0.1:11434/v1",
    }
  }

  yield* configure(selectedModel)

  yield* Prompt.log.success(`Configured AgentX to use ${selectedModel.name} via local provider.`)
  yield* Prompt.log.info(`You can now run agentx with: agentx --model local/${selectedModel.id}`)
})
