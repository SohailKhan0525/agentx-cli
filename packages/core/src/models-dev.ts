import path from "path"
import { Context, Duration, Effect, Layer, Option, Schedule, Schema } from "effect"
import { FetchHttpClient, HttpClient, HttpClientRequest } from "effect/unstable/http"
import { ModelsDev } from "@agentx-cli/schema/models-dev"
import { Global } from "./global"
import { Flag } from "./flag/flag"
import { Flock } from "./util/flock"
import { Hash } from "./util/hash"
import { FSUtil } from "./fs-util"
import { InstallationChannel, InstallationVersion } from "./installation/version"
import { EventV2 } from "./event"
import { makeGlobalNode } from "./effect/app-node"
import { httpClient } from "./effect/app-node-platform"

export const CatalogModelStatus = Schema.Literals(["alpha", "beta", "deprecated"])
export type CatalogModelStatus = typeof CatalogModelStatus.Type

const USER_AGENT = `agentx/${InstallationChannel}/${InstallationVersion}/${Flag.AGENTX_CLIENT}`

const CostTier = Schema.Struct({
  input: Schema.Finite,
  output: Schema.Finite,
  cache_read: Schema.optional(Schema.Finite),
  cache_write: Schema.optional(Schema.Finite),
  tier: Schema.Struct({
    type: Schema.Literal("context"),
    size: Schema.Finite,
  }),
})

const Cost = Schema.Struct({
  input: Schema.Finite,
  output: Schema.Finite,
  cache_read: Schema.optional(Schema.Finite),
  cache_write: Schema.optional(Schema.Finite),
  tiers: Schema.optional(Schema.Array(CostTier)),
  context_over_200k: Schema.optional(
    Schema.Struct({
      input: Schema.Finite,
      output: Schema.Finite,
      cache_read: Schema.optional(Schema.Finite),
      cache_write: Schema.optional(Schema.Finite),
    }),
  ),
})

export const Model = Schema.Struct({
  id: Schema.String,
  name: Schema.String,
  family: Schema.optional(Schema.String),
  release_date: Schema.String,
  attachment: Schema.Boolean,
  reasoning: Schema.Boolean,
  temperature: Schema.Boolean,
  tool_call: Schema.Boolean,
  interleaved: Schema.optional(
    Schema.Union([
      Schema.Literal(true),
      Schema.Struct({
        field: Schema.Literals(["reasoning", "reasoning_content", "reasoning_details"]),
      }),
    ]),
  ),
  cost: Schema.optional(Cost),
  limit: Schema.Struct({
    context: Schema.Finite,
    input: Schema.optional(Schema.Finite),
    output: Schema.Finite,
  }),
  modalities: Schema.optional(
    Schema.Struct({
      input: Schema.Array(Schema.Literals(["text", "audio", "image", "video", "pdf"])),
      output: Schema.Array(Schema.Literals(["text", "audio", "image", "video", "pdf"])),
    }),
  ),
  experimental: Schema.optional(
    Schema.Struct({
      modes: Schema.optional(
        Schema.Record(
          Schema.String,
          Schema.Struct({
            cost: Schema.optional(Cost),
            provider: Schema.optional(
              Schema.Struct({
                body: Schema.optional(Schema.Record(Schema.String, Schema.MutableJson)),
                headers: Schema.optional(Schema.Record(Schema.String, Schema.String)),
              }),
            ),
          }),
        ),
      ),
    }),
  ),
  status: Schema.optional(CatalogModelStatus),
  provider: Schema.optional(
    Schema.Struct({ npm: Schema.optional(Schema.String), api: Schema.optional(Schema.String) }),
  ),
})
export type Model = Schema.Schema.Type<typeof Model>

export const Provider = Schema.Struct({
  api: Schema.optional(Schema.String),
  name: Schema.String,
  env: Schema.Array(Schema.String),
  id: Schema.String,
  npm: Schema.optional(Schema.String),
  models: Schema.Record(Schema.String, Model),
})

export type Provider = Schema.Schema.Type<typeof Provider>

export const Event = ModelsDev.Event

declare const AGENTX_MODELS_DEV: Record<string, Provider> | undefined

