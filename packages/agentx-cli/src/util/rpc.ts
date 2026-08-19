import { parentPort } from "node:worker_threads"

type Definition = {
  [method: string]: (input: any) => any
}

function post(msg: string) {
  if (parentPort) {
    parentPort.postMessage(msg)
  } else if (typeof postMessage === "function") {
    postMessage(msg)
  } else if (typeof self !== "undefined" && typeof (self as any).postMessage === "function") {
    ;(self as any).postMessage(msg)
  } else if (typeof (globalThis as any).postMessage === "function") {
    ;(globalThis as any).postMessage(msg)
  }
}

export function listen(rpc: Definition) {
  const handler = async (data: any) => {
    try {
      const parsed = typeof data === "string" ? JSON.parse(data) : data
      if (parsed && typeof parsed === "object" && parsed.type === "rpc.request") {
        try {
          const result = await rpc[parsed.method](parsed.input)
          post(JSON.stringify({ type: "rpc.result", result, id: parsed.id }))
        } catch (err: any) {
          post(JSON.stringify({ type: "rpc.result", error: err?.message || String(err), id: parsed.id }))
        }
      }
    } catch {}
  }

  if (parentPort) {
    parentPort.on("message", (msg) => {
      handler(msg)
    })
  }

  if (typeof self !== "undefined") {
    try {
      self.addEventListener("message", (evt: MessageEvent) => {
        handler(evt.data)
      })
    } catch {}
    try {
      ;(self as any).onmessage = (evt: any) => {
        handler(evt.data)
      }
    } catch {}
  }
  if (typeof addEventListener === "function") {
    try {
      addEventListener("message", (evt: any) => {
        handler(evt.data)
      })
    } catch {}
  }
  try {
    ;(globalThis as any).onmessage = (evt: any) => {
      handler(evt.data)
    }
  } catch {}

  // Signal that the listener is ready
  post(JSON.stringify({ type: "rpc.ready" }))
}

export function emit(event: string, data: unknown) {
  post(JSON.stringify({ type: "rpc.event", event, data }))
}

export function client<T extends Definition>(target: any) {
  const pending = new Map<number, { resolve: (result: any) => void; reject: (err: any) => void; raw: string }>()
  const listeners = new Map<string, Set<(data: any) => void>>()
  let id = 0

  const handleMessage = async (msg: any) => {
    const raw = typeof msg?.data !== "undefined" ? msg.data : msg
    const parsed = typeof raw === "string" ? JSON.parse(raw) : raw
    if (!parsed || typeof parsed !== "object") return
    if (parsed.type === "rpc.ready") {
      for (const item of pending.values()) {
        try {
          target.postMessage(item.raw)
        } catch {}
      }
      return
    }
    if (parsed.type === "rpc.result") {
      const item = pending.get(parsed.id)
      if (item) {
        if (parsed.error) {
          item.reject(new Error(parsed.error))
        } else {
          item.resolve(parsed.result)
        }
        pending.delete(parsed.id)
      }
    }
    if (parsed.type === "rpc.event") {
      const handlers = listeners.get(parsed.event)
      if (handlers) {
        for (const handler of handlers) {
          handler(parsed.data)
        }
      }
    }
  }

  if (target && typeof target.on === "function") {
    target.on("message", handleMessage)
  }
  if (target && "onmessage" in target) {
    target.onmessage = handleMessage
  }
  if (target && typeof target.addEventListener === "function") {
    target.addEventListener("message", handleMessage)
  }

  return {
    call<Method extends keyof T>(method: Method, input: Parameters<T[Method]>[0]): Promise<ReturnType<T[Method]>> {
      const requestId = id++
      const payload = JSON.stringify({ type: "rpc.request", method, input, id: requestId })
      return new Promise((resolve, reject) => {
        pending.set(requestId, { resolve, reject, raw: payload })
        try {
          target.postMessage(payload)
        } catch {}
        setTimeout(() => {
          if (pending.has(requestId)) {
            try {
              target.postMessage(payload)
            } catch {}
          }
        }, 600)
      })
    },
    on<Data>(event: string, handler: (data: Data) => void) {
      let handlers = listeners.get(event)
      if (!handlers) {
        handlers = new Set()
        listeners.set(event, handlers)
      }
      handlers.add(handler)
      return () => {
        handlers!.delete(handler)
      }
    },
  }
}

export * as Rpc from "./rpc"
