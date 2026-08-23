// messages.ts
export interface Message {
  id: string
  role: 'user' | 'assistant' | 'tool'
  content: string
  tokens?: number
  cost?: number
  durationMs?: number
  toolName?: string
  isError?: boolean
}
