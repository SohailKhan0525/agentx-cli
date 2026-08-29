export type HardwareProfile = {
  os: string
  platform: NodeJS.Platform
  arch: string
  cpuModel: string
  cpuCores: number
  totalRamGb: number
  freeRamGb: number
  gpuName?: string
  gpuVendor?: "nvidia" | "apple" | "amd" | "intel" | "unknown"
  vramGb?: number
  freeDiskGb: number
}

export type LocalRuntimeType = "ollama" | "llamacpp" | "lmstudio" | "vllm" | "localai" | "custom"

export type LocalRuntimeInfo = {
  type: LocalRuntimeType
  name: string
  endpoint: string
  running: boolean
  models: InstalledModelInfo[]
}

export type InstalledModelInfo = {
  id: string
  name: string
  runtime: LocalRuntimeType
  sizeBytes?: number
  sizeFormatted?: string
  quantization?: string
  contextLength?: number
  family?: string
  format?: string
  modifiedAt?: string
  digest?: string
  healthy?: boolean
  error?: string
}

export type ModelCategory = "coding" | "reasoning" | "general" | "multimodal"

export type RecommendedModel = {
  id: string
  name: string
  category: ModelCategory
  description: string
  author: string
  huggingFaceId?: string
  ollamaTag?: string
  sizeGb: number
  minRamGb: number
  recommendedVramGb: number
  quantization: string
  contextLength: number
  score: number
  scoreExplanation: string
  fitsInVram: boolean
  fitsInRam: boolean
  downloadUrl?: string
}

export type LocalModelCommandResult = {
  hardware: HardwareProfile
  runtimes: LocalRuntimeInfo[]
  installedModels: InstalledModelInfo[]
  recommendations: RecommendedModel[]
}
