import { createSignal, onMount, Show, For } from "solid-js"
import { useTheme } from "../context/theme"
import { useDialog } from "../ui/dialog"
import { useLocal } from "../context/local"
import { useSDK } from "../context/sdk"
import { useToast } from "../ui/toast"
import { detectLocalProviders, detectHardware, createLocalModel, LOCAL_PROVIDERS } from "@/provider/local"
import { DialogPrompt } from "../ui/dialog-prompt"
import child_process from "child_process"

export interface HardwareInfo {
  ram: number
  freeRam: number
  gpu: string | null
  vram: number
  acceleration: string
  os: string
}

export function LocalModelSetup(props: { onComplete?: (modelId: string) => void; onCancel?: () => void }) {
  const { theme } = useTheme()
  const dialog = useDialog()
  const local = useLocal()
  const sdk = useSDK()
  const toast = useToast()

  const [scanning, setScanning] = createSignal(true)
  const [providers, setProviders] = createSignal<Array<{ name: string; url: string; models: any[]; running: boolean }>>([])
  const [hardware, setHardware] = createSignal<HardwareInfo | null>(null)
  const [selectedModel, setSelectedModel] = createSignal<string>("")
  const [downloading, setDownloading] = createSignal(false)
  const [downloadProgress, setDownloadProgress] = createSignal("")

  onMount(async () => {
    const [provs, hw] = await Promise.all([
      detectLocalProviders(),
      detectHardware(),
    ])
    setProviders(provs)
    setHardware(hw)
    setScanning(false)
  })

  const recommendations = [
    { tier: "⚡ Fast", name: "qwen2.5-coder:3b", size: "1.9GB", desc: "" },
    { tier: "   Balanced", name: "qwen2.5-coder:7b", size: "4.7GB", desc: "← recommended" },
    { tier: "   Quality", name: "qwen2.5-coder:14b", size: "9.0GB", desc: "" },
  ]

  async function handleSelectModel(modelName: string) {
    const name = modelName.trim()
    if (!name) return

    // Check if model already exists in running provider
    const active = providers().find((p) => p.running)
    const exists = active?.models?.some((m) => {
      const mName = typeof m === "string" ? m : m.name || m.id
      return mName === name || mName.startsWith(name)
    })

    if (!exists) {
      // Show confirmation prompt for downloading
      dialog.replace(
        () => (
          <box paddingLeft={2} paddingRight={2} paddingTop={1} paddingBottom={1} gap={1}>
            <text fg={theme.text} bold>
              ◆ {name} not installed
            </text>
            <text fg={theme.textMuted}>Download now?</text>
            <box flexDirection="row" gap={2} paddingTop={1}>
              <box
                paddingLeft={2}
                paddingRight={2}
                backgroundColor={theme.text}
                onMouseUp={() => pullModel(name)}
              >
                <text fg={theme.background}>Yes</text>
              </box>
              <box
                paddingLeft={2}
                paddingRight={2}
                backgroundColor={theme.backgroundElement}
                onMouseUp={() => dialog.clear()}
              >
                <text fg={theme.text}>No</text>
              </box>
            </box>
          </box>
        ),
        () => props.onCancel?.(),
      )
      return
    }

    finish(name)
  }

  function pullModel(modelName: string) {
    setDownloading(true)
    dialog.replace(() => (
      <box paddingLeft={2} paddingRight={2} paddingTop={1} paddingBottom={1} gap={1}>
        <text fg={theme.text}>Pulling {modelName} via ollama...</text>
        <text fg={theme.textMuted}>{downloadProgress() || "Downloading layers..."}</text>
      </box>
    ))

    const proc = child_process.spawn("ollama", ["pull", modelName])
    proc.stdout?.on("data", (data) => {
      setDownloadProgress(data.toString().trim())
    })
    proc.stderr?.on("data", (data) => {
      setDownloadProgress(data.toString().trim())
    })
    proc.on("close", (code) => {
      setDownloading(false)
      if (code === 0) {
        toast.show({ variant: "success", message: `Downloaded ${modelName}` })
        finish(modelName)
      } else {
        toast.show({ variant: "error", message: `Failed to download ${modelName}` })
        dialog.clear()
      }
    })
  }

  function finish(modelName: string) {
    createLocalModel(LOCAL_PROVIDERS.ollama, modelName)
    dialog.clear()
    props.onComplete?.(modelName)
  }

  return (
    <box paddingLeft={2} paddingRight={2} paddingTop={1} paddingBottom={1} gap={1}>
      <Show when={scanning()}>
        <text fg={theme.textMuted}>→ Scanning for local AI providers...</text>
      </Show>

      <Show when={!scanning()}>
        <box gap={1}>
          {/* Provider running status */}
          <For each={Object.entries(LOCAL_PROVIDERS)}>
            {([name]) => {
              const p = providers().find((x) => x.name === name)
              return (
                <text fg={p ? theme.text : theme.textMuted}>
                  {p ? `✓ ${capitalize(name)} (running) — ${p.models.length} models` : `✗ ${capitalize(name)} (not running)`}
                </text>
              )
            }}
          </For>

          {/* System hardware info */}
          <Show when={hardware()}>
            {(hw) => (
              <box paddingTop={1}>
                <text fg={theme.text}>
                  Your system: {hw().os} · {hw().ram}GB RAM · {hw().gpu || "Integrated GPU"} ({hw().acceleration})
                </text>
              </box>
            )}
          </Show>

          {/* Recommendations */}
          <box paddingTop={1}>
            <text fg={theme.text} bold>Recommended for your hardware:</text>
            <For each={recommendations}>
              {(rec) => (
                <text fg={rec.desc ? theme.text : theme.textMuted}>
                  {rec.tier.padEnd(12)} {rec.name.padEnd(20)} {rec.size.padEnd(8)} {rec.desc}
                </text>
              )}
            </For>
          </box>

          <box paddingTop={1}>
            <text fg={theme.textMuted}>Which model? Type number or name:</text>
            <box
              paddingTop={1}
              onMouseUp={() => {
                dialog.replace(() => (
                  <DialogPrompt
                    title="Enter model name (e.g. qwen2.5-coder:7b)"
                    placeholder="qwen2.5-coder:7b"
                    onConfirm={(val) => handleSelectModel(val || "qwen2.5-coder:7b")}
                    onCancel={() => dialog.clear()}
                  />
                ))
              }}
            >
              <text fg={theme.text} bold>
                ❯ Click to choose or type model
              </text>
            </box>
          </box>
        </box>
      </Show>
    </box>
  )
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1)
}
