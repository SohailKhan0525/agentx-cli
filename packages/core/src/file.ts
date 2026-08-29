export * as File from "./file"

import { Revert } from "@agent-qofeno/schema/revert"

export const Diff = Revert.FileDiff
export type Diff = typeof Diff.Type
