# AgentX Code

<p align="center">
  <b>The powerful AI coding agent built for the terminal and local model execution.</b>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@agent-qofeno/agentx-cli"><img alt="npm version" src="https://img.shields.io/npm/v/@agent-qofeno/agentx-cli?style=flat-square&color=00e5ff" /></a>
  <a href="https://github.com/SohailKhan0525/agentx-cli/actions/workflows/publish.yml"><img alt="Build status" src="https://img.shields.io/github/actions/workflow/status/SohailKhan0525/agentx-cli/publish.yml?style=flat-square&branch=main" /></a>
  <a href="https://github.com/SohailKhan0525/agentx-cli"><img alt="License: MIT" src="https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square" /></a>
</p>

<p align="center">
  <img src="screenshot-uk.png" alt="AgentX Code" width="600" />
</p>

---

## ⚡ Installation

Install **AgentX Code** globally using your preferred package manager:

```bash
# npm (Recommended)
npm install -g @agent-qofeno/agentx-cli@latest

# bun
bun install -g @agent-qofeno/agentx-cli@latest

# pnpm
pnpm add -g @agent-qofeno/agentx-cli@latest

# yarn
yarn global add @agent-qofeno/agentx-cli@latest
```

---

## 🚀 Quick Start

Launch AgentX Code inside any repository or workspace:

```bash
# Launch interactive TUI session
agentx

# Continue the previous session
agentx -c

# Resume a specific session
agentx -s <sessionID>

# Run a one-off autonomous coding task
agentx run "Fix the failing typecheck errors in src/"
```

---

## 🧠 Local Model Subsystem & Zero-Cloud Privacy

AgentX Code includes a first-class **Local AI Engine** with zero setup friction. Run state-of-the-art coding and reasoning models directly on your hardware without internet or API keys.

- **Automatic Hardware Probe**: Detects CPU cores, RAM, GPU vendors (NVIDIA, Apple Silicon unified memory, AMD, Intel), VRAM, and disk headroom.
- **Deterministic Fit Scoring**: Calculates exact compatibility scores (0–100) and warns against memory exhaustion before downloading.
- **Runtime Discovery**: Automatically probes and integrates with:
  - **Ollama** (`http://127.0.0.1:11434`)
  - **LM Studio** (`http://127.0.0.1:1234`)
  - **llama.cpp server** (`http://127.0.0.1:8080`)
  - **vLLM** (`http://127.0.0.1:8000`)
- **Interactive Slash Command**:

  ```bash
  # Check hardware profile & recommended models
  agentx local-model

  # Install and verify a model with streaming progress & healthcheck
  agentx local-model install qwen2.5-coder:7b
  ```

  Within the interactive chat session, type:

  

---

## ☁️ Supported Cloud AI Providers (BYOK)

AgentX Code supports industry-standard Bring-Your-Own-Key (BYOK) cloud providers:

- **Anthropic** (Claude 3.7 Sonnet, Claude 3.5 Sonnet, Claude 3.5 Haiku)
- **OpenAI** (GPT-4.5, GPT-4o, o1, o3-mini)
- **Google Gemini** (Gemini 2.0 Flash, Gemini 2.0 Pro, Gemini 1.5 Pro)
- **DeepSeek** (DeepSeek V3, DeepSeek R1)
- **GitHub Copilot**
- **Amazon Bedrock**
- **Azure OpenAI**
- **Groq**
- **Mistral AI**
- **Perplexity**
- **Cerebras**
- **Together AI**
- **OpenRouter**

Configure any provider with:

```bash
agentx providers
```

---

## 🛠️ Features

- 🖥️ **Ultra-Fast Terminal UI**: Responsive SolidJS-powered TUI with smooth diff viewer, full keyboard navigation, and theme customization.
- ⚡ **Autonomous Tool Execution**: Read/write files, grep search, execute test commands, and manage workspace subagents safely.
- 🔒 **Granular Permissions**: Configurable auto-approval rules and security boundaries.
- 🔌 **Model Context Protocol (MCP)**: Native integration with MCP servers and skills.
- 📦 **Multi-Session History**: Fast instant resumption and full transcript persistence.

---

## 📄 License & Attribution

AgentX Code is licensed under the [MIT License](LICENSE).

_Attribution_: AgentX Code is built upon the open-source foundation of AgentX Code. AgentX Code is an independent product maintained by [Sohail Khan](https://github.com/SohailKhan0525/agentx-cli) and is not affiliated with the upstream AgentX Code project.
