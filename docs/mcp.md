# Model Context Protocol (MCP) Integration

AgentX includes first-class support for the open [Model Context Protocol (MCP)](https://modelcontextprotocol.io), allowing the agent to interact with external databases, APIs, file systems, and tools.

---

## 🔌 Configuring MCP Servers

Add an `mcp` object to your workspace or global `agentx.json` configuration file:

```json
{
  "$schema": "https://agentx.sh/schema.json",
  "mcp": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "./data"]
    },
    "postgres": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-postgres", "postgresql://localhost/mydb"]
    },
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_..."
      }
    }
  }
}
```

---

## 💻 Managing MCP Servers in the TUI

1. Launch AgentX:
   ```bash
   agentx
   ```
2. Type `/mcp` or run command:
   ```bash
   agentx mcp
   ```
3. The interactive dialog lists all configured MCP servers, their live connection status (`✓ Enabled`, `○ Disabled`, `failed`), and allows toggling them dynamically.
