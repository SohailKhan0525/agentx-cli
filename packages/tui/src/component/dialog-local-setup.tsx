import { createSignal, onMount, Show, For } from "solid-js"
import { TextAttributes } from "@opentui/core"
import { useDialog } from "../ui/dialog"
import { useTheme } from "../context/theme"
import { useToast } from "../ui/toast"
import { useSDK } from "../context/sdk"
import { useSync } from "../context/sync"
import { Spinner } from "./spinner"
import { DialogSelect } from "../ui/dialog-select"
import { DialogModel } from "./dialog-model"
import open from "open"
import {
  detectHardware,
  getRecommendedModelForHardware,
  probeService,
  setupLocalOllamaPipeline,
  type HardwareProfile,
  type CatalogModel,
} from "@agentx-cli/core/plugin/provider/local-models"

export interface DialogLocalModelSetupProps {
  providerID: string
  providerTitle: string
}

export function DialogLocalModelSetup(props: DialogLocalModelSetupProps) {
  const dialog = useDialog()
  const { theme } = useTheme()
  const toast = useToast()
  const sdk = useSDK()
  const sync = useSync()

  const [loading, setLoading] = createSignal(false)
  const [currentStep, setCurrentStep] = createSignal("")
  const [progress, setProgress] = createSignal<number | undefined>()
  const [error, setError] = createSignal<string | null>(null)

  const hw: HardwareProfile = detectHardware()
  const recModel: CatalogModel = getRecommendedModelForHardware(hw)

  onMount(() => {
    dialog.setSize("large")
  })

  async function handleAutoInstall() {
    setLoading(true)
    setError(null)
    setCurrentStep("Initializing setup...")

    try {
      const res = await setupLocalOllamaPipeline((status) => {
        setCurrentStep(status.step)
        setProgress(status.progress)
      })

      if (res.success && res.service?.running) {
        await sdk.client.auth.set({
          providerID: props.providerID,
          auth: {
            type: "api",
            key: "local",
          },
        })
        await sdk.client.instance.dispose()
        await sync.bootstrap()
        toast.show({
          variant: "success",
          message: `${props.providerTitle} setup complete! Connected to ${recModel.name}`,
          duration: 5000,
        })
        dialog.replace(() => <DialogModel providerID={props.providerID} />)
      } else {
        setError(res.error || "Setup finished but service was not detected running.")
        setLoading(false)
      }
    } catch (err: any) {
      setError(err?.message || String(err))
      setLoading(false)
    }
  }

  async function handleReProbe() {
    setLoading(true)
    setCurrentStep("Probing localhost for running instance...")
    const service = await probeService(props.providerID, props.providerTitle, "http://localhost:11434/v1", 11434, 2500)
    setLoading(false)

    if (service.running) {
      await sdk.client.auth.set({
        providerID: props.providerID,
        auth: {
          type: "api",
          key: "local",
        },
      })
      await sdk.client.instance.dispose()
      await sync.bootstrap()
      toast.show({
        variant: "success",
        message: `Connected to running ${props.providerTitle} instance!`,
        duration: 4000,
      })
      dialog.replace(() => <DialogModel providerID={props.providerID} />)
    } else {
      toast.show({
        variant: "warning",
        message: `${props.providerTitle} service was not found on http://localhost:11434`,
        duration: 4000,
      })
    }
  }

  function handleReportIssue() {
    const title = encodeURIComponent(`Local Model Setup Failure (${props.providerID} on ${hw.os} ${hw.arch})`)
    const body = encodeURIComponent(
      `### Environment:\n- OS: ${hw.os} (${hw.arch})\n- CPU: ${hw.cpuCores} cores (${hw.cpuModel})\n- RAM: ${hw.totalRamGb} GB (Free: ${hw.freeRamGb} GB)\n- GPU: ${hw.gpuName} (${hw.acceleration}, ${hw.vramGb} GB VRAM)\n\n### Error Encountered:\n${error() || "Service failed to connect"}`,
    )
    open(`https://github.com/SohailKhan0525/agentx-cli/issues/new?title=${title}&body=${body}`)
    toast.show({
      variant: "info",
      message: "Opening GitHub Issues in browser...",
    })
  }

  return (
    <box flexDirection="column" gap={1} paddingLeft={3} paddingRight={3} paddingTop={1} paddingBottom={1}>
      {/* Header */}
      <box flexDirection="row" justifyContent="space-between" alignItems="center">
        <text attributes={TextAttributes.BOLD} fg={theme.primary}>
          🖥️ {props.providerTitle} Local AI Setup
        </text>
        <text fg={theme.textMuted} onMouseUp={() => dialog.clear()}>
          ✕ esc
        </text>
      </box>

      {/* System Hardware Profile Box */}
      <box
        flexDirection="column"
        borderStyle="single"
        borderColor={theme.border}
        paddingLeft={2}
        paddingRight={2}
        paddingTop={1}
        paddingBottom={1}
      >
        <text attributes={TextAttributes.BOLD} fg={theme.text}>
          Hardware & System Analysis
        </text>
        <text fg={theme.textMuted}>
          • Platform: <span style={{ fg: theme.text }}>{hw.os} ({hw.arch})</span>
        </text>
        <text fg={theme.textMuted}>
          • Memory: <span style={{ fg: theme.text }}>{hw.totalRamGb} GB Total</span> ({hw.freeRamGb} GB Available)
        </text>
        <text fg={theme.textMuted}>
          • Processor: <span style={{ fg: theme.text }}>{hw.cpuCores} Cores</span> {hw.cpuModel ? `(${hw.cpuModel})` : ""}
        </text>
        <text fg={theme.textMuted}>
          • Compute Acceleration: <span style={{ fg: theme.success, attributes: TextAttributes.BOLD }}>{hw.gpuName} [{hw.acceleration.toUpperCase()}]</span>
        </text>
      </box>

      {/* Recommended Model Box */}
      <box
        flexDirection="column"
        borderStyle="single"
        borderColor={theme.primary}
        paddingLeft={2}
        paddingRight={2}
        paddingTop={1}
        paddingBottom={1}
      >
        <text attributes={TextAttributes.BOLD} fg={theme.primary}>
          ★ Recommended Model for Your Hardware
        </text>
        <text fg={theme.text}>
          <span style={{ attributes: TextAttributes.BOLD }}>{recModel.name}</span> ({recModel.size})
        </text>
        <text fg={theme.textMuted}>
          {recModel.description}
        </text>
      </box>

      {/* Loading / Progress State */}
      <Show when={loading()}>
        <box
          flexDirection="column"
          borderStyle="single"
          borderColor={theme.primary}
          paddingLeft={2}
          paddingRight={2}
          paddingTop={1}
          paddingBottom={1}
          gap={1}
        >
          <box flexDirection="row" gap={1} alignItems="center">
            <Spinner color={theme.primary}>Processing...</Spinner>
            <text fg={theme.text}>{currentStep()}</text>
          </box>
          <Show when={progress() !== undefined}>
            <text fg={theme.success}>
              Progress: {progress()}%
            </text>
          </Show>
        </box>
      </Show>

      {/* Error Message Display */}
      <Show when={error() && !loading()}>
        <box
          flexDirection="column"
          borderStyle="single"
          borderColor={theme.error}
          paddingLeft={2}
          paddingRight={2}
          paddingTop={1}
          paddingBottom={1}
          gap={1}
        >
          <text attributes={TextAttributes.BOLD} fg={theme.error}>
            Setup Encountered an Issue
          </text>
          <text fg={theme.textMuted}>
            {error()}
          </text>
        </box>
      </Show>

      {/* Actions */}
      <Show when={!loading()}>
        <box flexDirection="column" gap={1} paddingTop={1}>
          <box
            backgroundColor={theme.primary}
            paddingLeft={2}
            paddingRight={2}
            paddingTop={1}
            paddingBottom={1}
            onMouseUp={handleAutoInstall}
          >
            <text fg={theme.selectedListItemText} attributes={TextAttributes.BOLD}>
              1. ⚡ Install & Setup {props.providerTitle} Automatically (Recommended)
            </text>
          </box>

          <box
            backgroundColor={theme.backgroundElement}
            paddingLeft={2}
            paddingRight={2}
            paddingTop={1}
            paddingBottom={1}
            onMouseUp={handleReProbe}
          >
            <text fg={theme.text}>
              2. 🔄 Re-detect Running Service (If already running in background)
            </text>
          </box>

          <Show when={error()}>
            <box
              backgroundColor={theme.backgroundElement}
              paddingLeft={2}
              paddingRight={2}
              paddingTop={1}
              paddingBottom={1}
              onMouseUp={handleReportIssue}
            >
              <text fg={theme.error} attributes={TextAttributes.BOLD}>
                3. 🐛 Submit Issue to GitHub Issues with Diagnostics
              </text>
            </box>
          </Show>
        </box>
      </Show>
    </box>
  )
}
