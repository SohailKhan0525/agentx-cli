<p align="center">
  <h1 align="center">@agentx-cli/llm</h1>
  <p align="center"><strong>Schema-first, provider-neutral LLM client engine for AgentX.</strong></p>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@agent-qofeno/agentx-cli"><img alt="npm version" src="https://img.shields.io/npm/v/@agent-qofeno/agentx-cli?style=flat-square&color=blue" /></a>
  <a href="https://github.com/SohailKhan0525/agentx-cli/blob/main/LICENSE"><img alt="License" src="https://img.shields.io/github/license/SohailKhan0525/agentx-cli?style=flat-square" /></a>
</p>

---

## Overview

`@agentx-cli/llm` provides a single typed request, response, event, and tool language built on top of [Effect](https://effect.website). Provider details and protocol wire formats live strictly in internal adapters, providing a unified developer interface.

```ts
import { Effect } from "effect"
import { LLM, LLMClient } from "@agentx-cli/llm"
import { OpenAI } from "@agentx-cli/llm/providers"

const model = OpenAI.configure({ apiKey: process.env.OPENAI_API_KEY }).responses("gpt-4o")

const request = LLM.request({
  model,
  system: "You are an autonomous website builder.",
  prompt: "Build a production-ready Next.js application.",
  generation: { maxTokens: 4096 },
})

const program = Effect.gen(function* () {
  const response = yield* LLMClient.generate(request)
  console.log(response.text)
})
```

---

## Supported AI Providers

AgentX strictly supports 5 production-ready providers:

1. **GitHub Copilot** (`github-copilot`)
2. **OpenAI** (`openai`) — `gpt-4o`, `gpt-4o-mini`, `gpt-4-turbo`
3. **Google** (`google`) — `gemini-2.0-flash`, `gemini-1.5-pro`, `gemini-1.5-flash`
4. **Anthropic** (`anthropic`) — `claude-3-7-sonnet`, `claude-3-5-haiku`, `claude-3-opus`
5. **Local Models** (`local`) — Ollama, LM Studio, Jan, GPT4All, llama.cpp via `@ai-sdk/openai-compatible`

---

## Public API

- **`LLM.request({...})`**: Build a provider-neutral `LLMRequest`.
- **`LLMClient.generate(request)`**: Execute one-shot generation.
- **`LLMClient.stream(request)`**: Stream typed `LLMEvent` instances incrementally across any provider.
- **`LLMEvent.is.*`**: Type guards (`is.textDelta`, `is.toolCall`, `is.finish`) for event streams.

---

## License

[MIT](LICENSE)
