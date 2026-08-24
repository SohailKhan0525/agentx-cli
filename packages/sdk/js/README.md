# @agentx-cli/sdk

Official JavaScript & TypeScript SDK for embedding AgentX in applications.

[![npm version](https://img.shields.io/npm/v/@agent-qofeno/agentx-cli?style=for-the-badge&logo=npm&color=000000&labelColor=18181b)](https://www.npmjs.com/package/@agent-qofeno/agentx-cli)
[![License: MIT](https://img.shields.io/badge/License-MIT-000000?style=for-the-badge&logo=opensourceinitiative&labelColor=18181b)](../../../LICENSE)

## Installation

```bash
npm install @agent-qofeno/agentx-cli
```

## Usage

```typescript
import { AgentX } from '@agentx-cli/sdk';

const agent = new AgentX({
  apiKey: process.env.OPENAI_API_KEY,
  model: 'gpt-4o'
});

await agent.build({
  prompt: 'Create a Next.js 14 SaaS landing page with Supabase auth and Stripe checkout',
  outputPath: './my-saas'
});
```
