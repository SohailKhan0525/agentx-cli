import { describe, expect, test } from "bun:test"
import fs from "fs/promises"
import os from "os"
import path from "path"
import { Global } from "@agentx-cli/core/global"

describe("global paths", () => {
  test("tmp path is under the system temp directory", () => {
    expect(Global.Path.tmp).toBe(path.join(os.tmpdir(), "agentx"))
    expect(Global.make().tmp).toBe(Global.Path.tmp)
  })

  test("tmp path is created on module load", async () => {
    expect((await fs.stat(Global.Path.tmp)).isDirectory()).toBe(true)
  })

  test("all platform paths are non-empty and initialized", async () => {
    expect(Global.Path.data.length).toBeGreaterThan(0)
    expect(Global.Path.config.length).toBeGreaterThan(0)
    expect(Global.Path.cache.length).toBeGreaterThan(0)
    expect(Global.Path.state.length).toBeGreaterThan(0)
    expect(Global.Path.bin).toBe(path.join(Global.Path.cache, "bin"))
    expect(Global.Path.log).toBe(path.join(Global.Path.data, "log"))

    expect((await fs.stat(Global.Path.data)).isDirectory()).toBe(true)
    expect((await fs.stat(Global.Path.config)).isDirectory()).toBe(true)
    expect((await fs.stat(Global.Path.cache)).isDirectory()).toBe(true)
    expect((await fs.stat(Global.Path.state)).isDirectory()).toBe(true)
  })
})