export const LOCAL_PROVIDERS: Record<string, Provider> = {
  ollama: {
    id: "ollama",
    name: "Ollama (Local)",
    env: ["OLLAMA_HOST"],
    api: "http://localhost:11434/v1",
    npm: "@ai-sdk/openai-compatible",
    models: {
      "qwen2.5-coder:1.5b": {
        id: "qwen2.5-coder:1.5b",
        name: "Qwen 2.5 Coder 1.5B",
        release_date: "2024-10-01",
        attachment: false,
        reasoning: false,
        temperature: true,
        tool_call: true,
        limit: { context: 32768, output: 8192 },
      },
      "qwen2.5-coder:7b": {
        id: "qwen2.5-coder:7b",
        name: "Qwen 2.5 Coder 7B",
        release_date: "2024-10-01",
        attachment: false,
        reasoning: false,
        temperature: true,
        tool_call: true,
        limit: { context: 32768, output: 8192 },
      },
      "qwen2.5-coder:14b": {
        id: "qwen2.5-coder:14b",
        name: "Qwen 2.5 Coder 14B",
        release_date: "2024-10-01",
        attachment: false,
        reasoning: false,
        temperature: true,
        tool_call: true,
        limit: { context: 32768, output: 8192 },
      },
      "llama3.2:3b": {
        id: "llama3.2:3b",
        name: "Llama 3.2 3B",
        release_date: "2024-09-25",
        attachment: false,
        reasoning: false,
        temperature: true,
        tool_call: true,
        limit: { context: 131072, output: 8192 },
      },
      "llama3.1:8b": {
        id: "llama3.1:8b",
        name: "Llama 3.1 8B",
        release_date: "2024-07-23",
        attachment: false,
        reasoning: false,
        temperature: true,
        tool_call: true,
        limit: { context: 131072, output: 8192 },
      },
      "deepseek-r1:1.5b": {
        id: "deepseek-r1:1.5b",
        name: "DeepSeek R1 1.5B",
        release_date: "2025-01-20",
        attachment: false,
        reasoning: true,
        temperature: true,
        tool_call: true,
        limit: { context: 32768, output: 8192 },
      },
      "deepseek-r1:8b": {
        id: "deepseek-r1:8b",
        name: "DeepSeek R1 8B",
        release_date: "2025-01-20",
        attachment: false,
        reasoning: true,
        temperature: true,
        tool_call: true,
        limit: { context: 65536, output: 8192 },
      },
      "deepseek-r1:14b": {
        id: "deepseek-r1:14b",
        name: "DeepSeek R1 14B",
        release_date: "2025-01-20",
        attachment: false,
        reasoning: true,
        temperature: true,
        tool_call: true,
        limit: { context: 65536, output: 8192 },
      },
      "deepseek-coder-v2:16b": {
        id: "deepseek-coder-v2:16b",
        name: "DeepSeek Coder V2 16B",
        release_date: "2024-06-17",
        attachment: false,
        reasoning: false,
        temperature: true,
        tool_call: true,
        limit: { context: 131072, output: 8192 },
      },
    },
  },
  lmstudio: {
    id: "lmstudio",
    name: "LM Studio (Local)",
    env: ["LMSTUDIO_HOST"],
    api: "http://localhost:1234/v1",
    npm: "@ai-sdk/openai-compatible",
    models: {
      "local-model": {
        id: "local-model",
        name: "Loaded Model in LM Studio",
        release_date: "2024-01-01",
        attachment: false,
        reasoning: false,
        temperature: true,
        tool_call: true,
        limit: { context: 32768, output: 8192 },
      },
    },
  },
  jan: {
    id: "jan",
    name: "Jan (Local)",
    env: ["JAN_HOST"],
    api: "http://localhost:1337/v1",
    npm: "@ai-sdk/openai-compatible",
    models: {
      "local-model": {
        id: "local-model",
        name: "Loaded Model in Jan",
        release_date: "2024-01-01",
        attachment: false,
        reasoning: false,
        temperature: true,
        tool_call: true,
        limit: { context: 32768, output: 8192 },
      },
    },
  },
  gpt4all: {
    id: "gpt4all",
    name: "GPT4All (Local)",
    env: ["GPT4ALL_HOST"],
    api: "http://localhost:4891/v1",
    npm: "@ai-sdk/openai-compatible",
    models: {
      "local-model": {
        id: "local-model",
        name: "Loaded Model in GPT4All",
        release_date: "2024-01-01",
        attachment: false,
        reasoning: false,
        temperature: true,
        tool_call: true,
        limit: { context: 32768, output: 8192 },
      },
    },
  },
  llamacpp: {
    id: "llamacpp",
    name: "llama.cpp (Local)",
    env: ["LLAMACPP_HOST"],
    api: "http://localhost:8080/v1",
    npm: "@ai-sdk/openai-compatible",
    models: {
      "local-model": {
        id: "local-model",
        name: "Loaded Model in llama.cpp",
        release_date: "2024-01-01",
        attachment: false,
        reasoning: false,
        temperature: true,
        tool_call: true,
        limit: { context: 32768, output: 8192 },
      },
    },
  },
  localai: {
    id: "localai",
    name: "LocalAI (Local)",
    env: ["LOCALAI_HOST"],
    api: "http://localhost:8080/v1",
    npm: "@ai-sdk/openai-compatible",
    models: {
      "local-model": {
        id: "local-model",
        name: "Loaded Model in LocalAI",
        release_date: "2024-01-01",
        attachment: false,
        reasoning: false,
        temperature: true,
        tool_call: true,
        limit: { context: 32768, output: 8192 },
      },
    },
  },
}

export interface Interface {
  readonly get: () => Effect.Effect<Record<string, Provider>>
  readonly refresh: (force?: boolean) => Effect.Effect<void>
}

