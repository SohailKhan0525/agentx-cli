const modelsUrl = process.env.agentx_MODELS_URL || "https://models.github.com/SohailKhan0525/agentx-cli"

export const modelsData = process.env.MODELS_DEV_API_JSON
  ? await Bun.file(process.env.MODELS_DEV_API_JSON).text()
  : await fetch(`${modelsUrl}/api.json`).then((response) => response.text())

console.log("Loaded models.dev snapshot")
