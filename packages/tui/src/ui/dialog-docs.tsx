import { TextAttributes } from "@opentui/core"
import { useTheme } from "../context/theme"
import { useDialog } from "./dialog"
import { useBindings } from "../keymap"

export function DialogDocs() {
  const dialog = useDialog()
  const { theme } = useTheme()

  useBindings(() => ({
    bindings: [
      { key: "return", desc: "Close docs", group: "Dialog", cmd: () => dialog.clear() },
      { key: "escape", desc: "Close docs", group: "Dialog", cmd: () => dialog.clear() },
    ],
  }))

  return (
    <box paddingLeft={2} paddingRight={2} gap={1} paddingBottom={1}>
      <box flexDirection="row" justifyContent="space-between">
        <text attributes={TextAttributes.BOLD} fg={theme.text}>
          AgentX — Documentation & Cheat Sheet
        </text>
        <text fg={theme.textMuted} onMouseUp={() => dialog.clear()}>
          esc/enter
        </text>
      </box>

      <box gap={1}>
        <text fg={theme.primary} attributes={TextAttributes.BOLD}>
          • What is AgentX?
        </text>
        <text fg={theme.text}>
          AgentX is the autonomous website builder that creates full-stack, production-ready web applications directly from your terminal.
        </text>
      </box>

      <box gap={1}>
        <text fg={theme.primary} attributes={TextAttributes.BOLD}>
          • Essential Keyboard Shortcuts
        </text>
        <text fg={theme.text}>
          <b>Ctrl+P</b> — Open Command Palette
        </text>
        <text fg={theme.text}>
          <b>Tab</b> — Complete slash command / Autocomplete
        </text>
        <text fg={theme.text}>
          <b>Esc</b> — Close dialogs / Return to editor
        </text>
        <text fg={theme.text}>
          <b>Ctrl+C</b> — Abort generation / Clear prompt
        </text>
      </box>

      <box gap={1}>
        <text fg={theme.primary} attributes={TextAttributes.BOLD}>
          • Essential Slash Commands
        </text>
        <text fg={theme.text}>
          <b>/connect</b> — Connect AI Provider (Copilot, OpenAI, Gemini, Anthropic, Local)
        </text>
        <text fg={theme.text}>
          <b>/models</b> — Switch AI model
        </text>
        <text fg={theme.text}>
          <b>/new</b> or <b>/clear</b> — Start a new session
        </text>
        <text fg={theme.text}>
          <b>/status</b> — View connected providers and system status
        </text>
        <text fg={theme.text}>
          <b>/diff</b> — Open interactive diff viewer
        </text>
        <text fg={theme.text}>
          <b>/share</b> — Share session link
        </text>
        <text fg={theme.text}>
          <b>/compact</b> — Summarize session to save tokens
        </text>
        <text fg={theme.text}>
          <b>/skills</b> — Browse and trigger agent skills
        </text>
        <text fg={theme.text}>
          <b>/editor</b> — Open multiline prompt in external editor
        </text>
        <text fg={theme.text}>
          <b>/exit</b> — Exit AgentX
        </text>
      </box>

      <box flexDirection="row" justifyContent="space-between" paddingTop={1}>
        <text fg={theme.textMuted}>
          GitHub: <span style={{ fg: theme.primary }}>https://github.com/SohailKhan0525/agentx-cli</span>
        </text>
        <box paddingLeft={3} paddingRight={3} backgroundColor={theme.primary} onMouseUp={() => dialog.clear()}>
          <text fg={theme.selectedListItemText}>Done</text>
        </box>
      </box>
    </box>
  )
}
