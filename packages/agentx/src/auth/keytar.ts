const SERVICE = "agentx-cli"

async function getKeytar() {
  try {
    const mod = await import("keytar")
    return mod.default || mod
  } catch {
    return null
  }
}

export async function saveApiKey(provider: string, key: string) {
  const kt = await getKeytar()
  if (kt) {
    await kt.setPassword(SERVICE, provider, key)
  }
}

export async function getApiKey(provider: string) {
  const kt = await getKeytar()
  if (kt) {
    return kt.getPassword(SERVICE, provider)
  }
  return null
}

export async function deleteApiKey(provider: string) {
  const kt = await getKeytar()
  if (kt) {
    await kt.deletePassword(SERVICE, provider)
  }
}

export function maskKey(key: string): string {
  if (!key) return ""
  if (key.length <= 8) return "••••••••"
  return key.slice(0, 4) + "••••••••••••" + key.slice(-4)
}
