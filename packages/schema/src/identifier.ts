const length = 26
const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
let lastTimestamp = 0
let counter = 0

export function ascending() {
  return create(false)
}

export function descending() {
  return create(true)
}

export function create(descending: boolean, timestamp = Date.now()) {
  if (timestamp !== lastTimestamp) {
    lastTimestamp = timestamp
    counter = 0
  }
  counter++

  const current = BigInt(timestamp) * 0x1000n + BigInt(counter)
  const value = descending ? ~current : current
  const time = Array.from({ length: 6 }, (_, index) =>
    Number((value >> BigInt(40 - 8 * index)) & 0xffn)
      .toString(16)
      .padStart(2, "0"),
  ).join("")
  const randomLength = length - 12
  let randomChars = ""
  const maxValidByte = 256 - (256 % chars.length)
  while (randomChars.length < randomLength) {
    const bytes = crypto.getRandomValues(new Uint8Array(randomLength * 2))
    for (let i = 0; i < bytes.length && randomChars.length < randomLength; i++) {
      const b = bytes[i]!
      if (b < maxValidByte) {
        randomChars += chars[b % chars.length]
      }
    }
  }
  return time + randomChars
}
