<div align="center">

<img src="https://raw.githubusercontent.com/SohailKhan0525/agentx-docs/main/static/img/logo.svg" width="100" height="100" alt="AgentX Logo" />

# AgentX

**The autonomous AI agent that builds production-ready websites from your terminal.**

[![npm version](https://img.shields.io/npm/v/@agent-qofeno/agentx-cli?style=for-the-badge&logo=npm&logoColor=white&color=000000&labelColor=18181b)](https://www.npmjs.com/package/@agent-qofeno/agentx-cli)
[![npm downloads](https://img.shields.io/npm/dm/@agent-qofeno/agentx-cli?style=for-the-badge&logo=npm&logoColor=white&color=000000&labelColor=18181b)](https://www.npmjs.com/package/@agent-qofeno/agentx-cli)
[![JSR Score](https://img.shields.io/badge/JSR-100%25-000000?style=for-the-badge&logo=deno&logoColor=white&labelColor=18181b)](https://jsr.io/@agent-qofeno/agentx-cli)
[![Font Awesome](https://img.shields.io/badge/Font_Awesome-Icons-000000?style=for-the-badge&logo=fontawesome&logoColor=white&labelColor=18181b)](https://fontawesome.com)
[![GitHub Stars](https://img.shields.io/github/stars/SohailKhan0525/agentx-cli?style=for-the-badge&logo=github&logoColor=white&color=000000&labelColor=18181b)](https://github.com/SohailKhan0525/agentx-cli)
[![License: MIT](https://img.shields.io/badge/License-MIT-000000?style=for-the-badge&logo=opensourceinitiative&logoColor=white&labelColor=18181b)](./LICENSE)
[![Platforms](https://img.shields.io/badge/Platforms-Windows%20%7C%20macOS%20%7C%20Linux-000000?style=for-the-badge&logo=linux&logoColor=white&labelColor=18181b)](#multi-platform-support)

<p align="center">
  <a href="https://sohailkhan0525.github.io/agentx-docs/"><b><img src="https://img.shields.io/badge/Docs-Live-000000?style=flat-square&logo=docusaurus&logoColor=white" /></b></a> •
  <a href="https://www.npmjs.com/package/@agent-qofeno/agentx-cli"><b><img src="https://img.shields.io/badge/npm-Package-000000?style=flat-square&logo=npm&logoColor=white" /></b></a> •
  <a href="https://github.com/SohailKhan0525/homebrew-agentx"><b><img src="https://img.shields.io/badge/Homebrew-Tap-000000?style=flat-square&logo=homebrew&logoColor=white" /></b></a> •
  <a href="https://jsr.io/@agent-qofeno/agentx-cli"><b><img src="https://img.shields.io/badge/JSR-Registry-000000?style=flat-square&logo=deno&logoColor=white" /></b></a>
</p>

</div>

---

## ⚡ What is AgentX?

**AgentX** is a terminal-based autonomous AI agent designed from the ground up to plan, code, test, and ship complete, production-grade web applications in minutes.

Unlike standard code-completion assistants, AgentX operates like a senior full-stack developer:
1. **<img src="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/svgs/solid/compass-drafting.svg" width="16" height="16" /> Plans Before Acting**: Writes an explicit multi-step blueprint and verifies requirements before touching code.
2. **<img src="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/svgs/solid/book-open.svg" width="16" height="16" /> Reads Before Editing**: Analyzes your workspace structure, dependencies, and syntax trees before modifying files.
3. **<img src="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/svgs/solid/wrench.svg" width="16" height="16" /> Uses Real Tools**: Executes shell commands, resolves dependencies, and applies unified diffs in real-time.
4. **<img src="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/svgs/solid/rotate.svg" width="16" height="16" /> Iterates Until Green**: Automatically detects and fixes TypeScript errors, lint warnings, and build failures until the project compiles cleanly.
5. **<img src="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/svgs/solid/rocket.svg" width="16" height="16" /> Ships Live**: Generates deployment configurations for Vercel, Netlify, Railway, or Fly.io and initializes git tracking.

---

## 🚀 Quick Start

### 📦 npm (Recommended)
```bash
npm install -g @agent-qofeno/agentx-cli
agentx
```

### 🍺 Homebrew (macOS & Linux)
```bash
brew tap SohailKhan0525/agentx
brew install agentx
```

### 🦕 JSR
```bash
npx jsr add @agent-qofeno/agentx-cli
```

### 📦 GitHub Packages
```bash
npm install -g @SohailKhan0525/agentx-cli --registry https://npm.pkg.github.com
```

---

## 🧠 Supported AI Providers

AgentX connects seamlessly to cloud AI models and private offline models:

| Provider | Models Supported | Token Setup |
|---|---|---|
| **Anthropic Claude** | `claude-opus-4-6`, `claude-sonnet-4-6`, `claude-haiku-4-5` | `console.anthropic.com` |
| **ChatGPT (OpenAI)** | `gpt-4o`, `gpt-4o-mini`, `gpt-4-turbo`, `o1` | `platform.openai.com` |
| **Google Gemini** | `gemini-2.0-flash`, `gemini-1.5-pro`, `gemini-1.5-flash` | `aistudio.google.com` |
| **GitHub Copilot** | Copilot Enterprise & Individual Chat models | GitHub Personal Access Token |
| **Local Models** | Ollama, LM Studio, Jan, GPT4All, llama.cpp | 100% Free & Offline |

> 🔒 **Security Notice**: All API keys are stored in your operating system's native secure credential vault (Keychain on macOS, Windows Credential Manager on Windows, Secret Service on Linux) via `keytar`. Keys are never written to plain text or committed to git.

---

## 🛠️ Supported Frameworks & Tech Stacks

AgentX intelligently configures the optimal stack based on your product requirements:

- **Next.js 14 (App Router)**: Server components, SSR, SSG, API routes, Tailwind CSS.
- **React + Vite**: Ultra-fast Single Page Applications, internal dashboards, and developer tools.
- **Astro**: Content-driven websites, docs, and high-performance blogs with island architecture.
- **Nuxt 3**: Modern Vue 3 full-stack applications with universal rendering.
- **Full TypeScript**: Every project is generated with strict TypeScript definitions and zero lint errors.

---

## 🔌 Integrated Backend & Cloud Services

AgentX automatically scaffolds SDK clients, environment variables, and authentication flows for:

- **Authentication**: Clerk, Supabase Auth, Firebase Auth, NextAuth / Auth.js.
- **Databases**: Supabase, Firebase Firestore, Appwrite, MongoDB Atlas, PlanetScale, PostgreSQL.
- **Payments**: Stripe Checkout, Customer Portal, Webhooks, Lemon Squeezy.
- **Email**: Resend, SendGrid, Postmark, Mailgun.
- **File Storage**: Cloudflare R2, AWS S3, Uploadthing, Supabase Storage.
- **Hosting & Deployment**: Vercel, Netlify, Railway, Fly.io, Cloudflare Pages, Render.

---

## ⌨️ Slash Commands & Shortcuts

Inside the interactive terminal session, control your agent with slash commands:

| Command | Description |
|---|---|
| `/help` | Display all available commands and keyboard shortcuts |
| `/model` | Switch between AI models on the fly |
| `/provider` | Connect or switch between AI providers |
| `/cost` | Show session token metrics and estimated inference cost |
| `/theme` | Toggle terminal UI themes |
| `/clear` | Clear screen and session message history |
| `/exit` | Safely exit AgentX |

---

## 💻 Multi-Platform Support

AgentX is engineered and continuously tested across:
- **Windows**: Windows 10/11 (PowerShell, Windows Terminal, Command Prompt).
- **macOS**: Apple Silicon (M1/M2/M3/M4) & Intel (x86_64).
- **Linux**: Ubuntu, Debian, Fedora, Arch Linux, Alpine.

---

## 📖 Documentation

Full documentation, configuration guides, and architecture references are available at:
👉 **[https://sohailkhan0525.github.io/agentx-docs/](https://sohailkhan0525.github.io/agentx-docs/)** *(or `https://agentx.js.org`)*

---

## 🤝 Contributing

Contributions are welcome! Please see our [Contributing Guide](./CONTRIBUTING.md) and join our community on [GitHub Issues](https://github.com/SohailKhan0525/agentx-cli/issues).

---

## 📄 License

AgentX is open-source software licensed under the [MIT License](./LICENSE).
