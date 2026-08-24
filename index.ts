/**
 * @file AgentX CLI — The autonomous AI agent that builds complete, production-ready websites from your terminal.
 * @module @agent-qofeno/agentx-cli
 */

/**
 * Configuration options for executing AgentX programmatically.
 */
export interface AgentXOptions {
  /** The model identifier to use (e.g., 'gpt-4o', 'claude-3-5-sonnet', 'gemini-2.0-flash', 'ollama/qwen2.5-coder:7b') */
  model?: string;
  /** Working directory where the website project will be created or modified */
  cwd?: string;
  /** Optional AI provider name */
  provider?: 'openai' | 'anthropic' | 'google' | 'copilot' | 'ollama' | 'lmstudio';
  /** Whether to run in verbose debug mode */
  verbose?: boolean;
}

/**
 * Main entry point function for AgentX CLI.
 * Initializes the terminal UI and starts the website builder agent loop.
 *
 * @param args - CLI arguments array or configuration options object.
 * @returns A promise that resolves when the agent process completes.
 *
 * @example
 * ```ts
 * import { run } from '@agent-qofeno/agentx-cli';
 *
 * await run(['--help']);
 * ```
 */
export async function run(args?: string[] | AgentXOptions): Promise<void> {
  const runner = await import('./dist/index.js');
  if (typeof runner.run === 'function') {
    return runner.run(args);
  }
}

/**
 * Returns the current version of the AgentX CLI package.
 *
 * @returns The semantic version string (e.g., '2.0.6').
 *
 * @example
 * ```ts
 * import { getVersion } from '@agent-qofeno/agentx-cli';
 *
 * console.log(getVersion()); // '2.0.6'
 * ```
 */
export function getVersion(): string {
  return '2.0.6';
}

/**
 * Default export representing the AgentX runner.
 */
export default {
  run,
  getVersion,
};
