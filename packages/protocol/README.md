<p align="center">
  <h1 align="center">@agentx-cli/protocol</h1>
  <p align="center"><strong>JSON-RPC, event wire schemas, and communication protocols for AgentX.</strong></p>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@agent-qofeno/agentx-cli"><img alt="npm version" src="https://img.shields.io/npm/v/@agent-qofeno/agentx-cli?style=flat-square&color=blue" /></a>
  <a href="https://github.com/SohailKhan0525/agentx-cli/blob/main/LICENSE"><img alt="License" src="https://img.shields.io/github/license/SohailKhan0525/agentx-cli?style=flat-square" /></a>
</p>

---

## Overview

`@agentx-cli/protocol` defines the deterministic message formats, JSON-RPC 2.0 specs, streaming event interfaces, and RPC request/response schemas shared between the CLI, server, language server (LSP), and editor integrations.

---

## Exports

- **`RPCMessage`**: Strongly-typed JSON-RPC 2.0 frame definitions.
- **`EventSchema`**: Streaming message schemas for tool execution, file edits, and agent state transitions.
- **`LSPBridge`**: LSP protocol adaptors and message encoders.

---

## License

[MIT](LICENSE)
