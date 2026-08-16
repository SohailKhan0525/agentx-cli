# Configuration & Customization

AgentX can be tailored via local and global configuration files, environment variables, and theme definitions.

---

## ⚙️ Configuration Files

AgentX looks for configuration in the following locations:
1. **Workspace Config**: `./agentx.json` (or `.agentx/config.json`)
2. **User Global Config**:
   - Windows: `%USERPROFILE%\.agentx\config.json`
   - macOS / Linux: `~/.config/agentx/config.json` or `~/.agentx/config.json`

---

## 📄 Example `agentx.json`

```json
{
  "$schema": "https://agentx.sh/schema.json",
  "theme": "dark",
  "model": "openai/gpt-4o",
  "autoApprove": false,
  "telemetry": false,
  "env": {
    "NODE_ENV": "development"
  },
  "mcp": {}
}
```

---

## ⌨️ TUI Keyboard Shortcuts

| Shortcut | Action |
|:---|:---|
| `Ctrl+P` / `/connect` | Open AI Providers Dialog |
| `Ctrl+M` / `/models` | Switch Active AI Model |
| `Ctrl+N` / `/new` | Start a Fresh Session |
| `Ctrl+S` / `/sessions` | Switch / Browse Sessions |
| `Ctrl+C` | Cancel current generation / task |
| `Ctrl+D` / `exit` | Exit AgentX |
| `F1` / `/help` | Open Keyboard Help Dialog |
| `/docs` | Open Official Documentation in Browser |
