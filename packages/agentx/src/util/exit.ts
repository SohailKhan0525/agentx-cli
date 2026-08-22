export function setupCleanExit(cleanup: () => void): void {
  const exit = (code = 0) => () => {
    cleanup()
    process.exit(code)
  }
  process.on("SIGINT", exit(0))
  process.on("SIGTERM", exit(0))
  process.on("exit", cleanup)
  if (process.platform === "win32") {
    process.on("SIGHUP", exit(0))
  }
}
