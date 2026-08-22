export * from "./client.js"
export * from "./server.js"

import { createAgentxClient } from "./client.js"
import { createAgentxServer } from "./server.js"
import type { ServerOptions } from "./server.js"

export async function createAgentx(options?: ServerOptions) {
  const server = await createAgentxServer({
    ...options,
  })

  const client = createAgentxClient({
    baseUrl: server.url,
  })

  return {
    client,
    server,
  }
}
