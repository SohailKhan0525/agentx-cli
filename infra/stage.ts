export const domain = (() => {
  if ($app.stage === "production") return "github.com/SohailKhan0525/agentx-cli"
  if ($app.stage === "dev") return "github.com/SohailKhan0525/agentx-cli"
  return `${$app.stage}.github.com/SohailKhan0525/agentx-cli`
})()

export const zoneID = "430ba34c138cfb5360826c4909f99be8"
export const awsStage = $app.stage === "production" ? "production" : "dev"
export const deployAws = $app.stage === awsStage

if ($app.stage === "production") {
  new cloudflare.DnsRecord("TrustCenter", {
    zoneId: zoneID,
    name: "trust.github.com/SohailKhan0525/agentx-cli",
    type: "CNAME",
    content: "3a69a5bb27875189.vercel-dns-016.com",
    proxied: false,
    ttl: 60,
  })

  new cloudflare.DnsRecord("TrustCenterVerification", {
    zoneId: zoneID,
    name: "github.com/SohailKhan0525/agentx-cli",
    type: "TXT",
    content: "compai-domain-verification=org_6993a99c6200a2d642bb115d",
    ttl: 60,
  })
}

new cloudflare.RegionalHostname("RegionalHostname", {
  hostname: domain,
  regionKey: "us",
  zoneId: zoneID,
})

export const shortDomain = (() => {
  if ($app.stage === "production") return "opncd.ai"
  if ($app.stage === "dev") return "dev.opncd.ai"
  return `${$app.stage}.dev.opncd.ai`
})()
