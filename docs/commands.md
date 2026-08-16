# CLI Commands Reference

Complete reference for all commands and options available in AgentX.

---

## 💻 Primary Commands

### `agentx`
Launch the interactive Full-Screen Terminal User Interface (TUI).
```bash
agentx [project-path]
```
- Options:
  - `-m, --model <provider/model>`: Specify model directly (e.g. `openai/gpt-4o`, `ollama/llama3.1`)
  - `-c, --continue`: Continue the most recent session in this workspace
  - `-s, --session <id>`: Resume a specific session by ID
  - `--mini`: Run in minimal non-fullscreen inline mode
  - `--auto`: Automatically approve tool permissions

---

### `agentx run`
Execute a non-interactive build command directly from your terminal or CI/CD script.
```bash
agentx run "Build a personal portfolio site with Astro and TailwindCSS"
```

---

### `agentx providers` (Alias: `agentx auth`)
Manage AI provider connections and credentials.
```bash
agentx providers
```
Opens interactive provider selection:
- Cloud Providers (OpenAI, Anthropic, Gemini, DeepSeek, GitHub Copilot, Groq, Mistral, OpenRouter)
- Local Providers (Ollama, LM Studio, Jan, GPT4All, Llama.cpp, LocalAI)

---

### `agentx mcp`
Manage Model Context Protocol (MCP) servers and tool integrations.
```bash
agentx mcp
```
List, enable, disable, and test configured MCP servers.

---

### `agentx web`
Start the AgentX backend server and automatically open the modern browser-based Web UI.
```bash
agentx web --port 3000
```

---

### `agentx upgrade`
Check the NPM registry for the newest release and perform a real-time background upgrade.
```bash
agentx upgrade
```

---

### `agentx uninstall`
Completely remove AgentX and its global binaries from your machine.
```bash
agentx uninstall
```
