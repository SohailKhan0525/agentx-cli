<p align="center">
  <h1 align="center">AgentX</h1>
  <p align="center"><strong>The autonomous AI agent that builds production-ready websites from your terminal.</strong></p>
  <p align="center">Describe your website. AgentX builds it, deploys it, ships it.<br>Not a demo. Not an MVP. A real website, live on the internet.</p>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@agent-qofeno/agentx-cli"><img alt="npm version" src="https://img.shields.io/npm/v/@agent-qofeno/agentx-cli?style=flat-square&color=blue" /></a>
  <a href="https://github.com/SohailKhan0525/agentx-cli/actions/workflows/ci.yml"><img alt="CI Status" src="https://img.shields.io/github/actions/workflow/status/SohailKhan0525/agentx-cli/ci.yml?style=flat-square&label=CI" /></a>
  <a href="https://github.com/SohailKhan0525/agentx-cli/releases"><img alt="GitHub Release" src="https://img.shields.io/github/v/release/SohailKhan0525/agentx-cli?style=flat-square&color=success" /></a>
  <a href="https://github.com/SohailKhan0525/agentx-cli/blob/main/LICENSE"><img alt="License" src="https://img.shields.io/github/license/SohailKhan0525/agentx-cli?style=flat-square" /></a>
  <a href="https://github.com/SohailKhan0525/agentx-cli"><img alt="Stars" src="https://img.shields.io/github/stars/SohailKhan0525/agentx-cli?style=flat-square&logo=github" /></a>
</p>

---

### Installation

```bash
# Recommended via npm
npm install -g @agent-qofeno/agentx-cli

# Or run instantly without installing
npx @agent-qofeno/agentx-cli
```

Works out of the box on **Windows**, **macOS**, and **Linux**.

---

### Usage

```bash
agentx
```

Just describe what you want to build in plain English.

---

### What AgentX Does

1. **Autonomous Architecture**: Picks the ideal modern tech stack for your project.
2. **Backend & Services**: Identifies database, auth, storage, and payment requirements.
3. **Interactive Setup**: Guides you through API keys and configurations step-by-step.
4. **Transparent Blueprint**: Presents the full architecture plan before writing code.
5. **Production-Grade Implementation**: Generates every page with real, complete code.
6. **Zero Placeholders**: No mock data, no `TODO` comments, no dummy functions.
7. **Self-Healing Build**: Detects TypeScript and bundling errors and fixes them automatically.
8. **Git & Deployment**: Pushes repository to GitHub and deploys live to production.

---

### Supported Stacks

| Framework | Architecture | Best For |
|:---|:---|:---|
| **Next.js 14 / 15** | App Router, Server Actions, SSR | Full-stack SaaS, marketplaces, web applications |
| **React + Vite** | SPA, Client-side bundle | High-performance dashboards and interactive apps |
| **Astro** | Static / Islands Architecture | High-speed marketing sites, blogs, documentation |
| **Nuxt 3** | Universal Vue 3 SSR | Vue-based full-stack applications |

---

### AI Providers

- **GitHub Copilot**
- **OpenAI** — `gpt-4o`, `gpt-4o-mini`, `gpt-4-turbo`
- **Google** — `gemini-2.0-flash`, `gemini-1.5-pro`, `gemini-1.5-flash`
- **Anthropic** — `claude-3-7-sonnet`, `claude-3-5-haiku`, `claude-3-opus`
- **Local Models** — Ollama, LM Studio, Jan, GPT4All, llama.cpp, LocalAI

---

### Integrated Services

- **Authentication**: Clerk, Supabase Auth, Firebase Auth, NextAuth / Auth.js
- **Databases**: Supabase, MongoDB Atlas, Firebase Firestore, PostgreSQL, SQLite, PlanetScale
- **Payments**: Stripe, Lemon Squeezy
- **Emails**: Resend, SendGrid, Postmark
- **Hosting & Deployment**: Vercel, Netlify, Railway, Fly.io, Cloudflare Pages, Render
- **Storage & Telemetry**: AWS S3, Cloudflare R2, Uploadthing, PostHog, Sentry

---

### Local Model Intelligence

AgentX detects your system hardware (CPU, RAM, GPU, VRAM) and automatically suggests or connects to optimal local models via Ollama, LM Studio, Jan, or llama.cpp for 100% private, on-device execution.

---

### Component Registry

AgentX integrates pre-built, high-converting UI components from **ReactBits** and **21st.dev**, ensuring stunning typography, smooth animations, and responsive modern layouts without generic boilerplate.

---

### Monorepo Packages

| Package | Version | Description |
|:---|:---|:---|
| [`@agent-qofeno/agentx-cli`](packages/agentx-cli) | `1.20.67` | Main interactive CLI binary |
| [`@agentx-cli/core`](packages/core) | `1.20.67` | Core agent engine and tool execution |
| [`@agentx-cli/tui`](packages/tui) | `1.20.67` | Terminal User Interface powered by OpenTUI |
| [`@agentx-cli/llm`](packages/llm) | `1.20.67` | Model routing and streaming client |
| [`@agentx-cli/schema`](packages/schema) | `1.20.67` | Type schemas and contracts |
| [`@agentx-cli/sdk`](packages/sdk/js) | `1.20.67` | Programmatic JavaScript / TypeScript SDK |
| [`@agentx-cli/plugin`](packages/plugin) | `1.20.67` | Extensibility and plugin architecture |

---

### Issues & Support

- **Bug Reports & Feature Requests**: [GitHub Issues](https://github.com/SohailKhan0525/agentx-cli/issues)
- **Discussions**: [GitHub Discussions](https://github.com/SohailKhan0525/agentx-cli/discussions)

---

### Star This Project ⭐

If AgentX helps you ship something real, support the project with a star on [GitHub](https://github.com/SohailKhan0525/agentx-cli)!
