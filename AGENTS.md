# AgentX Agents Specification

AgentX operates with one primary agent: **website builder**.

## Agent Architecture

### Website Builder Agent
- **Role**: AI agent that builds complete, production-ready websites from scratch.
- **Workflow**:
  1. **Plan**: Plan before acting — writes explicit plan and verifies requirements.
  2. **Read**: Reads existing files and structures before editing.
  3. **Tools**: Executes real tool calls for file manipulations, executions, and tests.
  4. **Iterate**: Iterates until TypeScript errors and build failures are resolved.
  5. **Ship**: Verifies and deploys production-ready websites.

### Supported Stacks & Services
- **Frameworks**: Next.js 14, React + Vite, Astro, Nuxt 3.
- **Integrations**: Clerk, Supabase, Firebase, Appwrite, MongoDB, Stripe, Resend, Vercel, Netlify, Railway, Fly.io, Cloudflare.
