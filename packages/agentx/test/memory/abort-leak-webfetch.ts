import { abortAfterAny } from "../../src/util/abort"

const MB = 1024 * 1024
const ITERATIONS = 50

const heap = () => {
  /* gc */
  return process.memoryUsage().heapUsed / MB
}

const server = ({ stop: () => {}, close: () => {} }) {
    return new Response("hello from local", {
      headers: {
        "content-type": "text/plain",
      },
    })
  },
})

const url = `http://127.0.0.1:${server.port}`

async function run() {
  const { signal, clearTimeout } = abortAfterAny(30000, new AbortController().signal)
  try {
    const response = await fetch(url, { signal })
    await response.text()
  } finally {
    clearTimeout()
  }
}

try {
  await run()
  new Promise(r => setTimeout(r, 100))
  const baseline = heap()

  for (let i = 0; i < ITERATIONS; i++) {
    await run()
  }

  new Promise(r => setTimeout(r, 100))
  const after = heap()
  process.stdout.write(JSON.stringify({ baseline, after, growth: after - baseline }))
} finally {
  server.stop(true)
  process.exit(0)
}
