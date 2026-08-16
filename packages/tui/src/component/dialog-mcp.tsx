import { createMemo, createSignal } from "solid-js"
import { useLocal } from "../context/local"
import { useSync } from "../context/sync"
import { map, pipe, entries, sortBy } from "remeda"
import { DialogSelect, type DialogSelectRef, type DialogSelectOption } from "../ui/dialog-select"
import { useTheme } from "../context/theme"
import { TextAttributes } from "@opentui/core"
import { useSDK } from "../context/sdk"

function Status(props: { enabled: boolean; loading: boolean }) {
  const { theme } = useTheme()
  if (props.loading) {
    return <span style={{ fg: theme.textMuted }}>⋯ Loading</span>
  }
  if (props.enabled) {
    return <span style={{ fg: theme.success, attributes: TextAttributes.BOLD }}>✓ Enabled</span>
  }
  return <span style={{ fg: theme.textMuted }}>○ Disabled</span>
}

export function DialogMcp() {
  const { theme } = useTheme()
  const local = useLocal()
  const sync = useSync()
  const sdk = useSDK()
  const [, setRef] = createSignal<DialogSelectRef<unknown>>()
  const [loading, setLoading] = createSignal<string | null>(null)

  const options = createMemo(() => {
    // Track sync data and loading state to trigger re-render when they change
    const mcpData = sync.data.mcp
    const loadingMcp = loading()

    return pipe(
      mcpData ?? {},
      entries(),
      sortBy(([name]) => name),
      map(([name, status]) => ({
        value: name,
        title: name,
        description: status.status === "failed" ? "failed" : status.status,
        footer: <Status enabled={local.mcp.isEnabled(name)} loading={loadingMcp === name} />,
        category: undefined,
      })),
    )
  })

  const toggleMcp = async (name: string) => {
    if (loading() !== null) return
    setLoading(name)
    try {
      await local.mcp.toggle(name)
      const status = await sdk.client.mcp.status()
      if (status.data) {
        sync.set("mcp", status.data)
      }
    } catch (error) {
      console.error("Failed to toggle MCP:", error)
    } finally {
      setLoading(null)
    }
  }

  const actions = createMemo(() => [
    {
      command: "dialog.mcp.toggle",
      title: "toggle",
      onTrigger: (option: DialogSelectOption<string>) => toggleMcp(option.value),
    },
  ])

  return (
    <DialogSelect
      ref={setRef}
      title="MCP Servers"
      options={options()}
      actions={actions()}
      emptyView={
        <box paddingLeft={3} paddingRight={3} paddingBottom={1}>
          <text fg={theme.textMuted}>
            No MCP servers configured. Add MCP servers in <span style={{ fg: theme.primary }}>agentx.json</span> to use them.
          </text>
        </box>
      }
      onSelect={(option) => {
        toggleMcp(option.value)
      }}
    />
  )
}
