// InputBar.tsx
import React, { useState } from 'react'
import { Box, Text, useInput } from 'ink'
import { icon } from './design-system'

const SLASH_COMMANDS = [
  '/help', '/clear', '/model', '/cost', '/status',
  '/provider', '/theme', '/skills', '/plugins',
  '/exit', '/quit',
]

interface InputBarProps {
  onSubmit: (value: string) => void
  onSlashCommand: (cmd: string) => void
  isLoading: boolean
  placeholder?: string
}

const isRawModeSupported = Boolean(process.stdin.isTTY && typeof process.stdin.setRawMode === "function")

export function InputBar({
  onSubmit,
  onSlashCommand,
  isLoading,
  placeholder = 'Describe what you want to build...',
}: InputBarProps) {
  const [value, setValue] = useState('')
  const [suggestion, setSuggestion] = useState('')

  useInput((input, key) => {
    if (isLoading) return

    if (key.return && !key.shift) {
      const trimmed = value.trim()
      if (!trimmed) return
      if (trimmed.startsWith('/')) {
        onSlashCommand(trimmed)
      } else {
        onSubmit(trimmed)
      }
      setValue('')
      setSuggestion('')
      return
    }

    if (key.return && key.shift) {
      setValue(v => v + '\n')
      return
    }

    if (key.backspace || key.delete) {
      setValue(v => v.slice(0, -1))
      setSuggestion('')
      return
    }

    if (key.tab && suggestion) {
      setValue(suggestion)
      setSuggestion('')
      return
    }

    if (input) {
      const next = value + input
      setValue(next)
      if (next.startsWith('/')) {
        const match = SLASH_COMMANDS.find(
          c => c.startsWith(next) && c !== next
        )
        setSuggestion(match ?? '')
      } else {
        setSuggestion('')
      }
    }
  }, { isActive: isRawModeSupported })

  const ghost = suggestion ? suggestion.slice(value.length) : ''

  return (
    <Box
      flexDirection="row"
      borderStyle="single"
      borderColor="gray"
      paddingX={1}
      marginTop={1}
    >
      <Text bold color="white">{icon.prompt} </Text>
      {!value && !isLoading ? (
        <Text dimColor>{placeholder}</Text>
      ) : (
        <Box flexDirection="row">
          <Text color="white">{value}</Text>
          {ghost ? <Text dimColor>{ghost}</Text> : null}
          {isLoading ? <Text dimColor> ...</Text> : null}
        </Box>
      )}
    </Box>
  )
}
