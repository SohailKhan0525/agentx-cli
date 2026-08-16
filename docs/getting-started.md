# Getting Started with AgentX

AgentX is an autonomous terminal-based AI agent designed specifically for building complete, production-ready full-stack websites from plain English instructions.

---

## 💻 System Requirements

- **Operating System**:
  - **Windows**: Windows 10 / 11 (x64, ARM64) via Windows Terminal, PowerShell, or CMD
  - **macOS**: macOS 12 Monterey or later (Apple Silicon ARM64, Intel x64)
  - **Linux**: Ubuntu, Debian, Fedora, Arch, Alpine (x64, ARM64 with glibc or musl)
- **Runtimes**:
  - Node.js 18.0.0 or higher, OR Bun 1.2+

---

## 📦 Installation

### Global Install via Package Managers

```bash
# NPM (Recommended)
npm install -g @agent-qofeno/agentx-cli

# Bun
bun add -g @agent-qofeno/agentx-cli

# PNPM
pnpm add -g @agent-qofeno/agentx-cli

# Yarn
yarn global add @agent-qofeno/agentx-cli
```

### Instant Execution without Installation

```bash
npx @agent-qofeno/agentx-cli
```

### One-line Shell Script (macOS / Linux)

```bash
curl -fsSL https://raw.githubusercontent.com/SohailKhan0525/agentx-cli/main/install.sh | bash
```

---

## 🚀 Your First Website

1. Open your terminal in any directory:
   ```bash
   agentx
   ```
2. Set up your AI provider (e.g. OpenAI, Anthropic, Google Gemini, GitHub Copilot, or local Ollama).
3. Type your prompt in plain English:
   ```text
   Build a modern SaaS landing page for an AI podcast generator with Next.js 15, TailwindCSS, dark mode, dynamic audio player, and Stripe pricing cards.
   ```
4. AgentX will:
   - Formulate the architecture blueprint.
   - Initialize the Next.js project.
   - Install required dependencies.
   - Write components, pages, server actions, and styles.
   - Execute the build test and autonomously fix any TypeScript errors.
   - Provide a live dev server URL to preview your new website.
