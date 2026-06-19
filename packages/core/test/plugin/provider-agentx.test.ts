import { describe, expect } from "bun:test"
import { DateTime, Effect, Layer, Option } from "effect"
import { Catalog } from "@agentx-cli/core/catalog"
import { Credential } from "@agentx-cli/core/credential"
import { EventV2 } from "@agentx-cli/core/event"
import { Integration } from "@agentx-cli/core/integration"
import { Location } from "@agentx-cli/core/location"
import { ModelV2 } from "@agentx-cli/core/model"
import { PluginV2 } from "@agentx-cli/core/plugin"
import { AgentXPlugin } from "@agentx-cli/core/plugin/provider/agentx"
import { ProviderV2 } from "@agentx-cli/core/provider"
import { AbsolutePath } from "@agentx-cli/core/schema"
import { location } from "../fixture/location"
import { it, model, provider, withEnv } from "./provider-helper"

const cost = (input: number, output = 0) => [{ input, output, cache: { read: 0, write: 0 } }]
const locationLayer = Layer.succeed(
  Location.Service,
  Location.Service.of(location({ directory: AbsolutePath.make("test") })),
)

const pluginWithIntegrations = (integrations: Integration.Interface) => ({
  ...AgentXPlugin,
  effect: AgentXPlugin.effect.pipe(Effect.provideService(Integration.Service, integrations)),
})

