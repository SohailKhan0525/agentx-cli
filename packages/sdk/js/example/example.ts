import { createAgentxClient, createAgentxServer } from "@agentx-cli/sdk"
import { pathToFileURL } from "node:url"
import fs from "node:fs/promises"

const server = await createAgentxServer()
const client = createAgentxClient({ baseUrl: server.url })

const files = await fs.readdir("packages/core").catch(() => [])
const input = files.filter(f => f.endsWith(".ts")).map(f => `packages/core/${f}`)

const tasks: Promise<void>[] = []
for (const file of input) {
  console.log("processing", file)
  const session = await client.session.create()
  tasks.push(
    client.session.prompt({
      path: { id: session.data.id },
      body: {
        parts: [
          {
            type: "file",
            mime: "text/plain",
            url: pathToFileURL(file).href,
          },
          {
            type: "text",
            text: `Write tests for every public function in this file.`,
          },
        ],
      },
    }),
  )
  console.log("done", file)
}
