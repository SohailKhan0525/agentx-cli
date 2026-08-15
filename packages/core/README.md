# @agentx-cli/core

> Core business logic, runtime orchestration, file operations, hardware profiling, and service connectors for AgentX.

## Overview

`@agentx-cli/core` provides the foundational abstractions for the AgentX autonomous website builder:
- **Hardware Profiling** — Real-time CPU, RAM, GPU, and VRAM detection across macOS (Apple Silicon / Metal), Windows (NVIDIA CUDA / PowerShell WMI), and Linux.
- **Provider Adapters** — Unified connections for GitHub Copilot, OpenAI, Google Gemini, Anthropic Claude, and Local Models (Ollama, LM Studio, Jan, GPT4All, llama.cpp, LocalAI).
- **Service Detectors** — Parallel probe for active local LLM instances with low-latency healthchecks.
- **File System Utilities** — Robust workspace manipulation, project scaffolding, and AST code transformation.

## Installation

```bash
bun add @agentx-cli/core
```

## License

MIT © 2026 Sohail Khan
