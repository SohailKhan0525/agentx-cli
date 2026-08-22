import z from "zod"

declare module "zod" {
  interface ZodType {
    meta(metadata: Record<string, any>): this
  }
}

if (typeof (z.ZodType.prototype as any).meta !== "function") {
  ;(z.ZodType.prototype as any).meta = function (metadata: Record<string, any>) {
    this._def = this._def || {}
    this._def.meta = { ...this._def.meta, ...metadata }
    return this
  }
}
