<p align="center">
  <h1 align="center">AgentX</h1>
</p>

<p align="center">The autonomous AI agent that builds production-ready websites from your terminal.</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@agent-qofeno/agentx-cli"><img alt="npm" src="https://img.shields.io/npm/v/@agent-qofeno/agentx-cli?style=flat-square&color=blue" /></a>
  <a href="https://github.com/SohailKhan0525/agentx-cli/actions/workflows/ci.yml"><img alt="Build status" src="https://img.shields.io/github/actions/workflow/status/SohailKhan0525/agentx-cli/ci.yml?style=flat-square&label=CI" /></a>
  <a href="https://github.com/SohailKhan0525/agentx-cli/releases"><img alt="Release" src="https://img.shields.io/github/v/release/SohailKhan0525/agentx-cli?style=flat-square&color=success" /></a>
  <a href="https://github.com/SohailKhan0525/agentx-cli/blob/main/LICENSE"><img alt="License" src="https://img.shields.io/github/license/SohailKhan0525/agentx-cli?style=flat-square" /></a>
  <a href="https://github.com/SohailKhan0525/agentx-cli/stargazers"><img alt="Stars" src="https://img.shields.io/github/stars/SohailKhan0525/agentx-cli?style=flat-square&logo=github" /></a>
</p>

<p align="center">
  <a href="README.md">English</a> |
  <a href="README.zh.md">简体中文</a> |
  <a href="README.ja.md">日本語</a> |
  <a href="README.es.md">Español</a> |
  <a href="README.de.md">Deutsch</a> |
  <a href="README.fr.md">Français</a> |
  <a href="README.ko.md">한국어</a>
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

---

### Installation

```bash
# YOLO
curl -fsSL https://raw.githubusercontent.com/SohailKhan0525/agentx-cli/main/install.sh | bash

# Package managers
npm install -g @agent-qofeno/agentx-cli    # npm
bun add -g @agent-qofeno/agentx-cli        # bun
pnpm add -g @agent-qofeno/agentx-cli       # pnpm
yarn global add @agent-qofeno/agentx-cli   # yarn

# Or run instantly with npx
npx @agent-qofeno/agentx-cli
```

> [!TIP]
> Works on **Windows**, **macOS**, and **Linux**. Requires Node.js 18+ or Bun 1.2+.

#### Installation Directory

The installer respects the following path priority:

1. `$AGENTX_INSTALL_DIR` - Custom directory
2. `$XDG_BIN_DIR` - XDG standard binary directory
3. `$HOME/bin` - User binary path
4. `$HOME/.agentx/bin` - Default fallback directory

---

### Quickstart

```bash
agentx
```

Just describe what you want to build in plain English:

> *"Build a modern real-time SaaS dashboard for crypto portfolios with Next.js 15 App Router, Supabase auth and Postgres DB, Stripe billing, TailwindCSS, and dark mode."*

---

### What AgentX Does

AgentX has one dedicated agent brain: **the website builder**. It builds complete, production-ready websites handling the full stack:

1. **Autonomous Architecture Selection**: Automatically selects the optimal modern stack (Next.js 14/15, React + Vite, Astro, or Nuxt 3).
2. **Backend & Service Integration**: Detects database, authentication, file storage, email, and payment requirements.
3. **Interactive Configuration**: Guides you step-by-step through API keys and configurations.
4. **Transparent Blueprints**: Presents the complete architecture plan before generating code.
5. **Real, Production Code**: Generates complete pages, server actions, API routes, and database schemas.
6. **Zero Placeholders**: No dummy functions, no mock data, and no `TODO` comments.
7. **Self-Healing Builds**: Automatically executes builds, detects TypeScript or bundling errors, and fixes them autonomously.
8. **Git & Live Deployment**: Initializes git, commits clean history, pushes to GitHub, and deploys live to Vercel, Netlify, or Cloudflare Pages.

---

### Supported Stacks

