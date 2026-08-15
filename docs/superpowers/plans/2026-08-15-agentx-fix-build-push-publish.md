# AgentX v1.20.59 — Fix, Build, Push, Publish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the repository into AgentX v1.20.59: clean all legacy references and unwanted packages, consolidate providers to exactly 5 (GitHub Copilot, OpenAI, Google, Anthropic, Local Models), fully implement local model hardware detection and recommendation engine with Ollama auto-installer, install the AgentX website builder system prompt, strip ASCII art, retain only the approved 16 commands, fix all typecheck and build errors, update package configs, commit & push to GitHub, and publish to NPM under `@agent-qofeno/agentx-cli`.

**Architecture:** Antigravity/Bun monorepo using Turborepo with core libraries (`packages/agentx-cli`, `packages/core`, `packages/llm`, `packages/tui`, `packages/ui`, `packages/schema`, `packages/protocol`, `packages/plugin`, `packages/sdk`, `packages/effect-drizzle-sqlite`, `packages/effect-sqlite-node`, `packages/http-recorder`). The UI is powered by OpenTUI with Solid.js; local models run over `@ai-sdk/openai-compatible` with local daemon detection and platform-specific hardware profiling (WMI/nvidia-smi/system_profiler/rocm-smi).

**Tech Stack:** TypeScript 5.8, Bun 1.3, OpenTUI, Solid.js, Vercel AI SDK 6 (`ai`, `@ai-sdk/openai`, `@ai-sdk/google`, `@ai-sdk/anthropic`, `@ai-sdk/openai-compatible`), Effect-TS.

---

## Global Constraints

- Package Name: `@agent-qofeno/agentx-cli`
- Published Version: `1.20.59`
- GitHub Repo: `https://github.com/SohailKhan0525/agentx-cli`
- Zero remaining references to `agentx`, `SohailKhan0525`, `github.com/SohailKhan0525/agentx-cli` (case-insensitive where applicable)
- Zero ASCII art anywhere in the codebase
- Exactly 5 AI providers: GitHub Copilot, OpenAI, Google Gemini, Anthropic Claude, Local Models
- AgentX has one mode: building production-ready websites. No plan agent or general subagent.
- Error reporting to GitHub issues with OSC 8 terminal hyperlink fallback.
- Absolute Rule: Zero placeholders, zero TODOs, zero mock data, zero empty functions.

---

## Risk Assessment & Mitigation

1. **Provider Pruning Breaking Type Dependencies:**
   - *Risk:* Removing 15+ `@ai-sdk/*` providers may leave dangling imports in `@agentx-cli/core`, `@agentx-cli/llm`, and `packages/agentx-cli`.
   - *Mitigation:* Clean imports systematically across `packages/agentx-cli/src/provider/provider.ts`, `packages/agentx-cli/src/plugin/index.ts`, `packages/core/src/aisdk.ts`, and run `bun run typecheck` iteratively.
2. **Local Model Engine Cross-Platform Hardware Detection:**
   - *Risk:* `nvidia-smi` or `system_profiler` may throw or block on non-standard setups.
   - *Mitigation:* Wrap all child process calls with safe timeout handling and fallback to standard OS memory / CPU metrics (`os.totalmem()`, `os.freemem()`, `os.cpus()`).
3. **Workspace Package Removals (`containers`, `stats`, `cli`, `identity`):**
   - *Risk:* Turborepo or root `package.json` referencing deleted workspaces.
   - *Mitigation:* Synchronously update root `package.json` `workspaces` array and run `bun install`.

---

## Task Decomposition

### Task 1: Deep Workspace Cleaning (Junk Files, Unused Packages, Root Configs)

**Files:**
- Delete: `msg.txt`, `out.txt`, `push_log.txt`, `push_out.txt`, `.turbo/cache`
- Delete: `packages/containers/`, `packages/stats/`, `packages/cli/`, `packages/identity/`
- Modify: `package.json`
- Modify: `.gitignore`
- Modify: `.npmignore`

**Interfaces:**
- Consumes: Root workspace configuration
- Produces: Clean monorepo workspace containing only active packages (`agentx-cli`, `core`, `llm`, `tui`, `ui`, `schema`, `protocol`, `plugin`, `sdk`, `effect-drizzle-sqlite`, `effect-sqlite-node`, `http-recorder`, `script`)

- [ ] **Step 1: Write and run cleanup script for root junk and unused packages**
- [ ] **Step 2: Update root `package.json` workspaces**
- [ ] **Step 3: Update `.gitignore` and `.npmignore`**
- [ ] **Step 4: Verify workspace cleanliness with `bun install`**

---

### Task 2: Global agentx / SohailKhan0525 Reference Replacement

**Files:**
- Modify: All files across `packages/`, `.github/`, `script/`, root configs with legacy references.

**Interfaces:**
- Consumes: Node script with string & regex replacement table
- Produces: Zero occurrences of `agentx`, `SohailKhan0525`, `github.com/SohailKhan0525/agentx-cli`, `AgentX`.

- [ ] **Step 1: Write and execute cross-platform `replace-refs.mjs` script**
- [ ] **Step 2: Grep verify zero remaining references**

---

### Task 3: Strip All ASCII Art

**Files:**
- Modify: `packages/agentx-cli/src/cli/ui.ts`
- Modify: `packages/tui/src/util/presentation.ts`
- Modify: `packages/tui/src/logo.ts`
- Modify: `packages/agentx-cli/src/cli/cmd/stats.ts`

**Interfaces:**
- Consumes: Clean text presentation without banners or glyph blocks
- Produces: Clean terminal presentation for AgentX

