import { AnthropicPlugin } from "./provider/anthropic"
import { DynamicProviderPlugin } from "./provider/dynamic"
import { GithubCopilotPlugin } from "./provider/github-copilot"
import { GooglePlugin } from "./provider/google"
import { OpenAIPlugin } from "./provider/openai"
import { OpenAICompatiblePlugin } from "./provider/openai-compatible"
import { AgentXPlugin } from "./provider/agentx"
import { LocalModelsPlugin } from "./provider/local-models"
import type { PluginInternal } from "./internal"
import type { Scope } from "effect"

export const ProviderPlugins: PluginInternal.Plugin<PluginInternal.Requirements | Scope.Scope>[] = [
  AnthropicPlugin,
  GithubCopilotPlugin,
  GooglePlugin,
  AgentXPlugin,
  OpenAICompatiblePlugin,
  OpenAIPlugin,
  LocalModelsPlugin,
  DynamicProviderPlugin,
]

