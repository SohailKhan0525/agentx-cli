/// <reference path="../markdown.d.ts" />

export * as SkillPlugin from "./skill"

import { Effect } from "effect"
import { PluginV2 } from "../plugin"
import { AbsolutePath } from "../schema"
import { SkillV2 } from "../skill"
import customizeAgentXContent from "./skill/customize-agentx.md" with { type: "text" }

export const CustomizeAgentXContent = customizeAgentXContent

export const Plugin = PluginV2.define({
  id: PluginV2.ID.make("skill"),
  effect: Effect.gen(function* () {
    const skill = yield* SkillV2.Service
    const transform = yield* skill.transform()

    yield* transform((editor) => {
      editor.source(
        new SkillV2.EmbeddedSource({
          type: "embedded",
          skill: new SkillV2.Info({
            name: "customize-agentx",
            description:
              "Use ONLY when the user is editing or creating agentx's own configuration: agentx.json, agentx.jsonc, files under .agentx/, or files under ~/.config/agentx/. Also use when creating or fixing agentx agents, subagents, skills, plugins, MCP servers, or permission rules. Do not use for the user's own application code, or for any project that is not configuring agentx itself.",
            location: AbsolutePath.make("/builtin/customize-agentx.md"),
            content: CustomizeAgentXContent,
          }),
        }),
      )
    })
  }),
})