describe("AgentXPlugin", () => {
  it.effect("uses a public key and disables paid models without credentials", () =>
    withEnv({ AGENTX_API_KEY: undefined }, () =>
      Effect.gen(function* () {
        const plugin = yield* PluginV2.Service
        const catalog = yield* Catalog.Service
        yield* plugin.add(pluginWithIntegrations(yield* Integration.Service))
        const transform = yield* catalog.transform()
        yield* transform((catalog) => {
          const item = provider("agentx")
          catalog.provider.update(item.id, () => {})
          const paid = model("agentx", "paid", { cost: cost(1) })
          catalog.model.update(item.id, paid.id, (draft) => {
            draft.cost = [...paid.cost]
          })
        })
        expect((yield* catalog.provider.get(ProviderV2.ID.agentx)).request.body.apiKey).toBe("public")
        expect((yield* catalog.model.get(ProviderV2.ID.agentx, ModelV2.ID.make("paid"))).enabled).toBe(false)
      }),
    ),
  )

  it.effect("keeps free models without credentials", () =>
    withEnv({ AGENTX_API_KEY: undefined }, () =>
      Effect.gen(function* () {
        const plugin = yield* PluginV2.Service
        const catalog = yield* Catalog.Service
        yield* plugin.add(pluginWithIntegrations(yield* Integration.Service))
        const transform = yield* catalog.transform()
        yield* transform((catalog) => {
          const item = provider("agentx")
          catalog.provider.update(item.id, () => {})
          const free = model("agentx", "free", { cost: cost(0) })
          catalog.model.update(item.id, free.id, (draft) => {
            draft.cost = [...free.cost]
          })
        })
        expect((yield* catalog.provider.get(ProviderV2.ID.agentx)).request.body.apiKey).toBe("public")
        expect((yield* catalog.model.get(ProviderV2.ID.agentx, ModelV2.ID.make("free"))).enabled).toBe(true)
      }),
    ),
  )

  it.effect("treats output-only cost as free without credentials", () =>
    withEnv({ AGENTX_API_KEY: undefined }, () =>
      Effect.gen(function* () {
        const plugin = yield* PluginV2.Service
        const catalog = yield* Catalog.Service
        yield* plugin.add(pluginWithIntegrations(yield* Integration.Service))
        const transform = yield* catalog.transform()
        yield* transform((catalog) => {
          const item = provider("agentx")
          catalog.provider.update(item.id, () => {})
          const outputOnly = model("agentx", "output-only", { cost: cost(0, 1) })
          catalog.model.update(item.id, outputOnly.id, (draft) => {
            draft.cost = [...outputOnly.cost]
          })
        })
        expect((yield* catalog.provider.get(ProviderV2.ID.agentx)).request.body.apiKey).toBe("public")
        expect((yield* catalog.model.get(ProviderV2.ID.agentx, ModelV2.ID.make("output-only"))).enabled).toBe(true)
      }),
    ),
  )

  it.effect("uses AGENTX_API_KEY as credentials", () =>
    withEnv({ AGENTX_API_KEY: "secret" }, () =>
      Effect.gen(function* () {
        const plugin = yield* PluginV2.Service
        const catalog = yield* Catalog.Service
        yield* plugin.add(pluginWithIntegrations(yield* Integration.Service))
        const transform = yield* catalog.transform()
        yield* transform((catalog) => {
          const item = provider("agentx")
          catalog.provider.update(item.id, () => {})
          const paid = model("agentx", "paid", { cost: cost(1) })
          catalog.model.update(item.id, paid.id, (draft) => {
            draft.cost = [...paid.cost]
          })
        })
        expect((yield* catalog.provider.get(ProviderV2.ID.agentx)).request.body.apiKey).toBeUndefined()
        expect((yield* catalog.model.get(ProviderV2.ID.agentx, ModelV2.ID.make("paid"))).enabled).toBe(true)
      }),
    ),
  )

  it.effect("uses configured provider env vars as credentials", () =>
    withEnv({ AGENTX_API_KEY: undefined, CUSTOM_AGENTX_API_KEY: "secret" }, () =>
      Effect.gen(function* () {
        const plugin = yield* PluginV2.Service
        const catalog = yield* Catalog.Service
        const integrations = yield* Integration.Service
        yield* plugin.add(pluginWithIntegrations(integrations))
        yield* integrations.update((editor) => {
          editor.method.update({
            integrationID: Integration.ID.make("agentx"),
            method: { type: "env", names: ["CUSTOM_AGENTX_API_KEY"] },
          })
        })
        const transform = yield* catalog.transform()
        yield* transform((catalog) => {
          const item = provider("agentx")
          catalog.provider.update(item.id, () => {})
          const paid = model("agentx", "paid", { cost: cost(1) })
          catalog.model.update(item.id, paid.id, (draft) => {
            draft.cost = [...paid.cost]
          })
        })
        expect((yield* catalog.provider.get(ProviderV2.ID.agentx)).request.body.apiKey).toBeUndefined()
        expect((yield* catalog.model.get(ProviderV2.ID.agentx, ModelV2.ID.make("paid"))).enabled).toBe(true)
      }),
    ),
  )

  it.effect("uses configured apiKey as credentials", () =>
    withEnv({ AGENTX_API_KEY: undefined }, () =>
      Effect.gen(function* () {
        const plugin = yield* PluginV2.Service
        const catalog = yield* Catalog.Service
        yield* plugin.add(pluginWithIntegrations(yield* Integration.Service))
        const transform = yield* catalog.transform()
        yield* transform((catalog) => {
          const item = provider("agentx", {
            request: {
              headers: {},
              body: { apiKey: "configured" },
            },
          })
          catalog.provider.update(item.id, (draft) => {
            draft.request = item.request
          })
          const paid = model("agentx", "paid", { cost: cost(1) })
          catalog.model.update(item.id, paid.id, (draft) => {
            draft.cost = [...paid.cost]
          })
        })
        expect((yield* catalog.provider.get(ProviderV2.ID.agentx)).request.body.apiKey).toBe("configured")
        expect((yield* catalog.model.get(ProviderV2.ID.agentx, ModelV2.ID.make("paid"))).enabled).toBe(true)
      }),
    ),
  )

  it.effect("ignores non-agentx providers and models", () =>
    withEnv({ AGENTX_API_KEY: undefined }, () =>
      Effect.gen(function* () {
        const plugin = yield* PluginV2.Service
        const catalog = yield* Catalog.Service
        yield* plugin.add(pluginWithIntegrations(yield* Integration.Service))
        const transform = yield* catalog.transform()
        yield* transform((catalog) => {
          const item = provider("openai")
          catalog.provider.update(item.id, () => {})
          const paid = model("openai", "paid", { cost: cost(1) })
          catalog.model.update(item.id, paid.id, (draft) => {
            draft.cost = [...paid.cost]
          })
        })
        expect((yield* catalog.provider.get(ProviderV2.ID.openai)).request.body.apiKey).toBeUndefined()
        expect((yield* catalog.model.get(ProviderV2.ID.openai, ModelV2.ID.make("paid"))).enabled).toBe(true)
      }),
    ),
  )

  it.effect("prefers gpt-5-nano as the agentx small model", () =>
    Effect.gen(function* () {
      const catalog = yield* Catalog.Service
      const providerID = ProviderV2.ID.agentx

      const transform = yield* catalog.transform()
      yield* transform((catalog) => {
        catalog.provider.update(providerID, () => {})
        catalog.model.update(providerID, ModelV2.ID.make("cheap-mini"), (model) => {
          model.capabilities.input = ["text"]
          model.capabilities.output = ["text"]
          model.cost = [...cost(1, 1)]
          model.time.released = DateTime.makeUnsafe(Date.now())
        })
        catalog.model.update(providerID, ModelV2.ID.make("gpt-5-nano"), (model) => {
          model.capabilities.input = ["text"]
          model.capabilities.output = ["text"]
          model.cost = [...cost(10, 10)]
          model.time.released = DateTime.makeUnsafe(Date.now())
        })
      })

      const selected = yield* catalog.model.small(providerID)

      expect(Option.getOrUndefined(selected)?.id).toBe(ModelV2.ID.make("gpt-5-nano"))
    }).pipe(
      Effect.provide(Catalog.locationLayer.pipe(Layer.provide(EventV2.defaultLayer), Layer.provide(locationLayer))),
    ),
  )
})
