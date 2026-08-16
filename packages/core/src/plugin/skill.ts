/// <reference path="../markdown.d.ts" />

export * as SkillPlugin from "./skill"

import { define } from "./internal"
import { Effect } from "effect"
import { AbsolutePath } from "../schema"
import { SkillV2 } from "../skill"
import customizeAgentXContent from "./skill/customize-agentx.md" with { type: "text" }
import uiUxProMaxContent from "./skill/ui-ux-pro-max.md" with { type: "text" }
import frontendUiUxWizardContent from "./skill/frontend-ui-ux-wizard.md" with { type: "text" }

export const CustomizeAgentXContent = customizeAgentXContent
export const UiUxProMaxContent = uiUxProMaxContent
export const FrontendUiUxWizardContent = frontendUiUxWizardContent

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
      draft.source(
        SkillV2.EmbeddedSource.make({
          type: "embedded",
          skill: SkillV2.Info.make({
            name: "ui-ux-pro-max",
            description:
              "Master UI/UX design intelligence for creating stunning, production-ready, accessible, and high-converting modern web applications and websites. Use whenever designing, building, or refining user interfaces, websites, web apps, components, themes, layouts, or user experiences.",
            location: AbsolutePath.make("/builtin/ui-ux-pro-max.md"),
            content: UiUxProMaxContent,
          }),
        }),
      )
      draft.source(
        SkillV2.EmbeddedSource.make({
          type: "embedded",
          skill: SkillV2.Info.make({
            name: "frontend-ui-ux-wizard",
            description:
              "Designs and builds real, production-ready websites — landing pages, marketing sites, web apps, redesigns — with an intentional, non-templated visual identity, then checks the build for errors, pushes to GitHub, and deploys it live.",
            location: AbsolutePath.make("/builtin/frontend-ui-ux-wizard.md"),
            content: FrontendUiUxWizardContent,
          }),
        }),
      )
    })
  }),
})
