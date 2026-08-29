export * as PublicEventManifest from "./public-event-manifest"

import { Event } from "@agent-qofeno/schema/event"
import { EventManifest } from "@agent-qofeno/schema/event-manifest"

export const Definitions = EventManifest.ServerDefinitions
export const Latest = Event.latest(Definitions)
