// PermissionDialog.tsx
// Used for: running commands, writing files, installing packages
// AgentX permission system styled in pure black and white with custom Ink components

import React, { useState } from 'react'
import { Box, Text, useInput } from 'ink'
import { icon } from './design-system'

export type PermissionChoice = 'yes' | 'no' | 'always'

interface PermissionDialogProps {
  action: string
  detail: string
  onChoice: (choice: PermissionChoice) => void
  showAlways?: boolean
}

const isRawModeSupported = Boolean(process.stdin.isTTY && typeof process.stdin.setRawMode === "function")

export function PermissionDialog({
  action,
  detail,
  onChoice,
  showAlways = true,
}: PermissionDialogProps) {
  const options: PermissionChoice[] = showAlways
    ? ['yes', 'no', 'always']
    : ['yes', 'no']
  const [idx, setIdx] = useState(0)

  useInput((input, key) => {
    if (key.leftArrow) setIdx(i => Math.max(0, i - 1))
    if (key.rightArrow) setIdx(i => Math.min(options.length - 1, i + 1))
    if (key.return) onChoice(options[idx])
    if (input === 'y' || input === 'Y') onChoice('yes')
    if (input === 'n' || input === 'N') onChoice('no')
    if (showAlways && (input === 'a' || input === 'A')) onChoice('always')
  }, { isActive: isRawModeSupported })

  return (
    <Box flexDirection="column" paddingLeft={2} marginBottom={1}>
      <Text bold color="white">{icon.confirm} {action}</Text>
      <Box paddingLeft={2} marginBottom={1}>
        <Text dimColor>{detail}</Text>
      </Box>
      <Box paddingLeft={2} gap={3}>
        {options.map((opt, i) => (
          <Text key={opt} bold={i === idx} dimColor={i !== idx} color="white">
            {i === idx ? `[${opt}]` : opt}
          </Text>
        ))}
      </Box>
      <Box paddingLeft={2}>
        <Text dimColor>← → select {icon.dot} Enter confirm {icon.dot} Y/N{showAlways ? '/A' : ''}</Text>
      </Box>
    </Box>
  )
}
