import { createMemo, createSignal, onMount, Show } from "solid-js"
import { useSync } from "../context/sync"
import { filter, map, pipe, sortBy } from "remeda"
import { DialogSelect } from "../ui/dialog-select"
import { useDialog } from "../ui/dialog"
import { useSDK } from "../context/sdk"
import { DialogPrompt } from "../ui/dialog-prompt"
import { Link } from "../ui/link"
import { useTheme } from "../context/theme"
import { TextAttributes } from "@opentui/core"
import type { ProviderAuthAuthorization, ProviderAuthMethod } from "@agentx-cli/sdk/v2"
import { DialogModel } from "./dialog-model"
import { useToast } from "../ui/toast"
import { isConsoleManagedProvider } from "../util/provider-origin"
import { useConnected } from "./use-connected"
import { useBindings } from "../keymap"
import { useClipboard } from "../context/clipboard"
import { DialogLocalModelSetup } from "./dialog-local-setup"
import { probeService } from "@agentx-cli/core/plugin/provider/local-models"

const PROVIDER_PRIORITY: Record<string, number> = {
  "github-copilot": 0,
  openai: 1,
  google: 2,
  anthropic: 3,
  ollama: 4,
  lmstudio: 5,
  jan: 6,
  gpt4all: 7,
  llamacpp: 8,
  localai: 9,
}

const ALLOWED_PROVIDERS = new Set([
  "github-copilot",
  "openai",
  "google",
  "anthropic",
  "ollama",
  "lmstudio",
  "jan",
  "gpt4all",
  "llamacpp",
  "localai",
])

const CUSTOM_PROVIDER_OPTION_VALUE = "__agentx_custom_provider__"
const CUSTOM_PROVIDER_ID = /^[a-z0-9][a-z0-9-_]*$/

type ProviderOptionBase = {
  title: string
  value: string
  description?: string
  category: string
}

type ProviderOption =
  | (ProviderOptionBase & {
      type: "provider"
      providerID: string
    })
  | (ProviderOptionBase & {
      type: "custom"
    })

const DEFAULT_LOCAL_PROVIDERS = [
  { id: "github-copilot", name: "GitHub Copilot" },
  { id: "openai", name: "ChatGPT (OpenAI)" },
  { id: "google", name: "Google (Gemini)" },
  { id: "anthropic", name: "Anthropic (Claude)" },
  { id: "ollama", name: "Ollama (Local)" },
  { id: "lmstudio", name: "LM Studio (Local)" },
  { id: "jan", name: "Jan (Local)" },
  { id: "gpt4all", name: "GPT4All (Local)" },
  { id: "llamacpp", name: "llama.cpp (Local)" },
  { id: "localai", name: "LocalAI (Local)" },
]

export function providerOptions(list: { id: string; name: string }[]): ProviderOption[] {
  return [
    ...pipe(
      list,
      sortBy(
        (x) => PROVIDER_PRIORITY[x.id] ?? 99,
        (x) => x.name.toLowerCase(),
        (x) => x.id,
      ),
      map((provider) => ({
        type: "provider" as const,
        title: {
          "github-copilot": "GitHub Copilot",
          openai: "ChatGPT (OpenAI)",
          google: "Google (Gemini)",
          anthropic: "Anthropic (Claude)",
          ollama: "Ollama (Local)",
          lmstudio: "LM Studio (Local)",
          jan: "Jan (Local)",
          gpt4all: "GPT4All (Local)",
          llamacpp: "llama.cpp (Local)",
          localai: "LocalAI (Local)",
        }[provider.id] ?? provider.name,
        value: provider.id,
        providerID: provider.id,
        description: {
          "github-copilot": "(GitHub PAT)",
          openai: "(API key)",
          google: "(Google AI Studio key)",
          anthropic: "(API key)",
          ollama: "(Local port 11434)",
          lmstudio: "(Local port 1234)",
          jan: "(Local port 1337)",
          gpt4all: "(Local port 4891)",
          llamacpp: "(Local port 8080)",
          localai: "(Local port 8080)",
        }[provider.id],
        category: ["ollama", "lmstudio", "jan", "gpt4all", "llamacpp", "localai"].includes(provider.id)
          ? "Local Models"
          : "Providers",
      })),
    ),
    {
      type: "custom",
      title: "Other",
      value: CUSTOM_PROVIDER_OPTION_VALUE,
      description: "Custom provider",
      category: "Providers",
    },
  ]
}

