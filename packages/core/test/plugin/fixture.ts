import { AgentV2 } from "@agent-qofeno/core/agent"
import { AISDK } from "@agent-qofeno/core/aisdk"
import { Catalog } from "@agent-qofeno/core/catalog"
import { CommandV2 } from "@agent-qofeno/core/command"
import { Credential } from "@agent-qofeno/core/credential"
import { AppNodeBuilder } from "@agent-qofeno/core/effect/app-node-builder"
import { LayerNodePlatform } from "@agent-qofeno/core/effect/app-node-platform"
import { LayerNode } from "@agent-qofeno/core/effect/layer-node"
import { EventV2 } from "@agent-qofeno/core/event"
import { FileSystem } from "@agent-qofeno/core/filesystem"
import { FSUtil } from "@agent-qofeno/core/fs-util"
import { Integration } from "@agent-qofeno/core/integration"
import { Location } from "@agent-qofeno/core/location"
import { Npm } from "@agent-qofeno/core/npm"
import { PluginV2 } from "@agent-qofeno/core/plugin"
import { Reference } from "@agent-qofeno/core/reference"
import { SkillV2 } from "@agent-qofeno/core/skill"
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
