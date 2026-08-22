#!/usr/bin/env node

import { fileURLToPath } from "node:url"
import { execSync } from "node:child_process"
import path from "node:path"
import fs from "node:fs/promises"

const dir = fileURLToPath(new URL("..", import.meta.url))
process.chdir(dir)

try {
  const { createClient } = await import("@hey-api/openapi-ts")
  await createClient({
    input: "./openapi.json",
    output: {
      path: "./src/v2/gen",
      tsConfigPath: path.join(dir, "tsconfig.json"),
      clean: true,
    },
    plugins: [
      {
        name: "@hey-api/typescript",
        exportFromIndex: false,
      },
      {
        name: "@hey-api/sdk",
        instance: "AgentxClient",
        exportFromIndex: false,
        auth: false,
        paramsStructure: "flat",
      },
      {
        name: "@hey-api/client-fetch",
        exportFromIndex: false,
        baseUrl: "http://localhost:4096",
      },
    ],
  })
} catch (e) {
  // If openapi-ts is not installed, continue
}

try {
  execSync("npx tsc", { stdio: "inherit" })
} catch {}
