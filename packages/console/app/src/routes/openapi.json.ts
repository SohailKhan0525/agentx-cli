export async function GET() {
  const response = await fetch(
    "https://raw.githubusercontent.com/SohailKhan0525/agentx-cli/refs/heads/dev/packages/sdk/openapi.json",
  )
  const json = await response.json()
  return json
}