- [ ] **Step 1: Remove wordmark and ASCII logo definitions**
- [ ] **Step 2: Verify zero ASCII art matches**

---

### Task 4: Command Registry Pruning & Single Website Builder Agent

**Files:**
- Modify: `packages/agentx-cli/src/agent/agent.ts`
- Modify: `packages/tui/src/config/keybind.ts`
- Modify: `packages/tui/src/app.tsx`
- Modify: `packages/agentx-cli/src/cli/cmd/run/footer.command.tsx`
- Modify: `packages/agentx-cli/src/command/index.ts`

**Interfaces:**
- Consumes: Approved 16 commands list
- Produces: Streamlined command palette with ONLY the 16 approved commands; remove plan agent and general subagent.

- [ ] **Step 1: Update Agent definitions for single website builder brain**
- [ ] **Step 2: Prune command palette & keybinds in TUI**

---

### Task 5: AI Providers Consolidation (Keep 5, Remove All Others)

**Files:**
- Modify: `packages/agentx-cli/src/provider/provider.ts`
- Modify: `packages/agentx-cli/src/cli/cmd/providers.ts`
- Modify: `packages/agentx-cli/src/plugin/index.ts`
- Modify: `packages/core/src/aisdk.ts`
- Modify: `packages/core/src/catalog.ts`
- Modify: `packages/tui/src/component/dialog-provider.tsx`
- Modify: `packages/agentx-cli/package.json`
- Modify: `packages/core/package.json`

**Interfaces:**
- Consumes: 5 providers (GitHub Copilot, OpenAI, Google Gemini, Anthropic Claude, Local Models)
- Produces: Clean provider engine without unused AI SDK packages.

- [ ] **Step 1: Prune package.json dependencies**
- [ ] **Step 2: Update provider registry in `provider.ts` and `aisdk.ts`**
- [ ] **Step 3: Update `dialog-provider.tsx` and `providers.ts` CLI login**

---

### Task 6: Full Local Model Engine Implementation

**Files:**
- Modify/Create: `packages/core/src/plugin/provider/local-models.ts`
- Modify: `packages/llm/src/providers/openai-compatible.ts`
- Modify: `packages/agentx-cli/src/provider/provider.ts`

**Interfaces:**
- Consumes: Real hardware metrics & localhost daemon responses
- Produces:
  - Hardware profiler (macOS / Windows / Linux, CPU, RAM, disk)
  - Parallel 3s timeout detector for 6 local providers
  - Real coding model catalog (Fast, Balanced, Quality tiers)
  - Resource requirement evaluator & tier recommendation engine
  - Ollama auto-pull progress runner

- [ ] **Step 1: Implement hardware and daemon detector**
- [ ] **Step 2: Implement model catalog and recommendation scoring**
- [ ] **Step 3: Implement Ollama auto-pull streamer**

---

### Task 7: GitHub Issues Error Reporting

**Files:**
- Modify: `packages/tui/src/util/error.ts`
- Modify: `packages/agentx-cli/src/cli/ui.ts`

**Interfaces:**
- Consumes: Uncaught error formatting
- Produces: Appended issue link with OSC 8 hyperlink escape and plain URL fallback.

- [ ] **Step 1: Update `error.ts` and `errorFormat`**

---

### Task 8: AgentX Website Builder Brain System Prompt

**Files:**
- Modify: `packages/agentx-cli/src/session/prompt/default.txt`
- Modify: `packages/agentx-cli/src/session/system.ts`

**Interfaces:**
- Consumes: Step 3D verbatim system prompt
- Produces: Production website builder instructions for all LLM calls

- [ ] **Step 1: Replace `default.txt` with exact AgentX website builder prompt**

---

### Task 9: Update Documentation Markdown Files

**Files:**
- Modify: `README.md`
- Modify: `CONTRIBUTING.md`
- Modify: `SECURITY.md`
- Modify: `AGENTS.md`
- Modify: `CONTEXT.md`

- [ ] **Step 1: Replace README.md with the exact template provided**
- [ ] **Step 2: Update CONTRIBUTING.md, SECURITY.md, AGENTS.md, CONTEXT.md for AgentX**

---

### Task 10: Update Package Metadata & GitHub Actions Workflows

**Files:**
- Modify: `packages/agentx-cli/package.json`
- Modify: `package.json`
- Modify: `.github/workflows/publish.yml`

**Interfaces:**
- Consumes: Target version `1.20.59`, name `@agent-qofeno/agentx-cli`
- Produces: Valid publish configuration and clean CI/CD workflow

- [ ] **Step 1: Set package.json name to `@agent-qofeno/agentx-cli` and version to `1.20.59`**
- [ ] **Step 2: Update .github workflows for public npm publish and tests**

---

### Task 11: Build, TypeScript Verification, CLI Smoke Test & Verification Gate

**Files:**
- All packages across monorepo

- [ ] **Step 1: Run `bun install`**
- [ ] **Step 2: Run `bun run typecheck` and resolve all TypeScript errors**
- [ ] **Step 3: Run `bun run build` in packages/agentx-cli**
- [ ] **Step 4: Smoke test `agentx --version` and CLI startup**
- [ ] **Step 5: Verify all items against Step 9 verification checklist**

---

### Task 12: Git Commit, Push & NPM Publish Check

**Files:**
- Git repository

- [ ] **Step 1: Stage all changes and commit**
- [ ] **Step 2: Push to `origin main`**
- [ ] **Step 3: Check NPM status with `npm view @agent-qofeno/agentx-cli` and test dry-run pack**
- [ ] **Step 4: Attempt publish or provide complete login/publish instructions**
