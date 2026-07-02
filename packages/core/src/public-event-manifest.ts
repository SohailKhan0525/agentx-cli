export * as PublicEventManifest from "./public-event-manifest"

import { Event } from "@agentx-cli/schema/event"
import { EventManifest } from "@agentx-cli/schema/event-manifest"

export const Definitions = EventManifest.ServerDefinitions
export const Latest = Event.latest(Definitions)
