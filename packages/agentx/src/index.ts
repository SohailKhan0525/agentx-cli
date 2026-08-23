#!/usr/bin/env node

const [nodeMajor] = process.versions.node.split('.').map(Number)
if (nodeMajor < 18) {
  process.stderr.write('\nAgentX requires Node.js 18+\nhttps://nodejs.org\n\n')
  process.exit(1)
}

if (process.argv.includes('-v') || process.argv.includes('--version')) {
  console.log('2.0.3')
  process.exit(0)
}

import React from 'react'
import { render } from 'ink'
import { App } from './components/App'

async function main() {
  try {
    const { waitUntilExit } = render(
      React.createElement(App, {
        onUserMessage: async (text, approve, onStream, onToken) => {
          // Agent logic wired in next prompt
        },
        initialModel: 'claude-sonnet-4-6',
      })
    )
    await waitUntilExit()
  } catch (err) {
    process.stderr.write('\nAgentX crashed:\n' + String(err) + '\n')
    if (err instanceof Error && err.stack) {
      process.stderr.write(err.stack + '\n')
    }
    process.exit(1)
  }
}

main()
