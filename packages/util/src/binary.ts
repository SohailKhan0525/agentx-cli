export namespace Binary {
  export function search<T>(arr: T[], target: T, cmp: (a: T, b: T) => number): number {
    let low = 0
    let high = arr.length - 1
    while (low <= high) {
      const mid = Math.floor((low + high) / 2)
      const item = arr[mid]!
      const diff = cmp(item, target)
      if (diff === 0) return mid
      if (diff < 0) low = mid + 1
      else high = mid - 1
    }
    return -low - 1
  }
}