| Framework | Architecture | Best For |
|:---|:---|:---|
| **Next.js 14 / 15** | App Router, Server Actions, SSR | Full-stack SaaS, marketplaces, web applications |
| **React + Vite** | Single Page Application, Client-Side | Interactive dashboards, high-speed client apps |
| **Astro** | Static / Islands Architecture | High-performance content sites, blogs, portfolios |
| **Nuxt 3** | Universal Vue 3 SSR | Vue-based full-stack web platforms |

---

### AI Providers

AgentX is model-agnostic and supports 5 AI provider backends:

- **GitHub Copilot** (`github-copilot`)
- **OpenAI** (`openai`) — `gpt-4o`, `gpt-4o-mini`, `gpt-4-turbo`
- **Google** (`google`) — `gemini-2.0-flash`, `gemini-1.5-pro`, `gemini-1.5-flash`
- **Anthropic** (`anthropic`) — `claude-3-7-sonnet`, `claude-3-5-haiku`, `claude-3-opus`
- **Local Models** (`local`) — Ollama, LM Studio, Jan, GPT4All, llama.cpp

#### Local Hardware Intelligence

AgentX automatically detects your host hardware specs (CPU, RAM, GPU, VRAM) and recommends the optimal coding model your machine can run locally for 100% private, on-device development.

---

### Integrated Cloud Ecosystem

AgentX natively connects to and generates production code for:

- **Authentication**: Clerk, Supabase Auth, Firebase Auth, NextAuth / Auth.js
- **Databases**: Supabase, MongoDB Atlas, Firebase Firestore, PostgreSQL, SQLite, PlanetScale
- **Payments**: Stripe, Lemon Squeezy
- **Emails**: Resend, SendGrid, Postmark
- **Hosting & Infrastructure**: Vercel, Netlify, Railway, Fly.io, Cloudflare Pages, Render
- **Storage & Telemetry**: AWS S3, Cloudflare R2, Uploadthing, PostHog, Sentry

---

### Component Registry

AgentX integrates pre-built UI building blocks from **ReactBits** and **21st.dev**, generating interactive animations, dark mode palettes, and responsive layouts right into your repository.

---

### Monorepo Packages

| Package | Version | Description |
|:---|:---|:---|
| [`@agent-qofeno/agentx-cli`](packages/agentx-cli) | `1.20.67` | Main interactive terminal CLI binary |
| [`@agentx-cli/core`](packages/core) | `1.20.67` | Core agent engine and tool runtime |
| [`@agentx-cli/tui`](packages/tui) | `1.20.67` | Terminal UI powered by OpenTUI and Solid.js |
| [`@agentx-cli/llm`](packages/llm) | `1.20.67` | Provider-neutral Effect LLM routing client |
| [`@agentx-cli/server`](packages/server) | `1.20.67` | Local HTTP & WebSocket control plane server |
| [`@agentx-cli/ui`](packages/ui) | `1.20.67` | Design system, tokens, and component registry |
| [`@agentx-cli/protocol`](packages/protocol) | `1.20.67` | JSON-RPC 2.0 and event wire protocols |
| [`@agentx-cli/schema`](packages/schema) | `1.20.67` | Shared data schemas and validation models |
| [`@agentx-cli/sdk`](packages/sdk/js) | `1.20.67` | JavaScript / TypeScript client SDK |
| [`@agentx-cli/plugin`](packages/plugin) | `1.20.67` | Extensibility and plugin architecture |

---

### Contributing

We welcome community contributions! Please review [`CONTRIBUTING.md`](CONTRIBUTING.md) and [`SECURITY.md`](SECURITY.md) before opening a pull request.

---

### Community & Support

- **GitHub Issues**: [Report a Bug](https://github.com/SohailKhan0525/agentx-cli/issues)
- **GitHub Discussions**: [Ask Questions & Share Feedback](https://github.com/SohailKhan0525/agentx-cli/discussions)
- **Releases**: [Release Notes](https://github.com/SohailKhan0525/agentx-cli/releases)

---

<p align="center">
  <strong>Star this repository if AgentX helps you ship real websites! ⭐</strong><br>
  <a href="https://github.com/SohailKhan0525/agentx-cli">github.com/SohailKhan0525/agentx-cli</a>
</p>
