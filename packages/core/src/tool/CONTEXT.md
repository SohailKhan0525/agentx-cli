# Context Management in AgentX

AgentX utilizes a single unified context mechanism to support its 9-phase website building workflow. 

Since AgentX does not operate like a general-purpose coding assistant or maintain specialized read-only analysis agents, context is focused entirely on the progression of the active project.

## How it works

1.  **Project Initialization**: When AgentX is invoked, it anchors its context around the current directory (`agentx`).
2.  **Phase Tracking**: It tracks the current phase (1 through 9) internally.
3.  **Stateful Generation**: The context is continuously updated with the credentials gathered and the architecture agreed upon during Phase 5 (Confirm Plan).
4.  **No Context Switching**: Because AgentX is singularly focused, there is no subagent delegation or context sharing required.

For modifications to how the agent handles context, refer to the core logic within `packages/core/src/plugin/agent.ts`.
