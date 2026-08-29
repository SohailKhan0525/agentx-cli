import path from "path"

process.env.AGENTX_DB = ":memory:"
process.env.AGENTX_MODELS_PATH = path.join(import.meta.dir, "plugin", "fixtures", "models-dev.json")
process.env.AGENTX_DISABLE_MODELS_FETCH = "true"
