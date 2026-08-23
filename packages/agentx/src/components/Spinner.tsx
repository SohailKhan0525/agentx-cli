// Spinner.tsx
import React, { useEffect, useState } from 'react'
import { Box, Text } from 'ink'
import { spinnerFrames, spinnerInterval } from './design-system'

interface SpinnerProps {
  label: string
}

export function Spinner({ label }: SpinnerProps) {
  const [frame, setFrame] = useState(0)

  useEffect(() => {
    const t = setInterval(
      () => setFrame(f => (f + 1) % spinnerFrames.length),
      spinnerInterval
    )
    return () => clearInterval(t)
  }, [])

  return (
    <Box paddingLeft={2} marginBottom={1}>
      <Text color="white">{spinnerFrames[frame]} </Text>
      <Text dimColor>{label}</Text>
    </Box>
  )
}
