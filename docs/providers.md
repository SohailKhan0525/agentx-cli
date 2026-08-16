# AI Providers

AgentX is model-agnostic and connects seamlessly to major cloud and commercial AI providers.

---

## ☁️ Supported Cloud Providers

| Provider | Provider ID | Recommended Models | Environment Variable |
|:---|:---|:---|:---|
| **OpenAI** | `openai` | `gpt-4o`, `gpt-4o-mini`, `o1`, `o3-mini` | `OPENAI_API_KEY` |
| **Anthropic** | `anthropic` | `claude-3-7-sonnet`, `claude-3-5-haiku` | `ANTHROPIC_API_KEY` |
| **Google Gemini** | `google` | `gemini-2.5-pro`, `gemini-2.5-flash` | `GEMINI_API_KEY` |
| **DeepSeek** | `deepseek` | `deepseek-chat`, `deepseek-reasoner` | `DEEPSEEK_API_KEY` |
| **GitHub Copilot** | `github-copilot` | `claude-3.5-sonnet`, `gpt-4o`, `o3-mini` | GitHub OAuth Flow |
| **Groq** | `groq` | `llama-3.3-70b-versatile`, `mixtral-8x7b-32768` | `GROQ_API_KEY` |
| **OpenRouter** | `openrouter` | Any routed model | `OPENROUTER_API_KEY` |

---

## 🔑 Authentication Setup

### 1. Interactive TUI
Inside the AgentX TUI:
- Press `Ctrl+P` (or type `/providers` or `/connect`)
- Select your provider from the list
- Enter your API Key or authorize via OAuth browser flow

### 2. Environment Variables
You can export API keys in your shell (`.bashrc`, `.zshrc`, PowerShell `$PROFILE`):
```bash
export OPENAI_API_KEY="sk-..."
export ANTHROPIC_API_KEY="sk-ant-..."
export GEMINI_API_KEY="AIzaSy..."
```
AgentX automatically detects and activates configured providers on startup.
