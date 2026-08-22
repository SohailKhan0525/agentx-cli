import whichPkg from "which"
import path from "path"
import child_process from "child_process"
import { Global } from "../global"

export function which(cmd: string, env?: NodeJS.ProcessEnv) {
  const base = env?.PATH ?? env?.Path ?? process.env.PATH ?? process.env.Path ?? ""
  const full = base ? base + path.delimiter + Global.Path.bin : Global.Path.bin
  const result = whichPkg.sync(cmd, {
    nothrow: true,
    path: full,
    pathExt: env?.PATHEXT ?? env?.PathExt ?? process.env.PATHEXT ?? process.env.PathExt,
  })
  return typeof result === "string" ? result : null
}

export async function commandExists(cmd: string): Promise<boolean> {
  try {
    const checker = process.platform === "win32" ? "where" : "which"
    await new Promise((resolve, reject) => {
      child_process.execFile(checker, [cmd], (err) => {
        if (err) return reject(err)
        resolve(true)
      })
    })
    return true
  } catch {
    return false
  }
}
