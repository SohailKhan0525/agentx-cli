// security.ts
import { createHash } from 'crypto'

// Sanitize any user input before using in shell commands
export function sanitizeShellInput(input: string): string {
  // Remove shell metacharacters
  return input.replace(/[;&|`$<>\\]/g, '')
}

// Verify API key format before saving
export function validateKeyFormat(provider: string, key: string): boolean {
  const patterns: Record<string, RegExp> = {
    openai: /^sk-[a-zA-Z0-9]{20,}$/,
    anthropic: /^sk-ant-[a-zA-Z0-9-]{20,}$/,
    google: /^[a-zA-Z0-9_-]{20,}$/,
    github: /^gh[ps]_[a-zA-Z0-9]{36,}$/,
  }
  const pattern = patterns[provider.toLowerCase()]
  if (!pattern) return true // Unknown provider — allow
  return pattern.test(key)
}

// Never log sensitive data
export function safeLog(data: unknown): unknown {
  if (typeof data !== 'object' || data === null) return data
  const safe = { ...data as Record<string, unknown> }
  const sensitiveKeys = ['key', 'token', 'secret', 'password', 'apiKey', 'api_key']
  for (const k of sensitiveKeys) {
    if (k in safe) safe[k] = '[REDACTED]'
  }
  return safe
}
