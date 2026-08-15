# @agentx-cli/sdk

The official TypeScript/JavaScript SDK for interacting with AgentX servers, sessions, and agents programmatically.

## Installation

```bash
npm install @agentx-cli/sdk
# or
bun add @agentx-cli/sdk
```

## Quickstart

```typescript
import { createAgentXClient } from "@agentx-cli/sdk"

// Connect to a running AgentX server
const client = createAgentXClient({
  baseUrl: "http://localhost:4096",
  directory: process.cwd(),
})

// Create a new website build session
const session = await client.session.create({
  title: "Modern SaaS Landing Page",
})

console.log("Created session:", session.id)

// Send a prompt to the website builder
const response = await client.session.prompt({
  sessionID: session.id,
  prompt: "Build a modern full-stack Next.js 14 website with Tailwind CSS, Stripe checkout, and SQLite database.",
})
```

## Features

- **Full Type Safety** — Auto-generated types from the authoritative AgentX OpenAPI schema.
- **Session Management** — Create, switch, list, and resume conversational build sessions.
- **Real-time SSE Streaming** — Stream tokens, tool calls, and model outputs in real time.
- **Process Orchestration** — Manage embedded server lifecycle and in-process execution.

## Documentation

For full documentation and API reference, visit [https://github.com/SohailKhan0525/agentx-cli](https://github.com/SohailKhan0525/agentx-cli).

## License

MIT © Sohail Khan
