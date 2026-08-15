# Contributing to AgentX

Thank you for contributing to AgentX! We welcome issues, documentation improvements, bug fixes, and feature contributions.

---

## Code of Conduct

Please be respectful, constructive, and collaborative. We aim to build a welcoming, high-caliber open-source community for developers around the world.

---

## Monorepo Architecture

AgentX is organized as a high-performance monorepo managed with [Bun](https://bun.sh) and [Turborepo](https://turbo.build):

- **[`packages/agentx-cli`](packages/agentx-cli)**: The core terminal executable binary and interactive CLI.
- **[`packages/core`](packages/core)**: Core agent logic, tool runtime, file manipulation, and process spawning.
- **[`packages/tui`](packages/tui)**: Terminal UI renderer powered by OpenTUI and Solid.js.
- **[`packages/llm`](packages/llm)**: Model routing, streaming clients, and protocol handlers for AI providers.
- **[`packages/schema`](packages/schema)**: Shared types, effect schemas, and data structures.
- **[`packages/sdk/js`](packages/sdk/js)**: Programmatic JavaScript / TypeScript SDK.
- **[`packages/plugin`](packages/plugin)**: Extensibility interfaces and plugin lifecycle hooks.

---

## Local Development Setup

### Prerequisites

- **[Bun](https://bun.sh)** `v1.2+`
- **[Node.js](https://nodejs.org)** `v22+`
- **[Git](https://git-scm.com)**

### Setup Steps

1. **Fork and clone the repository:**
   ```bash
   git clone https://github.com/YOUR_USERNAME/agentx-cli.git
   cd agentx-cli
   ```

2. **Install all dependencies:**
   ```bash
   bun install
   ```

3. **Start local development:**
   ```bash
   bun run dev
   ```

---

## Code Quality & Testing

Before submitting a pull request, verify that your changes pass all local verification checks:

1. **Linting:**
   ```bash
   bun run lint
   ```
   Ensures all TypeScript files comply with oxlint and formatting standards.

2. **Typecheck:**
   ```bash
   bun run typecheck
   ```
   Validates type safety across all monorepo packages.

3. **Standalone Binary Build & Smoke Test:**
   ```bash
   bun run --cwd packages/agentx-cli script/build.ts --single
   ```
   Compiles the local binary and executes `--version` smoke test.

---

## Contribution Workflow

1. Create a feature branch from `main`:
   ```bash
   git checkout -b feat/my-new-feature
   ```
2. Make your focused changes and write corresponding tests where applicable.
3. Follow conventional commits for clear history:
   - `feat:` for new capabilities
   - `fix:` for bug fixes
   - `docs:` for documentation updates
   - `chore:` for build / dependency changes
4. Push your branch and open a pull request on [GitHub](https://github.com/SohailKhan0525/agentx-cli/pulls).

---

## Contributing UI Components

AgentX maintains a curated component registry powered by ReactBits and 21st.dev components. To contribute high-quality UI blocks:
1. Ensure the component uses modern TailwindCSS or Vanilla CSS styling.
2. Include complete, self-contained TypeScript / TSX implementation without external unresolved dependencies.
3. Test responsiveness across mobile, tablet, and desktop viewports.

---

## Questions & Community

- **Discussions**: [GitHub Discussions](https://github.com/SohailKhan0525/agentx-cli/discussions)
- **Issues**: [GitHub Issues](https://github.com/SohailKhan0525/agentx-cli/issues)
