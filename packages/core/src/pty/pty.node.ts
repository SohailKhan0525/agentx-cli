import { createRequire } from "module"
import type { Opts, Proc } from "./pty"

export type { Disp, Exit, Opts, Proc } from "./pty"

const req = createRequire(import.meta.url)

export function spawn(file: string, args: string[], opts: Opts): Proc {
  let pty: any
  try {
    pty = req("@lydell/node-pty")
  } catch {
    try {
      pty = req("node-pty")
    } catch {
      throw new Error("Terminal PTY support requires @lydell/node-pty or node-pty.")
    }
  }
  const proc = pty.spawn(file, args, opts)
  return {
    pid: proc.pid,
    onData(listener) {
      return proc.onData(listener)
    },
    onExit(listener) {
      return proc.onExit(listener)
    },
    write(data) {
      proc.write(data)
    },
    resize(cols, rows) {
      proc.resize(cols, rows)
    },
    kill(signal) {
      proc.kill(signal)
    },
  }
}

