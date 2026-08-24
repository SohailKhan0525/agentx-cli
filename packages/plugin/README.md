# @agentx-cli/plugin

Plugin architecture and lifecycle hooks for extending AgentX.

[![License: MIT](https://img.shields.io/badge/License-MIT-000000?style=for-the-badge&logo=opensourceinitiative&labelColor=18181b)](../../LICENSE)

## Overview

The `@agentx-cli/plugin` package enables developers to create custom plugins, add custom tools to the AgentX loop, intercept model calls, and hook into lifecycle events.

## Creating a Plugin

```typescript
export interface AgentXPlugin {
  name: string;
  version: string;
  onInit?(context: PluginContext): Promise<void>;
  onToolExecute?(tool: string, args: Record<string, any>): Promise<void>;
  onDestroy?(): Promise<void>;
}
```
