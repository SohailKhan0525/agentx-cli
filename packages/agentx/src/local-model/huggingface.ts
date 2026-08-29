import type { HardwareProfile, RecommendedModel } from "./types"

type ModelDef = {
  id: string
  name: string
  category: RecommendedModel["category"]
  description: string
  author: string
  huggingFaceId?: string
  ollamaTag?: string
  sizeGb: number
  minRamGb: number
  recommendedVramGb: number
  quantization: string
  contextLength: number
  qualityTier: number // 1 to 10
}

const CURATED_MODELS: ModelDef[] = [
  // Coding models
  {
    id: "qwen2.5-coder:7b",
    name: "Qwen 2.5 Coder (7B)",
    category: "coding",
    description: "State-of-the-art 7B code model with 128k context support, top performance in Python/TS/Rust/Go.",
    author: "Qwen",
    huggingFaceId: "Qwen/Qwen2.5-Coder-7B-Instruct-GGUF",
    ollamaTag: "qwen2.5-coder:7b",
    sizeGb: 4.7,
    minRamGb: 8,
    recommendedVramGb: 6,
    quantization: "Q4_K_M",
    contextLength: 32768,
    qualityTier: 9.5,
  },
  {
    id: "qwen2.5-coder:1.5b",
    name: "Qwen 2.5 Coder (1.5B)",
    category: "coding",
    description: "Ultra-lightweight fast code assistant, ideal for laptops and low-memory devices.",
    author: "Qwen",
    huggingFaceId: "Qwen/Qwen2.5-Coder-1.5B-Instruct-GGUF",
    ollamaTag: "qwen2.5-coder:1.5b",
    sizeGb: 1.0,
    minRamGb: 3,
    recommendedVramGb: 2,
    quantization: "Q4_K_M",
    contextLength: 32768,
    qualityTier: 8.0,
  },
  {
    id: "qwen2.5-coder:14b",
    name: "Qwen 2.5 Coder (14B)",
    category: "coding",
    description: "High-capability coding model matching GPT-4o-mini on major coding benchmarks.",
    author: "Qwen",
    huggingFaceId: "Qwen/Qwen2.5-Coder-14B-Instruct-GGUF",
    ollamaTag: "qwen2.5-coder:14b",
    sizeGb: 9.0,
    minRamGb: 16,
    recommendedVramGb: 12,
    quantization: "Q4_K_M",
    contextLength: 32768,
    qualityTier: 9.8,
  },
  {
    id: "deepseek-coder-v2:16b",
    name: "DeepSeek Coder V2 (16B Lite)",
    category: "coding",
    description: "MoE code model with exceptional multi-language and repository understanding.",
    author: "DeepSeek",
    huggingFaceId: "deepseek-ai/DeepSeek-Coder-V2-Lite-Instruct-GGUF",
    ollamaTag: "deepseek-coder-v2:16b",
    sizeGb: 8.9,
    minRamGb: 16,
    recommendedVramGb: 12,
    quantization: "Q4_K_M",
    contextLength: 65536,
    qualityTier: 9.6,
  },

  // Reasoning models
  {
    id: "deepseek-r1:8b",
    name: "DeepSeek R1 Distill (8B)",
    category: "reasoning",
    description: "Deep reasoning & chain-of-thought distillation for architectural decisions and hard bugs.",
    author: "DeepSeek",
    huggingFaceId: "deepseek-ai/DeepSeek-R1-Distill-Llama-8B-GGUF",
    ollamaTag: "deepseek-r1:8b",
    sizeGb: 4.9,
    minRamGb: 8,
    recommendedVramGb: 6,
    quantization: "Q4_K_M",
    contextLength: 32768,
    qualityTier: 9.4,
  },
  {
    id: "deepseek-r1:14b",
    name: "DeepSeek R1 Distill (14B)",
    category: "reasoning",
    description: "Advanced math, logic, and deep code reasoning distillation on Qwen 2.5 14B.",
    author: "DeepSeek",
    huggingFaceId: "deepseek-ai/DeepSeek-R1-Distill-Qwen-14B-GGUF",
    ollamaTag: "deepseek-r1:14b",
    sizeGb: 9.0,
    minRamGb: 16,
    recommendedVramGb: 12,
    quantization: "Q4_K_M",
    contextLength: 32768,
    qualityTier: 9.7,
  },
  {
    id: "deepseek-r1:1.5b",
    name: "DeepSeek R1 Distill (1.5B)",
    category: "reasoning",
    description: "Compact reasoning model for fast lightweight step-by-step thinking.",
    author: "DeepSeek",
    huggingFaceId: "deepseek-ai/DeepSeek-R1-Distill-Qwen-1.5B-GGUF",
    ollamaTag: "deepseek-r1:1.5b",
    sizeGb: 1.1,
    minRamGb: 4,
    recommendedVramGb: 2,
    quantization: "Q4_K_M",
    contextLength: 32768,
    qualityTier: 8.2,
  },

  // General models
  {
    id: "llama3.2:3b",
    name: "Llama 3.2 (3B)",
    category: "general",
    description: "Meta's efficient 3B general instruction model, fast and responsive.",
    author: "Meta",
    huggingFaceId: "meta-llama/Llama-3.2-3B-Instruct-GGUF",
    ollamaTag: "llama3.2:3b",
    sizeGb: 2.0,
    minRamGb: 6,
    recommendedVramGb: 3,
    quantization: "Q4_K_M",
    contextLength: 8192,
    qualityTier: 8.5,
  },
  {
    id: "llama3.1:8b",
    name: "Llama 3.1 (8B)",
    category: "general",
    description: "Meta's leading 8B general assistant model with strong instruction following.",
    author: "Meta",
    huggingFaceId: "meta-llama/Meta-Llama-3.1-8B-Instruct-GGUF",
    ollamaTag: "llama3.1:8b",
    sizeGb: 4.7,
    minRamGb: 8,
    recommendedVramGb: 6,
    quantization: "Q4_K_M",
    contextLength: 16384,
    qualityTier: 9.2,
  },
]

