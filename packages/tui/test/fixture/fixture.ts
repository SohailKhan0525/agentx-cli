import { mkdtemp, realpath, rm } from "fs/promises"
import path from "path"
import os from "os"

export async function tmpdir() {
  const directory = await realpath(await mkdtemp(path.join(os.tmpdir(), "agentx-tui-test-")))
  return {
    path: directory,
    async [Symbol.asyncDispose]() {
      await rm(directory, { recursive: true, force: true })
    },
  }
}
