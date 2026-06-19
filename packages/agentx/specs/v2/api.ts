// @ts-nocheck

import { AgentX } from "@agentx-cli/core"
import { ReadTool } from "@agentx-cli/core/tools"

const agentx = AgentX.make({})

agentx.tool.add(ReadTool)

agentx.tool.add({
  name: "bash",
  schema: {
    type: "object",
    properties: {
      command: {
        type: "string",
        description: "The command to run.",
      },
    },
    required: ["command"],
  },
  execute(input, ctx) {},
})

agentx.auth.add({
  provider: "openai",
  type: "api",
  value: process.env.OPENAI_API_KEY,
})

agentx.agent.add({
  name: "build",
  permissions: [],
  model: {
    id: "gpt-5-5",
    provider: "openai",
    variant: "xhigh",
  },
})

const sessionID = await agentx.session.create({
  agent: "build",
})

agentx.subscribe((event) => {
  console.log(event)
})

await agentx.session.prompt({
  sessionID,
  text: "hey what is up",
})

await agentx.session.prompt({
  sessionID,
  text: "what is up with this",
  files: [
    {
      mime: "image/png",
      uri: "data:image/png;base64,xxxx",
    },
  ],
})

await agentx.session.wait()

console.log(await agentx.session.messages(sessionID))
