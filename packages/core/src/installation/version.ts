declare global {
  const AGENTX_VERSION: string
  const AGENTX_CHANNEL: string
}

export const InstallationVersion = typeof AGENTX_VERSION === "string" ? AGENTX_VERSION : "local"
export const InstallationChannel = typeof AGENTX_CHANNEL === "string" ? AGENTX_CHANNEL : "local"
export const InstallationLocal = InstallationChannel === "local"
