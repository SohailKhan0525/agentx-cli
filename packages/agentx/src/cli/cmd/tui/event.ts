import { BusEvent } from "@/bus/bus-event"
import z from "zod"

export namespace TuiEvent {
  export const Toast = BusEvent.define("tui.toast", z.object({ title: z.string(), message: z.string().optional(), variant: z.string().optional() }) as any)
  export const ToastShow = Toast
  export const Prompt = BusEvent.define("tui.prompt", z.object({ prompt: z.string() }) as any)
  export const PromptAppend = Prompt
  export const SelectSession = BusEvent.define("tui.select-session", z.object({ sessionID: z.string() }) as any)
  export const SessionSelect = SelectSession
  export const Error = BusEvent.define("tui.error", z.object({ error: z.any() }) as any)
  export const OpenFile = BusEvent.define("tui.open-file", z.object({ file: z.string() }) as any)
  export const Dialog = BusEvent.define("tui.dialog", z.object({ id: z.string(), data: z.any().optional() }) as any)
  export const CloseDialog = BusEvent.define("tui.close-dialog", z.object({ id: z.string() }) as any)
  export const Refresh = BusEvent.define("tui.refresh", z.object({}) as any)
  export const Status = BusEvent.define("tui.status", z.object({ status: z.any() }) as any)
  export const Action = BusEvent.define("tui.action", z.object({ action: z.string(), payload: z.any().optional() }) as any)
  export const CommandExecute = Action
  export const Focus = BusEvent.define("tui.focus", z.object({ target: z.string() }) as any)
  export const Blur = BusEvent.define("tui.blur", z.object({ target: z.string() }) as any)
  export const Navigate = BusEvent.define("tui.navigate", z.object({ route: z.string() }) as any)
  export const Key = BusEvent.define("tui.key", z.object({ key: z.string() }) as any)
  export const Clear = BusEvent.define("tui.clear", z.object({}) as any)
  export const Copy = BusEvent.define("tui.copy", z.object({ text: z.string() }) as any)
  export const Paste = BusEvent.define("tui.paste", z.object({ text: z.string() }) as any)
  export const Mode = BusEvent.define("tui.mode", z.object({ mode: z.string() }) as any)
  export const Theme = BusEvent.define("tui.theme", z.object({ theme: z.string() }) as any)
  export const Notification = BusEvent.define("tui.notification", z.object({ message: z.string() }) as any)
}