export function computeModelScore(model: ModelDef, hardware: HardwareProfile): {
  score: number
  fitsInVram: boolean
  fitsInRam: boolean
  explanation: string
} {
  const totalRam = hardware.totalRamGb
  const vram = hardware.vramGb || 0
  const freeDisk = hardware.freeDiskGb

  // Check disk availability
  if (freeDisk < model.sizeGb * 1.2) {
    return {
      score: 10,
      fitsInVram: false,
      fitsInRam: false,
      explanation: `Low score: Insufficient free disk space (${freeDisk}GB free, needs ${Math.round(model.sizeGb * 1.2)}GB).`,
    }
  }

  // Memory fit calculation (max 50 points)
  let memScore = 0
  const fitsInVram = vram >= model.recommendedVramGb
  const fitsInRam = totalRam >= model.minRamGb

  if (fitsInVram) {
    // Fits completely into VRAM for GPU acceleration
    const headroomRatio = Math.min(1.5, vram / model.recommendedVramGb)
    memScore = Math.round(40 + (headroomRatio - 1.0) * 20) // 40-50
  } else if (fitsInRam) {
    // Fits into system RAM (CPU execution or partial offload)
    const ramRatio = Math.min(2.0, totalRam / model.minRamGb)
    memScore = Math.round(25 + (ramRatio - 1.0) * 10) // 25-35
  } else {
    // Exceeds system RAM
    memScore = 5
  }

  // Quality score (max 30 points)
  const qualityScore = Math.round((model.qualityTier / 10) * 30)

  // Quantization efficiency score (max 20 points)
  const quantScore = model.quantization.includes("Q4") ? 20 : 15

  const totalScore = Math.min(100, Math.max(1, memScore + qualityScore + quantScore))

  let explanation = ""
  if (fitsInVram) {
    explanation = `${totalScore}/100: Perfect fit for GPU. ${model.sizeGb}GB fits comfortably in ${vram}GB VRAM for fast inference.`
  } else if (fitsInRam) {
    explanation = `${totalScore}/100: Fits in system RAM (${totalRam}GB). Will run via CPU offload.`
  } else {
    explanation = `${totalScore}/100: Model requires ${model.minRamGb}GB RAM, exceeding available ${totalRam}GB.`
  }

  return {
    score: totalScore,
    fitsInVram,
    fitsInRam,
    explanation,
  }
}

export async function getRecommendedModels(
  hardware: HardwareProfile,
  hfToken?: string,
  categoryFilter?: RecommendedModel["category"],
): Promise<RecommendedModel[]> {
  const models = categoryFilter ? CURATED_MODELS.filter((m) => m.category === categoryFilter) : CURATED_MODELS

  const scored = models.map((m) => {
    const { score, fitsInVram, fitsInRam, explanation } = computeModelScore(m, hardware)
    return {
      id: m.id,
      name: m.name,
      category: m.category,
      description: m.description,
      author: m.author,
      huggingFaceId: m.huggingFaceId,
      ollamaTag: m.ollamaTag,
      sizeGb: m.sizeGb,
      minRamGb: m.minRamGb,
      recommendedVramGb: m.recommendedVramGb,
      quantization: m.quantization,
      contextLength: m.contextLength,
      score,
      scoreExplanation: explanation,
      fitsInVram,
      fitsInRam,
    }
  })

  // Sort descending by deterministic score
  return scored.sort((a, b) => b.score - a.score)
}
