<div align="center">

# AgentX

### The autonomous AI agent that builds complete, production-ready websites from your terminal.

[![npm version](https://img.shields.io/npm/v/@agent-qofeno/agentx-cli.svg?style=flat-square)](https://www.npmjs.com/package/@agent-qofeno/agentx-cli)
[![npm downloads](https://img.shields.io/npm/dm/@agent-qofeno/agentx-cli.svg?style=flat-square)](https://www.npmjs.com/package/@agent-qofeno/agentx-cli)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)

[Quickstart](#quickstart) • [How It Works](#how-it-works) • [Supported Stacks](#supported-stacks) • [Model Providers](#model-providers) • [Documentation](#documentation)

</div>

---

## What is AgentX?

AgentX is a specialized AI agent with one purpose: **building complete, production-ready websites from a plain English prompt.**

Give AgentX a description of the website you want, and it handles the full stack — frontend UI, backend API routes, database schemas, authentication, payments, SEO, performance optimization, and deployment configuration.

No half-built components. No `// TODO: implement later`. No placeholder data. Every file is complete and production-ready from minute one.

---

## Quickstart

### Option 1: Run instantly with npx (recommended)

```bash
npx @agent-qofeno/agentx-cli
```

### Option 2: Install globally

```bash
# Using npm
npm install -g @agent-qofeno/agentx-cli

# Using bun
bun install -g @agent-qofeno/agentx-cli

# Run anywhere
agentx
```

---

## How It Works

AgentX executes a methodical **9-phase building process** for every website:

1. **Architecture & Planning** — Analyzes requirements, selects the optimal stack, plans directory structure and database schema.
2. **Project Scaffolding** — Sets up framework configuration, TypeScript strict mode, Tailwind CSS, dependencies, and build scripts.
3. **Design System & Primitives** — Creates tailored color palettes, typography scales, and reusable UI components.
4. **Layout & Navigation** — Builds responsive headers, mobile navigation drawers, search, theme toggles, and multi-column footers.
5. **Page Development** — Fully implements every page with rich, realistic domain copy (zero lorem ipsum).
6. **Backend, API & Database** — Creates type-safe API routes, database schemas with Drizzle/Prisma, auth flows, and webhook handlers.
7. **Polish & Micro-Interactions** — Adds smooth entrance animations, hover states, loading skeletons, and toast notifications.
8. **SEO & Accessibility** — Injects semantic HTML, Open Graph cards, sitemaps, structured JSON-LD data, and WCAG AA contrast.
9. **Verification & Delivery** — Runs type checks, verifies clean production builds, and provides launch instructions.

---

## Supported Stacks

| Framework | Best For | Default Features |
|-----------|----------|------------------|
| **Next.js 14+** (App Router) | Full-stack web apps, SaaS platforms | Server Actions, SSR/SSG, SQLite/Postgres with Drizzle |
| **React + Vite** | Dynamic single-page applications, dashboards | Client-side routing, optimistic UI, state management |
| **Astro** | Content websites, marketing, blogs, portfolios | Zero-JS by default, MDX content collections, blazing speed |
| **Nuxt 3** | Vue-based full-stack web applications | Nitro engine, server routes, auto-imports |

---

## Model Providers

AgentX connects with top cloud AI providers and local model engines:

| Provider | Supported Models | Setup |
|----------|------------------|-------|
| **GitHub Copilot** | GPT-4o, Claude 3.5 Sonnet | GitHub PAT with copilot scope |
| **ChatGPT (OpenAI)** | `gpt-4o`, `gpt-4o-mini`, `gpt-4-turbo` | OpenAI API key |
| **Google (Gemini)** | `gemini-2.0-flash`, `gemini-1.5-pro`, `gemini-1.5-flash` | Google AI Studio API key |
| **Anthropic (Claude)** | `claude-opus-4-6`, `claude-sonnet-4-6`, `claude-haiku-4-5` | Anthropic API key |
| **Local Models** | Ollama, LM Studio, Jan, GPT4All, llama.cpp, LocalAI | Auto-detected on local ports |

### Local Models (Offline & Private)

AgentX includes a built-in hardware profiler and automatic model tier recommendations for local generation:

```bash
# Fast tier (laptops, <8GB RAM)
ollama run qwen2.5-coder:1.5b

# Balanced tier (8-16GB RAM)
ollama run qwen2.5-coder:7b

# Quality tier (16GB+ RAM, NVIDIA / Apple Silicon GPU)
ollama run qwen2.5-coder:14b
```

---

## Available Commands

In the AgentX terminal interface:

- `switch session` — Switch between active build sessions
- `switch model` — Change the active LLM model
- `move session` — Move session to another project directory
- `variant cycle` — Cycle through model reasoning/effort variants
- `switch model variant` — Select a specific model variant
- `connect provider` — Connect API keys or local engines
- `switch theme` — Customize terminal UI theme
- `help` — Open the help dialog
- `open docs` — Open documentation on GitHub
- `exit the app` — Exit the AgentX CLI
- `toggle debug panel` — Open the debug overlay
- `enable auto approve permissions` — Auto-approve tool executions
- `hide tips` — Toggle home screen tips
- `skills` — Manage specialized agent skills
- `install plugins` — Install community plugins
- `plugins` — View active plugins

---

## Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on development, testing, and pull requests.

---

## License

[MIT](LICENSE) © 2026 Sohail Khan & AgentX Contributors
