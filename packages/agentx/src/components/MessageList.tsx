// MessageList.tsx
import React from 'react'
import { Box, Text, Static } from 'ink'
import type { Message } from './messages'
import { icon } from './design-system'

function UserMsg({ content }: { content: string }) {
  return (
    <Box marginBottom={1}>
      <Text bold color="white">{icon.prompt} </Text>
      <Text color="white">{content}</Text>
    </Box>
  )
}

function AssistantMsg({ content, tokens, cost, durationMs, isError }: {
  content: string
  tokens?: number
  cost?: number
  durationMs?: number
  isError?: boolean
}) {
  const hasMeta = tokens != null
  const costStr = cost != null && cost > 0
    ? cost < 0.001 ? '<$0.001' : `$${cost.toFixed(4)}`
    : null

  return (
    <Box flexDirection="column" marginBottom={1} paddingLeft={2}>
      <Text color="white">{isError ? `${icon.error} ` : ''}{content}</Text>
      {hasMeta && (
        <Text dimColor>
          {icon.arrow}{' '}
          {tokens!.toLocaleString()} tokens
          {costStr ? ` ${icon.dot} ${costStr}` : ''}
          {durationMs ? ` ${icon.dot} ${(durationMs / 1000).toFixed(1)}s` : ''}
        </Text>
      )}
    </Box>
  )
}

function ToolMsg({ toolName, content }: {
  toolName?: string
  content: string
}) {
  return (
    <Box paddingLeft={2} marginBottom={0}>
      <Text dimColor>
        {icon.info} {toolName ? `${toolName}: ` : ''}{content}
      </Text>
    </Box>
  )
}

interface MessageListProps {
  messages: Message[]
  streamingContent?: string
}

export function MessageList({ messages, streamingContent }: MessageListProps) {
  return (
    <Box flexDirection="column" flexGrow={1}>
      <Static items={messages}>
        {(msg) => (
          <Box key={msg.id} flexDirection="column">
            {msg.role === 'user' && <UserMsg content={msg.content} />}
            {msg.role === 'assistant' && (
              <AssistantMsg
                content={msg.content}
                tokens={msg.tokens}
                cost={msg.cost}
                durationMs={msg.durationMs}
                isError={msg.isError}
              />
            )}
            {msg.role === 'tool' && (
              <ToolMsg toolName={msg.toolName} content={msg.content} />
            )}
          </Box>
        )}
      </Static>

      {streamingContent != null && streamingContent !== '' && (
        <Box paddingLeft={2} marginBottom={1}>
          <Text color="white">{streamingContent}</Text>
        </Box>
      )}
    </Box>
  )
}
