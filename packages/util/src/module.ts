import { createRequire } from "node:module"
import path from "node:path"

export namespace Module {
  export async function load(specifier: string) {
    return import(specifier)
  }

  export function resolve(id: string, from?: string): string | undefined {
    try {
      const req = createRequire(from ? path.join(from, "package.json") : process.cwd())
      return req.resolve(id)
    } catch {
      return undefined
    }
  }
}
