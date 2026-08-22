export function lazy<T>(fn: () => T): () => T {
  let val: T
  let evaluated = false
  return () => {
    if (!evaluated) {
      val = fn()
      evaluated = true
    }
    return val
  }
}