export class Service extends Context.Service<Service, Interface>()("@agentx/ModelsDev") {}

const layer = Layer.effect(
  Service,
  Effect.gen(function* () {
    const fs = yield* FSUtil.Service
    const events = yield* EventV2.Service
    const http = HttpClient.filterStatusOk(
      (yield* HttpClient.HttpClient).pipe(
        HttpClient.retryTransient({
          retryOn: "errors-and-responses",
          times: 2,
          schedule: Schedule.exponential(200).pipe(Schedule.jittered),
        }),
      ),
    )

    const source = Flag.AGENTX_MODELS_URL || "https://models.dev"
    const filepath = path.join(
      Global.Path.cache,
      source === "https://models.dev" ? "models.json" : `models-${Hash.fast(source)}.json`,
    )
    const ttl = Duration.minutes(5)
    const lockKey = `models-dev:${filepath}`

    const fresh = Effect.fnUntraced(function* () {
      const stat = yield* fs.stat(filepath).pipe(Effect.catch(() => Effect.succeed(undefined)))
      if (!stat) return false
      const mtime = Option.getOrElse(stat.mtime, () => new Date(0)).getTime()
      return Date.now() - mtime < Duration.toMillis(ttl)
    })

    const fetchApi = Effect.fn("ModelsDev.fetchApi")(function* () {
      return yield* HttpClientRequest.get(`${source}/api.json`).pipe(
        HttpClientRequest.setHeader("User-Agent", USER_AGENT),
        http.execute,
        Effect.flatMap((res) => res.text),
        Effect.timeout("10 seconds"),
      )
    })

    const loadFromDisk = fs.readJson(Flag.AGENTX_MODELS_PATH ?? filepath).pipe(
      Effect.catch((error) => {
        if (
          Flag.AGENTX_MODELS_PATH === undefined &&
          error._tag === "FileSystemError" &&
          error.method === "readJson"
        ) {
          return fs.remove(filepath, { force: true }).pipe(Effect.ignore, Effect.as(undefined))
        }
        return Effect.succeed(undefined)
      }),
      Effect.map((v) => v as Record<string, Provider> | undefined),
    )

    const loadSnapshot = Effect.sync(() =>
      typeof AGENTX_MODELS_DEV === "undefined" ? undefined : AGENTX_MODELS_DEV,
    )

    const fetchAndWrite = Effect.fn("ModelsDev.fetchAndWrite")(function* () {
      const text = yield* fetchApi()
      const tempfile = `${filepath}.${process.pid}.${Date.now()}.tmp`
      yield* fs.writeWithDirs(tempfile, text).pipe(
        Effect.andThen(fs.rename(tempfile, filepath)),
        Effect.catch((error) =>
          Effect.gen(function* () {
            yield* fs.remove(tempfile, { force: true }).pipe(Effect.ignore)
            return yield* Effect.fail(error)
          }),
        ),
      )
      return text
    })

    const populate = Effect.gen(function* () {
      const fromDisk = yield* loadFromDisk
      if (fromDisk) return fromDisk
      const snapshot = yield* loadSnapshot
      if (snapshot) return snapshot
      if (Flag.AGENTX_DISABLE_MODELS_FETCH) return {}
      // Flock is cross-process: concurrent agentx CLIs can race on this cache file.
      const text = yield* Effect.scoped(
        Effect.gen(function* () {
          yield* Flock.effect(lockKey)
          return yield* fetchAndWrite()
        }),
      )
      return JSON.parse(text) as Record<string, Provider>
    }).pipe(Effect.withSpan("ModelsDev.populate"), Effect.orDie)

    const [cachedGet, invalidate] = yield* Effect.cachedInvalidateWithTTL(populate, Duration.infinity)

    const get = (): Effect.Effect<Record<string, Provider>> => cachedGet

    const refresh = Effect.fn("ModelsDev.refresh")(function* (force = false) {
      if (!force && (yield* fresh())) return
      yield* Effect.scoped(
        Effect.gen(function* () {
          yield* Flock.effect(lockKey)
          // Re-check under the lock: another process may have refreshed between
          // our outer check and lock acquisition.
          if (!force && (yield* fresh())) return
          yield* fetchAndWrite()
          yield* invalidate
          yield* events.publish(Event.Refreshed, {})
        }),
      ).pipe(
        Effect.tapCause((cause) => Effect.logError("Failed to fetch models.dev", { cause: cause })),
        Effect.ignore,
      )
    })

    if (!Flag.AGENTX_DISABLE_MODELS_FETCH && !process.argv.includes("--get-yargs-completions")) {
      // Schedule.spaced runs the effect once, then waits between completions.
      yield* Effect.forkScoped(refresh().pipe(Effect.repeat(Schedule.spaced("60 minutes")), Effect.ignore))
    }

    return Service.of({ get, refresh })
  }),
)

export const node = makeGlobalNode({ service: Service, layer: layer, deps: [FSUtil.node, EventV2.node, httpClient] })

export * as ModelsDev from "./models-dev"