export function normalizeCustomProviderID(value: string) {
  const providerID = value.trim().replace(/^@ai-sdk\//, "")
  if (!CUSTOM_PROVIDER_ID.test(providerID)) return
  return providerID
}

export function createDialogProviderOptions() {
  const sync = useSync()
  const dialog = useDialog()
  const sdk = useSDK()
  const toast = useToast()
  const { theme } = useTheme()
  const onboarded = useConnected()

  async function promptCustomProviderID(): Promise<string | undefined> {
    const value = await DialogPrompt.show(dialog, "Other", {
      placeholder: "Provider id",
      description: () => (
        <text fg={theme.textMuted}>
          This only stores a credential. Configure the provider in agentx.json to use it.
        </text>
      ),
    })
    if (value === null) return

    const providerID = normalizeCustomProviderID(value)
    if (providerID) return providerID

    toast.show({
      variant: "error",
      message:
        "Provider ids must start with a lowercase letter or number and only use lowercase letters, numbers, hyphens, and underscores",
    })
    return promptCustomProviderID()
  }

  const options = createMemo(() => {
    const rawList = sync.data.provider_next.all || []
    const mergedMap = new Map<string, { id: string; name: string }>()
    for (const item of DEFAULT_LOCAL_PROVIDERS) {
      mergedMap.set(item.id, item)
    }
    for (const item of rawList) {
      mergedMap.set(item.id, item)
    }
    return pipe(
      providerOptions(Array.from(mergedMap.values())),
      map((provider) => {
        if (provider.type === "custom") {
          return {
            title: provider.title,
            value: provider.value,
            description: provider.description,
            category: provider.category,
            async onSelect() {
              const providerID = await promptCustomProviderID()
              if (!providerID) return
              return dialog.replace(() => <ApiMethod providerID={providerID} title="API key" custom />)
            },
          }
        }

        const providerID = provider.providerID
        const consoleManaged = isConsoleManagedProvider(sync.data.console_state.consoleManagedProviders, providerID)
        const connected = sync.data.provider_next.connected.includes(providerID)

        return {
          title: provider.title,
          value: provider.value,
          description: provider.description,
          footer: consoleManaged ? sync.data.console_state.activeOrgName : undefined,
          category: provider.category,
          gutter: connected && onboarded() ? () => <text fg={theme.success}>✓</text> : undefined,
          async onSelect() {
            if (consoleManaged) return

            if (["ollama", "lmstudio", "jan", "gpt4all", "llamacpp", "localai"].includes(providerID)) {
              // Probe if local provider is actively running
              const probe = await probeService(providerID, provider.title, "http://localhost:11434/v1", 11434, 1500)
              if (probe.running) {
                await sdk.client.auth.set({
                  providerID,
                  auth: {
                    type: "api",
                    key: "local",
                  },
                })
                await sdk.client.instance.dispose()
                await sync.bootstrap()
                dialog.replace(() => <DialogModel providerID={providerID} />)
                toast.show({
                  variant: "success",
                  message: `Connected to ${provider.title}`,
                  duration: 4000,
                })
                return
              }

              // If not running / not installed, open interactive setup dialog
              dialog.replace(() => <DialogLocalModelSetup providerID={providerID} providerTitle={provider.title} />)
              return
            }

            const methods = sync.data.provider_auth[providerID] ?? [
              {
                type: "api",
                label: "API key",
              },
            ]
            let index: number | null = 0
            if (methods.length > 1) {
              index = await new Promise<number | null>((resolve) => {
                dialog.replace(
                  () => (
                    <DialogSelect
                      title="Select auth method"
                      options={methods.map((x, index) => ({
                        title: x.label,
                        value: index,
                      }))}
                      onSelect={(option) => resolve(option.value)}
                    />
                  ),
                  () => resolve(null),
                )
              })
            }
            if (index == null) return
            const method = methods[index]
            if (method.type === "oauth") {
              let inputs: Record<string, string> | undefined
              if (method.prompts?.length) {
                const value = await PromptsMethod({
                  dialog,
                  prompts: method.prompts,
                })
                if (!value) return
                inputs = value
              }

              const result = await sdk.client.provider.oauth.authorize({
                providerID,
                method: index,
                inputs,
              })
              if (result.error) {
                toast.show({
                  variant: "error",
                  message: JSON.stringify(result.error),
                })
                dialog.clear()
                return
              }
              if (result.data?.method === "code") {
                dialog.replace(() => (
                  <CodeMethod providerID={providerID} title={method.label} index={index} authorization={result.data!} />
                ))
              }
              if (result.data?.method === "auto") {
                dialog.replace(() => (
                  <AutoMethod providerID={providerID} title={method.label} index={index} authorization={result.data!} />
                ))
              }
            }
            if (method.type === "api") {
              let metadata: Record<string, string> | undefined
              if (method.prompts?.length) {
                const value = await PromptsMethod({ dialog, prompts: method.prompts })
                if (!value) return
                metadata = value
              }
              return dialog.replace(() => (
                <ApiMethod providerID={providerID} title={method.label} metadata={metadata} />
              ))
            }
          },
        }
      }),
    )
  })
  return options
}

export function DialogProvider() {
  const options = createDialogProviderOptions()
  return <DialogSelect title="Connect a provider" options={options()} />
}

interface AutoMethodProps {
  index: number
  providerID: string
  title: string
  authorization: ProviderAuthAuthorization
}
function AutoMethod(props: AutoMethodProps) {
  const { theme } = useTheme()
  const sdk = useSDK()
  const dialog = useDialog()
  const sync = useSync()
  const toast = useToast()
  const clipboard = useClipboard()

  useBindings(() => ({
    bindings: [
      {
        key: "c",
        desc: "Copy provider code",
        group: "Dialog",
        cmd: () => {
          const code =
            props.authorization.instructions.match(/[A-Z0-9]{4}-[A-Z0-9]{4,5}/)?.[0] ?? props.authorization.url
          clipboard
            .write?.(code)
            .then(() => toast.show({ message: "Copied to clipboard", variant: "info" }))
            .catch(toast.error)
        },
      },
    ],
  }))

  onMount(async () => {
    const result = await sdk.client.provider.oauth.callback({
      providerID: props.providerID,
      method: props.index,
    })
    if (result.error) {
      toast.show({
        variant: "error",
        message:
          "name" in result.error && result.error.name === "ProviderAuthOauthCallbackFailed"
            ? "OAuth authorization failed. Try /connect again."
            : JSON.stringify(result.error),
      })
      dialog.clear()
      return
    }
    await sdk.client.instance.dispose()
    await sync.bootstrap()
    dialog.replace(() => <DialogModel providerID={props.providerID} />)
  })

  return (
    <box paddingLeft={2} paddingRight={2} gap={1} paddingBottom={1}>
      <box flexDirection="row" justifyContent="space-between">
        <text attributes={TextAttributes.BOLD} fg={theme.text}>
          {props.title}
        </text>
        <text fg={theme.textMuted} onMouseUp={() => dialog.clear()}>
          esc
        </text>
      </box>
      <box gap={1}>
        <Link href={props.authorization.url} fg={theme.primary} />
        <text fg={theme.textMuted}>{props.authorization.instructions}</text>
      </box>
      <text fg={theme.textMuted}>Waiting for authorization...</text>
      <text fg={theme.text}>
        c <span style={{ fg: theme.textMuted }}>copy</span>
      </text>
    </box>
  )
}

interface CodeMethodProps {
  index: number
  title: string
  providerID: string
  authorization: ProviderAuthAuthorization
}
function CodeMethod(props: CodeMethodProps) {
  const { theme } = useTheme()
  const sdk = useSDK()
  const sync = useSync()
  const dialog = useDialog()
  const [error, setError] = createSignal(false)

  return (
    <DialogPrompt
      title={props.title}
      placeholder="Authorization code"
      onConfirm={async (value) => {
        const { error } = await sdk.client.provider.oauth.callback({
          providerID: props.providerID,
          method: props.index,
          code: value,
        })
        if (!error) {
          await sdk.client.instance.dispose()
          await sync.bootstrap()
          dialog.replace(() => <DialogModel providerID={props.providerID} />)
          return
        }
        setError(true)
      }}
      description={() => (
        <box gap={1}>
          <text fg={theme.textMuted}>{props.authorization.instructions}</text>
          <Link href={props.authorization.url} fg={theme.primary} />
          <Show when={error()}>
            <text fg={theme.error}>Invalid code</text>
          </Show>
        </box>
      )}
    />
  )
}

interface ApiMethodProps {
  providerID: string
  title: string
  metadata?: Record<string, string>
  custom?: boolean
}
function ApiMethod(props: ApiMethodProps) {
  const dialog = useDialog()
  const sdk = useSDK()
  const sync = useSync()
  const toast = useToast()
  const { theme } = useTheme()

  return (
    <DialogPrompt
      title={props.title}
      placeholder="API key"
      description={undefined}
      onConfirm={async (value) => {
        if (!value) return
        await sdk.client.auth.set({
          providerID: props.providerID,
          auth: {
            type: "api",
            key: value,
            ...(props.metadata ? { metadata: props.metadata } : {}),
          },
        })
        await sdk.client.instance.dispose()
        await sync.bootstrap()
        if (props.custom && !sync.data.provider_next.all.some((provider) => provider.id === props.providerID)) {
          toast.show({
            variant: "info",
            message: `Saved credential for ${props.providerID}. Configure it in agentx.json to use it.`,
          })
          dialog.clear()
          return
        }
        dialog.replace(() => <DialogModel providerID={props.providerID} />)
      }}
    />
  )
}

interface PromptsMethodProps {
  dialog: ReturnType<typeof useDialog>
  prompts: NonNullable<ProviderAuthMethod["prompts"]>[number][]
}
async function PromptsMethod(props: PromptsMethodProps) {
  const inputs: Record<string, string> = {}
  for (const prompt of props.prompts) {
    if (prompt.when) {
      const value = inputs[prompt.when.key]
      if (value === undefined) continue
      const matches = prompt.when.op === "eq" ? value === prompt.when.value : value !== prompt.when.value
      if (!matches) continue
    }

    if (prompt.type === "select") {
      const value = await new Promise<string | null>((resolve) => {
        props.dialog.replace(
          () => (
            <DialogSelect
              title={prompt.message}
              options={prompt.options.map((x) => ({
                title: x.label,
                value: x.value,
                description: x.hint,
              }))}
              onSelect={(option) => resolve(option.value)}
            />
          ),
          () => resolve(null),
        )
      })
      if (value === null) return null
      inputs[prompt.key] = value
      continue
    }

    const value = await new Promise<string | null>((resolve) => {
      props.dialog.replace(
        () => (
          <DialogPrompt title={prompt.message} placeholder={prompt.placeholder} onConfirm={(value) => resolve(value)} />
        ),
        () => resolve(null),
      )
    })
    if (value === null) return null
    inputs[prompt.key] = value
  }
  return inputs
}
