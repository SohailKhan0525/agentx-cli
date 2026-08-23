export namespace Slug {
  export function make(prefix?: string): string {
    const chars = "abcdefghijklmnopqrstuvwxyz0123456789"
    let res = ""
    for (let i = 0; i < 6; i++) {
      res += chars[Math.floor(Math.random() * chars.length)]
    }
    return prefix ? `${prefix}-${res}` : res
  }

  export function create(prefix?: string): string {
    return make(prefix)
  }
}
