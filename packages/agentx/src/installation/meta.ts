declare global {
  const AGENTX_VERSION: string
  const AGENTX_CHANNEL: string
}

export const VERSION = typeof AGENTX_VERSION === "string" ? AGENTX_VERSION : "local"
export const CHANNEL = typeof AGENTX_CHANNEL === "string" ? AGENTX_CHANNEL : "local"
