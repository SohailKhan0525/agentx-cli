import path from "path"

process.env.agentx_DB = ":memory:"
process.env.agentx_MODELS_PATH = path.join(import.meta.dir, "plugin", "fixtures", "models-dev.json")
process.env.agentx_DISABLE_MODELS_FETCH = "true"
