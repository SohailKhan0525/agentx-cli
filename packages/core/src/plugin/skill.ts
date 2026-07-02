/// <reference path="../markdown.d.ts" />

export * as SkillPlugin from "./skill"

import { define } from "./internal"
import { Effect } from "effect"
import { AbsolutePath } from "../schema"
import { SkillV2 } from "../skill"
import customizeAgentXContent from "./skill/customize-agentx.md" with { type: "text" }

export const CustomizeAgentXContent = customizeAgentXContent

export const Plugin = define({
  id: "skill",
  effect: Effect.fn(function* (ctx) {
    yield* ctx.skill.transform((draft) => {
      draft.source(
        SkillV2.EmbeddedSource.make({
          type: "embedded",
          skill: SkillV2.Info.make({
            name: "customize-agentx",
            description:
              "Use ONLY when the user is editing or creating agentx's own configuration: agentx.json, agentx.jsonc, files under .agentx/, or files under ~/.config/agentx/. Also use when creating or fixing agentx agents, subagents, commands, skills, plugins, MCP servers, or permission rules. Do not use for the user's own application code, or for any project that is not configuring agentx itself.",
            location: AbsolutePath.make("/builtin/customize-agentx.md"),
            content: CustomizeAgentXContent,
          }),
        }),
      )
    })
  }),
})
