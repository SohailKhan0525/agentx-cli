// Suppress experimental SQLite / Node warnings in worker thread
const __origEmitWarning = process.emitWarning
process.emitWarning = function (w: any, ...a: any[]) {
  if (typeof w === "string" && (w.includes("SQLite") || w.includes("ExperimentalWarning"))) return
  if (w && typeof w === "object" && (w.name === "ExperimentalWarning" || (w.message && w.message.includes("SQLite"))))
    return
  if (a[0] === "ExperimentalWarning") return
  return Reflect.apply(__origEmitWarning, process, [w, ...a])
}

import fs from "node:fs"
import path from "node:path"
import { readFile, writeFile, access } from "node:fs/promises"
import { Worker as NodeWorker } from "node:worker_threads"

if (typeof (globalThis as any).Worker === "undefined") {
  ;(globalThis as any).Worker = NodeWorker
}

if (typeof (globalThis as any).Bun === "undefined") {
  const BunPolyfill: any = {
    version: "1.3.14",
    env: process.env,
    main: process.argv[1],
    sleep: (ms: number) => new Promise((resolve) => setTimeout(resolve, ms)),
    stringWidth: (str: string) => {
      if (!str) return 0
      const clean = str.replace(/\x1B\[[0-?]*[ -/]*[@-~]/g, "")
      return clean.length
    },
    file: (filePath: string) => ({
      name: filePath,
      text: () => readFile(filePath, "utf8"),
      json: async () => JSON.parse(await readFile(filePath, "utf8")),
      arrayBuffer: async () => (await readFile(filePath)).buffer,
      bytes: async () => new Uint8Array(await readFile(filePath)),
      exists: () => access(filePath).then(() => true, () => false),
      size: fs.existsSync(filePath) ? fs.statSync(filePath).size : 0,
      type: "text/plain",
    }),
    write: (dest: string, data: any) => writeFile(dest, data, "utf8"),
    nanoseconds: () => Number(process.hrtime.bigint()),
    which: (bin: string) => {
      const pathEnv = process.env.PATH || ""
      const pathDirs = pathEnv.split(process.platform === "win32" ? ";" : ":")
      const extensions = process.platform === "win32" ? [".exe", ".cmd", ".bat", ""] : [""]
      for (const dir of pathDirs) {
        for (const ext of extensions) {
          const full = path.join(dir, bin + ext)
          if (fs.existsSync(full)) return full
        }
      }
      return null
    },
  }
  ;(globalThis as any).Bun = BunPolyfill
}

import { Server } from "@/server/server"
import { InstanceRuntime } from "@/project/instance-runtime"
import { Rpc } from "@/util/rpc"
import { upgrade } from "@/cli/upgrade"
import { Config } from "@/config/config"
import { GlobalBus } from "@/bus/global"
import { ServerAuth } from "@/server/auth"
import { writeHeapSnapshot } from "node:v8"
import { Heap } from "@/cli/heap"
import { AppRuntime } from "@/effect/app-runtime"
import { Effect } from "effect"
import { disposeAllInstancesAndEmitGlobalDisposed } from "@/server/global-lifecycle"

Heap.start()

const onUnhandledRejection = (_error: unknown) => {}

const onUncaughtException = (_error: Error) => {}

process.on("unhandledRejection", onUnhandledRejection)
process.on("uncaughtException", onUncaughtException)

// Subscribe to global events and forward them via RPC
GlobalBus.on("event", (event) => {
  Rpc.emit("global.event", event)
})

let server: Awaited<ReturnType<typeof Server.listen>> | undefined

export const rpc = {
  async fetch(input: { url: string; method: string; headers: Record<string, string>; body?: string }) {
    const headers = { ...input.headers }
    const auth = ServerAuth.header()
    if (auth && !headers["authorization"] && !headers["Authorization"]) {
      headers["Authorization"] = auth
    }
    const request = new Request(input.url, {
      method: input.method,
      headers,
      body: input.body,
    })
    const response = await Server.Default().app.fetch(request)
    const body = await response.text()
    return {
      status: response.status,
      headers: Object.fromEntries(response.headers.entries()),
      body,
    }
  },
  snapshot() {
    const result = writeHeapSnapshot("server.heapsnapshot")
    return result
  },
  async server(input: { port: number; hostname: string; mdns?: boolean; cors?: string[] }) {
    if (server) await server.stop(true)
    server = await Server.listen(input)
    return { url: server.url.toString() }
  },
  async checkUpgrade(input: { directory: string }) {
    await InstanceRuntime.load({ directory: input.directory })
    await upgrade().catch(() => {})
  },
  async reload() {
    await AppRuntime.runPromise(
      Effect.gen(function* () {
        const cfg = yield* Config.Service
        yield* cfg.invalidate()
        yield* disposeAllInstancesAndEmitGlobalDisposed({ swallowErrors: true })
      }),
    )
  },
  async shutdown() {
    await InstanceRuntime.disposeAllInstances()
    if (server) await server.stop(true)
    process.off("unhandledRejection", onUnhandledRejection)
    process.off("uncaughtException", onUncaughtException)
  },
}

Rpc.listen(rpc)
