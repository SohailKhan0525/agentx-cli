import { AnthropicPlugin } from "./provider/anthropic"
import { DynamicProviderPlugin } from "./provider/dynamic"
import { GooglePlugin } from "./provider/google"
import { OpenAIPlugin } from "./provider/openai"
import { AgentXPlugin } from "./provider/agentx"

export const ProviderPlugins = [
  AnthropicPlugin,
  GooglePlugin,
  AgentXPlugin,
  OpenAIPlugin,
  DynamicProviderPlugin,
]
