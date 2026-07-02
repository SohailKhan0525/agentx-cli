import { AgentV2 } from "@agentx-cli/core/agent"
import { AISDK } from "@agentx-cli/core/aisdk"
import { Catalog } from "@agentx-cli/core/catalog"
import { CommandV2 } from "@agentx-cli/core/command"
import { Credential } from "@agentx-cli/core/credential"
import { AppNodeBuilder } from "@agentx-cli/core/effect/app-node-builder"
import { LayerNodePlatform } from "@agentx-cli/core/effect/app-node-platform"
import { LayerNode } from "@agentx-cli/core/effect/layer-node"
import { EventV2 } from "@agentx-cli/core/event"
import { FileSystem } from "@agentx-cli/core/filesystem"
import { FSUtil } from "@agentx-cli/core/fs-util"
import { Integration } from "@agentx-cli/core/integration"
import { Location } from "@agentx-cli/core/location"
import { Npm } from "@agentx-cli/core/npm"
import { PluginV2 } from "@agentx-cli/core/plugin"
import { Reference } from "@agentx-cli/core/reference"
import { SkillV2 } from "@agentx-cli/core/skill"
import { Effect, Layer } from "effect"
import { tempLocationLayer } from "../fixture/location"

const npmLayer = Layer.succeed(
  Npm.Service,
  Npm.Service.of({
    add: () => Effect.succeed({ directory: "", entrypoint: undefined }),
    install: () => Effect.void,
    which: () => Effect.succeed(undefined),
  }),
)

export const PluginTestLayer = AppNodeBuilder.build(
  LayerNode.group([
    FileSystem.node,
    FSUtil.node,
    Location.node,
    Npm.node,
    Credential.node,
    EventV2.node,
    LayerNodePlatform.httpClient,
    PluginV2.node,
    AgentV2.node,
    AISDK.node,
    Catalog.node,
    CommandV2.node,
    Integration.node,
    Reference.node,
    SkillV2.node,
  ]),
  [
    [Location.node, tempLocationLayer],
    [Npm.node, npmLayer],
  ],
)
