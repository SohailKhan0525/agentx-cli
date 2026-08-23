// TaskList.tsx
import React from 'react'
import { Box, Text } from 'ink'
import { Spinner } from './Spinner'
import { icon } from './design-system'

export type TaskStatus = 'pending' | 'running' | 'done' | 'error'

export interface Task {
  id: string
  label: string
  status: TaskStatus
  detail?: string
}

export function TaskList({ tasks }: { tasks: Task[] }) {
  return (
    <Box flexDirection="column" paddingLeft={2} marginBottom={1}>
      {tasks.map(task => (
        <Box key={task.id} flexDirection="column">
          {task.status === 'done' && (
            <Text color="white">
              {icon.success} {task.label}
              {task.detail ? <Text dimColor> {task.detail}</Text> : null}
            </Text>
          )}
          {task.status === 'error' && (
            <Text color="white">{icon.error} {task.label}</Text>
          )}
          {task.status === 'running' && (
            <Spinner label={task.label} />
          )}
          {task.status === 'pending' && (
            <Text dimColor>{icon.wait} {task.label}</Text>
          )}
        </Box>
      ))}
    </Box>
  )
}
