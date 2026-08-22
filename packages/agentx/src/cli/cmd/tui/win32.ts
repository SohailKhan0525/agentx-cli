/**
 * Windows console mode handlers for Node.js
 */
export function win32DisableProcessedInput() {
  // In Node.js, process.stdin.setRawMode(true) handles raw mode.
}

export function win32FlushInputBuffer() {
  // In Node.js, readline / stream buffers handle input.
}

export function win32InstallCtrlCGuard() {
  return () => {}
}
