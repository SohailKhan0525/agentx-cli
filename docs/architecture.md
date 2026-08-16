# AgentX Core Architecture

AgentX is engineered from the ground up for high-fidelity code generation and autonomous verification.

---

## 🏗️ The Autonomous Loop

Unlike generic chat assistants that output markdown snippets, AgentX executes a closed-loop engineering process:

```
[User Prompt]
      │
      ▼
[1. Stack & Architecture Reasoning]
      │
      ▼
[2. Interactive Blueprint & Review]
      │
      ▼
[3. Code Generation (Zero Placeholders)]
      │
      ▼
[4. Build Verification & Type Checking] ──(Errors Found)──┐
      │                                                   │
      ▼                                                   ▼
[5. Self-Healing Compiler Loop] ◄─────────────────────────┘
      │
      ▼
[6. Git Commit & Live Deployment]
```

---

## ⚡ Key Architectural Pillars

### 1. Zero-Placeholder Policy
AgentX never generates placeholder code, `TODO` comments, or stubbed mock responses. Every generated route, component, utility, and database schema is fully realized and executable.

### 2. Autonomous Self-Healing Engine
Whenever a project is created or edited, AgentX runs the stack's build compiler (`next build`, `vite build`, `astro check`, `nuxt build`). If any TypeScript, ESLint, or bundler error occurs, the error stack trace is ingested and resolved autonomously before returning to the user.

### 3. Integrated Hardware Discovery
AgentX detects your CPU cores, RAM, GPU architecture (Apple Metal, NVIDIA CUDA, AMD ROCm), and detects active local LLM runners (Ollama, LM Studio, Jan, GPT4All, Llama.cpp) with zero manual network setup.

### 4. OpenTui Terminal Engine
AgentX features a bespoke terminal user interface built on OpenTui and Solid.js, delivering 60 FPS rendering, mouse support, fuzzy dialog search, syntax-highlighted diffs, and real-time streaming updates.
