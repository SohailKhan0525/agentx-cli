export * as File from "./file"

import { Revert } from "@agentx-cli/schema/revert"

export const Diff = Revert.FileDiff
export type Diff = typeof Diff.Type
