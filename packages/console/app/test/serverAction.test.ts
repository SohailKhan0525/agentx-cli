import { describe, expect, test } from "bun:test"
import { sanitizeServerActionRequest } from "../src/lib/server-action"

describe("server action referer", () => {
  test("preserves same-origin return locations", () => {
    const request = new Request("https://github.com/SohailKhan0525/agentx-cli/_server?id=action", {
      headers: { referer: "https://github.com/SohailKhan0525/agentx-cli/auth?next=%2Fconsole" },
    })

    expect(sanitizeServerActionRequest(request)).toBe(request)
  })

  test("replaces unsafe return locations with the request origin", () => {
    const referers = ["https://evil.example/phishing-login", "not a url", undefined]

    expect(
      referers.map((referer) =>
        sanitizeServerActionRequest(
          new Request("https://github.com/SohailKhan0525/agentx-cli/_server?id=action", {
            headers: referer === undefined ? undefined : { referer },
          }),
        ).headers.get("referer"),
      ),
    ).toEqual([
      "https://github.com/SohailKhan0525/agentx-cli",
      "https://github.com/SohailKhan0525/agentx-cli",
      "https://github.com/SohailKhan0525/agentx-cli",
    ])
  })

  test("does not change other routes", () => {
    const request = new Request("https://github.com/SohailKhan0525/agentx-cli/auth", {
      headers: { referer: "https://evil.example/phishing-login" },
    })

    expect(sanitizeServerActionRequest(request)).toBe(request)
  })
})
