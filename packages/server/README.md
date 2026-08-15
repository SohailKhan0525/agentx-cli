<p align="center">
  <h1 align="center">@agentx-cli/server</h1>
  <p align="center"><strong>High-performance HTTP & WebSocket server for the AgentX runtime.</strong></p>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@agent-qofeno/agentx-cli"><img alt="npm version" src="https://img.shields.io/npm/v/@agent-qofeno/agentx-cli?style=flat-square&color=blue" /></a>
  <a href="https://github.com/SohailKhan0525/agentx-cli/blob/main/LICENSE"><img alt="License" src="https://img.shields.io/github/license/SohailKhan0525/agentx-cli?style=flat-square" /></a>
</p>

---

## Overview

`@agentx-cli/server` provides the local control plane, JSON-RPC endpoints, and real-time event streaming server that connects the AgentX core engine to external clients, Web UIs, IDE extensions, and the OpenTUI terminal interface.

---

## Key Features

- **Effect-Native HTTP Server**: Built on top of Effect HTTP primitives for high throughput and structured concurrency.
- **WebSocket Streaming**: Bi-directional streaming for terminal I/O, tool call approval prompts, and live file diffs.
- **REST & RPC Routing**: Clean endpoints for session management, provider configuration, workspace discovery, and artifact retrieval.
- **Integrated Authentication**: Local token verification and cross-origin security guards.

---

## Usage

```ts
import { Effect, Layer } from "effect"
import { Server } from "@agentx-cli/server"

const program = Effect.gen(function* () {
  const server = yield* Server.start({ port: 3000 })
  console.log(`AgentX Server listening at http://127.0.0.1:3000`)
})
```

---

## License

[MIT](LICENSE)
