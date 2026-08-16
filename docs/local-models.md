# Local AI Models & Hardware Acceleration

AgentX includes built-in auto-discovery and management for local LLM engines, allowing you to build websites completely offline with zero API costs.

---

## 🖥️ Supported Local Backends

| Engine | Default Endpoint | Auto-Discovery | Supported OS |
|:---|:---|:---|:---|
| **Ollama** | `http://127.0.0.1:11434` | ✅ Automatic | Windows, macOS, Linux |
| **LM Studio** | `http://127.0.0.1:1234/v1` | ✅ Automatic | Windows, macOS, Linux |
| **Jan** | `http://127.0.0.1:1337/v1` | ✅ Automatic | Windows, macOS, Linux |
| **GPT4All** | `http://127.0.0.1:4891/v1` | ✅ Automatic | Windows, macOS, Linux |
| **Llama.cpp** | `http://127.0.0.1:8080/v1` | ✅ Automatic | Windows, macOS, Linux |
| **LocalAI** | `http://127.0.0.1:8080/v1` | ✅ Automatic | Windows, macOS, Linux |

---

## ⚡ Hardware Acceleration Detection

AgentX automatically inspects your machine hardware to benchmark and recommend the highest quality local models:

- **Apple Silicon**: Metal GPU acceleration with unified memory
- **NVIDIA GPUs**: CUDA hardware compute detection & VRAM estimation
- **AMD GPUs**: ROCm runtime detection
- **Intel / CPU**: AVX2 & AVX-512 instruction set detection

---

## 🚀 Quickstart with Ollama

1. Start Ollama on your machine:
   ```bash
   ollama serve
   ```
2. Pull a recommended coding model:
   ```bash
   ollama pull qwen2.5-coder:7b
   # or for 16GB+ RAM:
   ollama pull qwen2.5-coder:14b
   # or for 32GB+ RAM:
   ollama pull qwen2.5-coder:32b
   ```
3. Open AgentX:
   ```bash
   agentx
   ```
4. Open the Provider dialog (`Ctrl+P`). Ollama will be detected automatically under **Local Models**. Select it to immediately start building with your local model!
