<p align="center">
  <h1 align="center">AgentX ⚡</h1>
</p>

<p align="center"><strong>The autonomous AI agent that builds production-ready websites from your terminal.</strong></p>

<p align="center">
  <a href="https://www.npmjs.com/package/@agent-qofeno/agentx-cli"><img alt="npm version" src="https://img.shields.io/npm/v/@agent-qofeno/agentx-cli?style=flat-square&color=blue&label=npm" /></a>
  <a href="https://www.npmjs.com/package/@agent-qofeno/agentx-cli"><img alt="npm downloads" src="https://img.shields.io/npm/dm/@agent-qofeno/agentx-cli?style=flat-square&color=success" /></a>
  <a href="https://github.com/SohailKhan0525/agentx-cli/actions/workflows/publish.yml"><img alt="Build & Publish" src="https://img.shields.io/github/actions/workflow/status/SohailKhan0525/agentx-cli/publish.yml?style=flat-square&label=verified%20build" /></a>
  <a href="https://github.com/SohailKhan0525/agentx-cli/blob/main/LICENSE"><img alt="License" src="https://img.shields.io/github/license/SohailKhan0525/agentx-cli?style=flat-square" /></a>
  <a href="https://github.com/SohailKhan0525/agentx-cli/stargazers"><img alt="Stars" src="https://img.shields.io/github/stars/SohailKhan0525/agentx-cli?style=flat-square&logo=github" /></a>
</p>

```
    ___                    __  _  __
   /   | ____ ____  ____  / /_| |/ /
  / /| |/ __ `/ _ \/ __ \/ __/   / 
 / ___ / /_/ /  __/ / / / /_/   |  
/_/  |_\__, /\___/_/ /_/\__/_/|_|  
      /____/                       
  The Autonomous Website Builder
```

<p align="center">
  <b><a href="./docs/README.md">📖 Explore Full Documentation & Guides →</a></b>
</p>

---

## ⚡ Installation

```bash
# Global install (recommended)
npm install -g @agent-qofeno/agentx-cli

# Instant execution with zero install
npx @agent-qofeno/agentx-cli
```

> [!TIP]
> Supports **Windows**, **macOS**, and **Linux** with Node.js ≥ 22.0 or Bun ≥ 1.2. Zero native compilation required.

---

## 🚀 Quickstart & Usage

### 1. Interactive Terminal Assistant
```bash
agentx
```
Simply type your website prompt and hit **Enter**:
> *"Build a modern real-time SaaS portfolio for a design agency with Next.js 15, TailwindCSS, dark mode, Supabase auth, and Stripe billing."*

### 2. Direct Prompt Mode
```bash
agentx run "Create a minimalist developer blog using Astro and TailwindCSS"
```

### 3. Web UI Mode
Prefer a browser dashboard with live visual previews?
```bash
agentx web
```
*Automatically starts a local server and opens your browser.*

---

## 🧩 AgentX Ecosystem

| Component | Package / Path | Description |
| :--- | :--- | :--- |
| **CLI** | [`@agent-qofeno/agentx-cli`](https://www.npmjs.com/package/@agent-qofeno/agentx-cli) | Terminal & TUI autonomous builder interface |
| **Core Brain** | `packages/core` | Autonomous architecture planner, build healer & code generator |
| **SDK** | `packages/sdk` | Embed AgentX programmatically into custom apps and bots |
| **Plugins** | `packages/plugin` | Modular integrations (Supabase, Stripe, Tailwind, Figma) |
| **Web UI** | `packages/ui` / `packages/server` | Browser-based interactive development dashboard |

---

## 🛠️ CLI Commands Cheat Sheet

| Command | Description |
| :--- | :--- |
| `agentx` | Launch the interactive AgentX terminal session |
| `agentx web` | Start the local server and open the browser web interface |
| `agentx run [prompt]` | Run AgentX autonomously with an inline prompt |
| `agentx models` | List all available cloud and local AI models |
| `agentx providers` | Configure OpenAI, Anthropic, Gemini, Copilot, or Ollama API keys |
| `agentx mcp` | Manage Model Context Protocol (MCP) integrations |
| `agentx upgrade` | Check for updates and upgrade AgentX to the latest version |

---

## 🤝 Contributing & Community

We welcome open-source contributions, feature requests, and bug reports!

* 💡 **Have a feature idea or found a bug?** [Open an Issue](https://github.com/SohailKhan0525/agentx-cli/issues)
* 🚀 **Want to contribute code?** Check out [`good first issue`](https://github.com/SohailKhan0525/agentx-cli/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22) and submit a [Pull Request](https://github.com/SohailKhan0525/agentx-cli/pulls)!

### Development Setup
```bash
git clone https://github.com/SohailKhan0525/agentx-cli.git
cd agentx-cli
bun install
bun run dev
```

---

## 📄 License

MIT © [SohailKhan0525](https://github.com/SohailKhan0525)
