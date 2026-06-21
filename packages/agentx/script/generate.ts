import path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const dir = path.resolve(__dirname, "..")

process.chdir(dir)

const modelsUrl = process.env.AGENTX_MODELS_URL || "https://models.dev"
let modelsDataRaw = process.env.MODELS_DEV_API_JSON
  ? await Bun.file(process.env.MODELS_DEV_API_JSON).text()
  : await fetch(`${modelsUrl}/api.json`).then((x) => x.text())

try {
  const parsed = JSON.parse(modelsDataRaw)
  const allowed = ["google", "anthropic", "openai"]
  for (const key of Object.keys(parsed)) {
    if (!allowed.includes(key)) {
      delete parsed[key]
    }
  }
  modelsDataRaw = JSON.stringify(parsed, null, 2)
} catch (e) {
  console.error("Failed to filter models.dev JSON", e)
}

export const modelsData = modelsDataRaw
console.log("Loaded models.dev snapshot")
