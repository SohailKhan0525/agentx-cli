// App.tsx
import React, { useState, useCallback } from 'react'
import { Box, Text, useApp, useInput } from 'ink'
import { StatusBar } from './StatusBar'
import { MessageList } from './MessageList'
import type { Message } from './messages'
import { InputBar } from './InputBar'
import { PermissionDialog, type PermissionChoice } from './PermissionDialog'
import { Spinner } from './Spinner'
import { TaskList, type Task } from './TaskList'
import { icon } from './design-system'

interface AppProps {
  onUserMessage: (
    msg: string,
    approve: (action: string, detail: string, cb: (c: PermissionChoice) => void) => void,
    onStream: (chunk: string) => void,
    onToken: (tokens: number, cost: number, ms: number) => void,
  ) => Promise<void>
  initialModel?: string
}

const isRawModeSupported = Boolean(process.stdin.isTTY && typeof process.stdin.setRawMode === "function")

export function App({
  onUserMessage,
  initialModel = 'claude-sonnet-4-6',
}: AppProps) {
  const { exit } = useApp()
  const [messages, setMessages] = useState<Message[]>([])
  const [streaming, setStreaming] = useState('')
  const [loading, setLoading] = useState(false)
  const [model] = useState(initialModel)
  const [tokens, setTokens] = useState(0)
  const [cost, setCost] = useState(0)
  const [tasks, setTasks] = useState<Task[]>([])
  const [spinner, setSpinner] = useState('')
  const [permission, setPermission] = useState<{
    action: string
    detail: string
    resolve: (c: PermissionChoice) => void
  } | null>(null)

  useInput((input, key) => {
    if (key.ctrl && input === 'c') {
      if (loading) {
        setLoading(false)
        setStreaming('')
        setSpinner('')
      } else {
        exit()
      }
    }
    if (key.ctrl && input === 'd') exit()
  }, { isActive: isRawModeSupported })

  const handlePermission = useCallback((
    action: string,
    detail: string,
    cb: (c: PermissionChoice) => void,
  ) => {
    setPermission({ action, detail, resolve: cb })
  }, [])

  const handlePermissionChoice = useCallback((c: PermissionChoice) => {
    permission?.resolve(c)
    setPermission(null)
  }, [permission])

  const addMessage = useCallback((msg: Message) => {
    setMessages(prev => [...prev, msg])
  }, [])

  const handleSubmit = useCallback(async (text: string) => {
    addMessage({ id: Date.now().toString(), role: 'user', content: text })
    setLoading(true)
    setStreaming('')
    setSpinner('Thinking...')

    try {
      await onUserMessage(
        text,
        handlePermission,
        (chunk) => {
          setSpinner('')
          setStreaming(prev => prev + chunk)
        },
        (tok, c, ms) => {
          setTokens(prev => prev + tok)
          setCost(prev => prev + c)
          const content = streaming
          setStreaming('')
          addMessage({
            id: Date.now().toString(),
            role: 'assistant',
            content,
            tokens: tok,
            cost: c,
            durationMs: ms,
          })
        },
      )
    } catch (err) {
      addMessage({
        id: Date.now().toString(),
        role: 'assistant',
        content: String(err),
        isError: true,
      })
    } finally {
      setLoading(false)
      setStreaming('')
      setSpinner('')
    }
  }, [onUserMessage, handlePermission, addMessage, streaming])

  const handleSlashCommand = useCallback((cmd: string) => {
    const base = cmd.split(' ')[0]
    switch (base) {
      case '/help':
        addMessage({
          id: Date.now().toString(),
          role: 'assistant',
          content: [
            'Commands:',
            '  /help      show this',
            '  /clear     clear conversation',
            '  /model     switch model',
            '  /cost      show session cost',
            '  /provider  connect provider',
            '  /skills    show skills',
            '  /plugins   manage plugins',
            '  /exit      exit AgentX',
            '',
            'Shortcuts:',
            '  Ctrl+C     cancel / exit',
            '  Ctrl+D     exit',
            '  Tab        autocomplete command',
            '  Shift+Enter  new line',
          ].join('\n'),
        })
        break
      case '/clear':
        setMessages([])
        break
      case '/cost':
        addMessage({
          id: Date.now().toString(),
          role: 'assistant',
          content: `Session: ${tokens.toLocaleString()} tokens ${icon.dot} $${cost.toFixed(4)}`,
        })
        break
      case '/exit':
      case '/quit':
        exit()
        break
      default:
        addMessage({
          id: Date.now().toString(),
          role: 'assistant',
          content: `Unknown command: ${base}. Type /help to see commands.`,
        })
    }
  }, [tokens, cost, exit, addMessage])

  return (
    <Box flexDirection="column" height="100%">
      <StatusBar model={model} tokens={tokens} cost={cost} />

      <Box flexDirection="column" flexGrow={1}>
        <MessageList messages={messages} streamingContent={streaming} />
        {tasks.length > 0 && <TaskList tasks={tasks} />}
        {permission && (
          <PermissionDialog
            action={permission.action}
            detail={permission.detail}
            onChoice={handlePermissionChoice}
          />
        )}
        {loading && Boolean(spinner) && <Spinner label={spinner} />}
      </Box>

      {messages.length === 0 && (
        <Box paddingLeft={1} marginBottom={1}>
          <Text dimColor>
            Ctrl+C exit {icon.dot} / commands {icon.dot} Shift+Enter new line
          </Text>
        </Box>
      )}

      <InputBar
        onSubmit={handleSubmit}
        onSlashCommand={handleSlashCommand}
        isLoading={loading}
      />
    </Box>
  )
}
