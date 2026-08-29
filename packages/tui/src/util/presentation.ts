import { logo } from "../logo"

const reset = "\x1b[0m"
const bold = "\x1b[1m"
const dim = "\x1b[90m"
const yellow = "\x1b[38;2;255;230;0m"

function wordmark(pad = "") {
  return logo.left.map((line, index) => {
    const right = logo.right[index] ?? ""
    return `${pad}${yellow}${line}${reset} ${yellow}${bold}${right}${reset}`
  })
}

export function sessionEpilogue(input: { title: string; sessionID?: string }) {
  const weak = (text: string) => `${dim}${text.padEnd(10, " ")}${reset}`
  return [
    ...wordmark("  "),
    "",
    `  ${weak("Session")}${bold}${input.title}${reset}`,
    `  ${weak("Continue")}${bold}agentx -s ${input.sessionID}${reset}`,
    "",
  ].join("\n")
}
