const logo = {
  left: [
    "     _    ____ _____ _   _ _______  __",
    "    / \\  / ___| ____| \\ | |_   _\\ \\/ /",
    "   / _ \\| |  _|  _| |  \\| | | |  \\  / ",
    "  / ___ \\ |_| | |___| |\\  | | |  /  \\ ",
    " /_/   \\_\\____|_____|_| \\_| |_| /_/\\_\\",
  ],
  right: [
    "   ____ ___  ____  _____ ",
    "  / ___/ _ \\|  _ \\| ____|",
    " | |  | | | | | | |  _|  ",
    " | |__| |_| | |_| | |___ ",
    "  \\____\\___/|____/|_____| ",
  ],
}

const reset = "\x1b[0m"
const bold = "\x1b[1m"
const dim = "\x1b[90m"
const cyan = "\x1b[96m"

function wordmark(pad = "") {
  return logo.left.map((line, index) => {
    const right = logo.right[index] ?? ""
    return `${pad}${cyan}${line}${reset} ${bold}${right}${reset}`
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
