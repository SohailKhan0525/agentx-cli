import { abortAfterAny } from "../../src/util/abort"
import http from "http"

const MB = 1024 * 1024
const ITERATIONS = 50

const heap = () => {
  /* gc */
  return process.memoryUsage().heapUsed / MB
}

const server = http.createServer((_, res) => {
  res.writeHead(200, { "content-type": "text/plain" })
  res.end("hello from local")
}).listen(0)

const port = (server.address() as any)?.port || 8080
const url = `http://127.0.0.1:${port}`

async function run() {
  const { signal, clearTimeout } = abortAfterAny(30000, new AbortController().signal)
  try {
    const response = await fetch(url, { signal })
    await response.text()
  } finally {
    clearTimeout()
  }
}

async function main() {
  const before = heap()
  for (let i = 0; i < ITERATIONS; i++) {
    await run()
  }
  const after = heap()
  server.close()
  console.log(`Heap before: ${before.toFixed(2)} MB, after: ${after.toFixed(2)} MB`)
}

main().catch(console.error)
