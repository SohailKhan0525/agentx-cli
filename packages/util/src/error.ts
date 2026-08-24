import z from "zod"

export class NamedError extends Error {
  override name: string
  data: any

  constructor(name: string, data: any) {
    super(typeof data?.message === "string" ? `${name}: ${data.message}` : name)
    this.name = name
    this.data = data
  }

  toObject() {
    return { name: this.name, data: this.data }
  }

  static create<T extends z.ZodTypeAny>(name: string, schema: T) {
    const errorSchema = z.object({
      name: z.literal(name),
      data: schema,
    })

    return class CustomNamedError extends NamedError {
      static readonly zod = schema
      static readonly Schema = errorSchema
      constructor(data?: z.infer<T>, opts?: { cause?: unknown }) {
        super(name, data ?? {})
        if (opts?.cause) this.cause = opts.cause
      }
    }
  }

  static readonly Unknown = NamedError.create(
    "UnknownError",
    z.object({
      message: z.string(),
    }),
  )
}
