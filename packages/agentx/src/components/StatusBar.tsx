// StatusBar.tsx
import React from 'react'
import { Box, Text } from 'ink'
import { icon } from './design-system'

interface StatusBarProps {
  model: string
  tokens: number
  cost: number
}

export function StatusBar({ model, tokens, cost }: StatusBarProps) {
  const costStr = cost === 0
    ? '$0.000'
    : cost < 0.001
      ? '<$0.001'
      : `$${cost.toFixed(4)}`

  return (
    <Box flexDirection="row" paddingX={1} marginBottom={1}>
      <Text bold color="white">AgentX</Text>
      <Text dimColor>
        {'  '}{icon.dot}{'  '}{model}
        {'  '}{icon.dot}{'  '}{tokens.toLocaleString()} tok
        {'  '}{icon.dot}{'  '}{costStr}
        {'  '}{icon.dot}{'  '}/help
      </Text>
    </Box>
  )
}
