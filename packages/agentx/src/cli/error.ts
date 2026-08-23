import { AccountServiceError, AccountTransportError } from "@/account"
import { ConfigMarkdown } from "@/config/markdown"
import { errorFormat } from "@/util/error"
import { Config } from "../config/config"
import { MCP } from "../mcp"
import { Provider } from "../provider/provider"
import { UI } from "./ui"

export function FormatError(input: unknown) {
  const err = input as any
  if ((MCP.Failed as any).isInstance?.(input) || err?.name === "MCPFailed")
    return `MCP server "${err.data?.name}" failed. Note, agentx does not support MCP authentication yet.`
  if (input instanceof AccountTransportError || input instanceof AccountServiceError) {
    return input.message
  }
  if ((Provider.ModelNotFoundError as any).isInstance?.(input) || err?.name === "ProviderModelNotFoundError") {
    const { providerID, modelID, suggestions } = err.data || {}
    return [
      `Model not found: ${providerID}/${modelID}`,
      ...(Array.isArray(suggestions) && suggestions.length ? ["Did you mean: " + suggestions.join(", ")] : []),
      `Try: \`agentx models\` to list available models`,
      `Or check your config (agentx.json) provider/model names`,
    ].join("\n")
  }
  if ((Provider.InitError as any).isInstance?.(input) || err?.name === "ProviderInitError") {
    return `Failed to initialize provider "${err.data?.providerID}". Check credentials and configuration.`
  }
  if ((Config.JsonError as any).isInstance?.(input) || err?.name === "ConfigJsonError") {
    return (
      `Config file at ${err.data?.path} is not valid JSON(C)` + (err.data?.message ? `: ${err.data.message}` : "")
    )
  }
  if ((Config.ConfigDirectoryTypoError as any).isInstance?.(input) || err?.name === "ConfigDirectoryTypoError") {
    return `Directory "${err.data?.dir}" in ${err.data?.path} is not valid. Rename the directory to "${err.data?.suggestion}" or remove it. This is a common typo.`
  }
  if ((ConfigMarkdown.FrontmatterError as any).isInstance?.(input) || err?.name === "ConfigMarkdownFrontmatterError") {
    return err.data?.message
  }
  if ((Config.InvalidError as any).isInstance?.(input) || err?.name === "ConfigInvalidError")
    return [
      `Configuration is invalid${err.data?.path && err.data?.path !== "config" ? ` at ${err.data?.path}` : ""}` +
        (err.data?.message ? `: ${err.data?.message}` : ""),
      ...(err.data?.issues?.map((issue: any) => "↳ " + issue.message + " " + (issue.path ? issue.path.join(".") : "")) ?? []),
    ].join("\n")

  if ((UI.CancelledError as any).isInstance?.(input) || err?.name === "UICancelledError") return ""
}

export function FormatUnknownError(input: unknown): string {
  return errorFormat(input)
}
