# @agent-qofeno/agentx-cli

Core CLI binary and interactive terminal interface for AgentX.

[![npm version](https://img.shields.io/npm/v/@agent-qofeno/agentx-cli?style=for-the-badge&logo=npm&color=000000&labelColor=18181b)](https://www.npmjs.com/package/@agent-qofeno/agentx-cli)
[![License: MIT](https://img.shields.io/badge/License-MIT-000000?style=for-the-badge&logo=opensourceinitiative&labelColor=18181b)](../../LICENSE)

## Overview

This package houses the AgentX terminal user interface (built with React and Ink), the multi-model agent reasoning loop, tool execution engines, and OS keychain adapters.

## Installation

```bash
npm install -g @agent-qofeno/agentx-cli
```

## Programmatic Usage

```typescript
import { run, getVersion } from '@agent-qofeno/agentx-cli';

console.log('Running AgentX v' + getVersion());
await run({
  model: 'gpt-4o',
  provider: 'openai',
  cwd: process.cwd()
});
```

## Features

- **Ink Terminal UI**: Pure monochromatic layout inspired by Claude Code.
- **Autonomous Agent Brain**: Automated planning, file editing, and command execution.
- **Secure Keytar Vault**: Native OS credential management.
- **Multi-Model Provider Architecture**: OpenAI, Anthropic, Google Gemini, GitHub Copilot, and Ollama.
