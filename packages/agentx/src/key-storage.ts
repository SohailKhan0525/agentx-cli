// key-storage.ts
// Stores API keys in OS secure storage — never plain text files
// macOS: Keychain | Windows: Credential Manager | Linux: Secret Service

import keytar from 'keytar'

const SERVICE = 'agentx-cli'

export async function saveKey(provider: string, key: string): Promise<void> {
  await keytar.setPassword(SERVICE, provider, key)
}

export async function getKey(provider: string): Promise<string | null> {
  return keytar.getPassword(SERVICE, provider)
}

export async function deleteKey(provider: string): Promise<void> {
  await keytar.deletePassword(SERVICE, provider)
}

// Always mask keys when displaying to user
export function maskKey(key: string): string {
  if (!key || key.length <= 8) return '••••••••'
  return key.slice(0, 4) + '••••••••••••' + key.slice(-4)
}
