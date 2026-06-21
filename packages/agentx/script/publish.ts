#!/usr/bin/env bun
import { $ } from "bun"
import pkg from "../package.json"
import { Script } from "@agentx-cli/script"
import { fileURLToPath } from "url"

const dir = fileURLToPath(new URL("..", import.meta.url))
process.chdir(dir)

async function published(name: string, version: string) {
  return (await $`npm view ${name}@${version} version`.nothrow()).exitCode === 0
}

async function publish(dir: string, name: string, version: string) {
  if (process.platform !== "win32") await $`chmod -R 755 .`.cwd(dir)
  if (await published(name, version)) {
    console.log(`already published ${name}@${version}`)
    return
  }
  await $`bun pm pack`.cwd(dir)
  if (process.env.NPM_OTP) {
    await $`npm publish --access public --tag ${Script.channel} --otp=${process.env.NPM_OTP}`.cwd(dir)
  } else {
    await $`npm publish --access public --tag ${Script.channel}`.cwd(dir)
  }
}

await publish(dir, pkg.name, pkg.version)
