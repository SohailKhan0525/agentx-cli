import { EOL } from "os"
import { Schema } from "effect"
import { logo as glyphs } from "./logo"

const wordmark = [
  "     _    ____ _____ _   _ _______  __    ____ ___  ____  _____ ",
  "    / \\  / ___| ____| \\ | |_   _\\ \\/ /   / ___/ _ \\|  _ \\| ____|",
  "   / _ \\| |  _|  _| |  \\| | | |  \\  /   | |  | | | | | | |  _|  ",
  "  / ___ \\ |_| | |___| |\\  | | |  /  \\   | |__| |_| | |_| | |___ ",
  " /_/   \\_\\____|_____|_| \\_| |_| /_/\\_\\   \\____\\___/|____/|_____| ",
]

export class CancelledError extends Schema.TaggedErrorClass<CancelledError>()("UICancelledError", {}) {}

export const Style = {
  TEXT_HIGHLIGHT: "\x1b[96m",
  TEXT_HIGHLIGHT_BOLD: "\x1b[96m\x1b[1m",
  TEXT_DIM: "\x1b[90m",
  TEXT_DIM_BOLD: "\x1b[90m\x1b[1m",
  TEXT_NORMAL: "\x1b[0m",
  TEXT_NORMAL_BOLD: "\x1b[1m",
  TEXT_WARNING: "\x1b[93m",
  TEXT_WARNING_BOLD: "\x1b[93m\x1b[1m",
  TEXT_DANGER: "\x1b[91m",
  TEXT_DANGER_BOLD: "\x1b[91m\x1b[1m",
  TEXT_SUCCESS: "\x1b[92m",
  TEXT_SUCCESS_BOLD: "\x1b[92m\x1b[1m",
  TEXT_INFO: "\x1b[94m",
  TEXT_INFO_BOLD: "\x1b[94m\x1b[1m",
}

export function println(...message: string[]) {
  print(...message)
  process.stderr.write(EOL)
}

export function print(...message: string[]) {
  blank = false
  process.stderr.write(message.join(" "))
}

let blank = false
export function empty() {
  if (blank) return
  println("" + Style.TEXT_NORMAL)
  blank = true
}

export function logo(pad?: string) {
  const isNoColor = Boolean(process.env.NO_COLOR)
  const isTty = Boolean(process.stdout.isTTY || process.stderr.isTTY)

  if (isNoColor || !isTty) {
    const result = []
    for (const row of wordmark) {
      if (pad) result.push(pad)
      result.push(row)
      result.push(EOL)
    }
    return result.join("").trimEnd()
  }

  const result: string[] = []
  const reset = "\x1b[0m"
  const cyan = "\x1b[96m"
  const bold = "\x1b[1m"
  const gap = "   "

  glyphs.left.forEach((row, index) => {
    if (pad) result.push(pad)
    result.push(`${cyan}${row}${reset}`)
    result.push(gap)
    const other = glyphs.right[index] ?? ""
    result.push(`${bold}${other}${reset}`)
    result.push(EOL)
  })
  return result.join("").trimEnd()
}

export async function input(prompt: string): Promise<string> {
  const readline = require("readline")
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  })

  return new Promise((resolve) => {
    rl.question(prompt, (answer: string) => {
      rl.close()
      resolve(answer.trim())
    })
  })
}

export function error(message: string) {
  if (message.startsWith("Error: ")) {
    message = message.slice("Error: ".length)
  }
  println(Style.TEXT_DANGER_BOLD + "Error: " + Style.TEXT_NORMAL + message)
}

export function markdown(text: string): string {
  return text
}

export * as UI from "./ui"
