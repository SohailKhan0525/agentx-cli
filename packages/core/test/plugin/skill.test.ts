import { describe, expect } from "bun:test"
import { Effect, Layer } from "effect"
import { AgentV2 } from "@agentx-cli/core/agent"
import { FSUtil } from "@agentx-cli/core/fs-util"
import { SkillPlugin } from "@agentx-cli/core/plugin/skill"
import { SkillV2 } from "@agentx-cli/core/skill"
import { SkillDiscovery } from "@agentx-cli/core/skill/discovery"
import { testEffect } from "../lib/effect"

const it = testEffect(
  SkillV2.layer.pipe(
    Layer.provide(FSUtil.defaultLayer),
    Layer.provide(SkillDiscovery.defaultLayer),
    Layer.provideMerge(AgentV2.locationLayer),
  ),
)

describe("SkillPlugin.Plugin", () => {
  it.effect("registers the built-in customize-agentx skill", () =>
    Effect.gen(function* () {
      const skill = yield* SkillV2.Service
      yield* SkillPlugin.Plugin.effect.pipe(Effect.provideService(SkillV2.Service, skill))

      expect(yield* skill.list()).toContainEqual(
        expect.objectContaining({
          name: "customize-agentx",
          description: expect.stringContaining("agentx's own configuration"),
        }),
      )
    }),
  )
})
