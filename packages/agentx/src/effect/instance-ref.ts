import { Context } from "effect"
import type { InstanceContext } from "@/project/instance"

export const InstanceRef = Context.Reference<InstanceContext | undefined>("~agentx/InstanceRef", {
  defaultValue: () => undefined,
})

export const WorkspaceRef = Context.Reference<string | undefined>("~agentx/WorkspaceRef", {
  defaultValue: () => undefined,
})
