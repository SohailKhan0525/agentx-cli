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
  // GitHub artifact downloads can drop the executable bit, and Docker uses the
  // unpacked dist binaries directly rather than the published tarball.
  if (process.platform !== "win32") await $`chmod -R 755 .`.cwd(dir)
  if (await published(name, version)) {
    console.log(`already published ${name}@${version}`)
    return
  }
  await $`bun pm pack`.cwd(dir)
  if (process.env.NPM_OTP) {
    await $`npm publish *.tgz --access public --tag ${Script.channel} --otp=${process.env.NPM_OTP}`.cwd(dir)
  } else {
    await $`npm publish *.tgz --access public --tag ${Script.channel}`.cwd(dir)
  }
}

const binaries: Record<string, string> = {}
for (const filepath of new Bun.Glob("**/*/package.json").scanSync({ cwd: "./dist" })) {
  const pkg = await Bun.file(`./dist/${filepath}`).json()
  binaries[pkg.name] = pkg.version
}
console.log("binaries", binaries)
const version = Object.values(binaries)[0]

await $`mkdir -p ./dist/${pkg.name}`
await $`mkdir -p ./dist/${pkg.name}/bin`
await $`cp ./script/postinstall.mjs ./dist/${pkg.name}/postinstall.mjs`
await Bun.file(`./dist/${pkg.name}/LICENSE`).write(await Bun.file("../../LICENSE").text())
await Bun.file(`./dist/${pkg.name}/README.md`).write(await Bun.file("../../README.md").text())
await Bun.file(`./dist/${pkg.name}/qofeno.png`).write(await Bun.file("../../qofeno.png").arrayBuffer())
await Bun.file(`./dist/${pkg.name}/bin/agentx`).write(await Bun.file("./bin/agentx").text())

await Bun.file(`./dist/${pkg.name}/package.json`).write(
  JSON.stringify(
    {
      name: pkg.name,
      bin: {
        ["agentx"]: `./bin/agentx`,
      },
      scripts: {
        postinstall: "node ./postinstall.mjs",
      },
      version: version,
      license: pkg.license,
      os: ["darwin", "linux", "win32"],
      cpu: ["arm64", "x64"],
      optionalDependencies: binaries,
    },
    null,
    2,
  ),
)

for (const [name, version] of Object.entries(binaries)) {
  await publish(`./dist/${name}`, name, version)
  // Wait 10 seconds between publishes to avoid NPM 409 packument processing conflicts
  await new Promise(resolve => setTimeout(resolve, 10000))
}
await publish(`./dist/${pkg.name}`, pkg.name, version)

const image = "ghcr.io/anomalyco/agentx"
const platforms = "linux/amd64,linux/arm64"
// Skip external registries for this fork
