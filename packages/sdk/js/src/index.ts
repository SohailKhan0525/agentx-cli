export * from "./client.js"
export * from "./server.js"

import { createAgentXClient } from "./client.js"
import { createAgentXServer } from "./server.js"
import type { ServerOptions } from "./server.js"

export async function createAgentX(options?: ServerOptions) {
  const server = await createAgentXServer({
    ...options,
  })

  const client = createAgentXClient({
    baseUrl: server.url,
  })

  return {
    client,
    server,
  }
}
