import { expect, test } from "bun:test"
import { detectHardware } from "../src/local-model/hardware"
import { computeModelScore, getRecommendedModels } from "../src/local-model/huggingface"
import { discoverLocalRuntimes, checkModelHealth } from "../src/local-model/discovery"
import { formatLocalModelSummary } from "../src/local-model/index"
import type { HardwareProfile } from "../src/local-model/types"

test("detectHardware returns valid hardware profile", async () => {
  const hw = await detectHardware()
  expect(hw.os).toBeDefined()
  expect(hw.platform).toBeDefined()
  expect(hw.cpuModel).toBeDefined()
  expect(hw.cpuCores).toBeGreaterThan(0)
  expect(hw.totalRamGb).toBeGreaterThan(0)
  expect(hw.freeDiskGb).toBeGreaterThan(0)
})

test("computeModelScore computes deterministic fit score", () => {
  const highEndHw: HardwareProfile = {
    os: "Windows 11",
    platform: "win32",
    arch: "x64",
    cpuModel: "Intel i9-14900K",
    cpuCores: 24,
    totalRamGb: 64,
    freeRamGb: 48,
    gpuName: "NVIDIA GeForce RTX 4090",
    gpuVendor: "nvidia",
    vramGb: 24,
    freeDiskGb: 500,
  }

  const model = {
    id: "qwen2.5-coder:7b",
    name: "Qwen 2.5 Coder (7B)",
    category: "coding" as const,
    description: "7B code model",
    author: "Qwen",
    sizeGb: 4.7,
    minRamGb: 8,
    recommendedVramGb: 6,
    quantization: "Q4_K_M",
    contextLength: 32768,
    qualityTier: 9.5,
  }

  const result = computeModelScore(model, highEndHw)
  expect(result.score).toBeGreaterThanOrEqual(90)
  expect(result.fitsInVram).toBe(true)
  expect(result.explanation).toContain("Perfect fit for GPU")
})

test("computeModelScore handles low memory systems gracefully", () => {
  const lowEndHw: HardwareProfile = {
    os: "Linux",
    platform: "linux",
    arch: "x64",
    cpuModel: "Intel Celeron",
    cpuCores: 2,
    totalRamGb: 4,
    freeRamGb: 1,
    freeDiskGb: 10,
  }

  const bigModel = {
    id: "deepseek-coder-v2:16b",
    name: "DeepSeek Coder V2",
    category: "coding" as const,
    description: "16B model",
    author: "DeepSeek",
    sizeGb: 9.0,
    minRamGb: 16,
    recommendedVramGb: 12,
    quantization: "Q4_K_M",
    contextLength: 65536,
    qualityTier: 9.6,
  }

  const result = computeModelScore(bigModel, lowEndHw)
  expect(result.fitsInRam).toBe(false)
  expect(result.fitsInVram).toBe(false)
  expect(result.score).toBeLessThan(50)
})

test("getRecommendedModels returns models sorted by score", async () => {
  const hw: HardwareProfile = {
    os: "macOS",
    platform: "darwin",
    arch: "arm64",
    cpuModel: "Apple M3 Max",
    cpuCores: 16,
    totalRamGb: 36,
    freeRamGb: 28,
    gpuName: "Apple Silicon GPU",
    gpuVendor: "apple",
    vramGb: 27,
    freeDiskGb: 200,
  }

  const recs = await getRecommendedModels(hw)
  expect(recs.length).toBeGreaterThan(0)
  // Ensure sorted descending by score
  for (let i = 0; i < recs.length - 1; i++) {
    expect(recs[i].score).toBeGreaterThanOrEqual(recs[i + 1].score)
  }
})

test("formatLocalModelSummary renders comprehensive banner and recommendations", () => {
  const hw: HardwareProfile = {
    os: "Windows 11",
    platform: "win32",
    arch: "x64",
    cpuModel: "AMD Ryzen 9 7950X",
    cpuCores: 16,
    totalRamGb: 32,
    freeRamGb: 20,
    gpuName: "NVIDIA GeForce RTX 4080",
    gpuVendor: "nvidia",
    vramGb: 16,
    freeDiskGb: 300,
  }

  const formatted = formatLocalModelSummary({
    hardware: hw,
    runtimes: [
      {
        type: "ollama",
        name: "Ollama",
        endpoint: "http://127.0.0.1:11434",
        running: false,
        models: [],
      },
    ],
    installedModels: [],
    recommendations: [
      {
        id: "qwen2.5-coder:7b",
        name: "Qwen 2.5 Coder (7B)",
        category: "coding",
        description: "Best 7B code model",
        author: "Qwen",
        sizeGb: 4.7,
        minRamGb: 8,
        recommendedVramGb: 6,
        quantization: "Q4_K_M",
        contextLength: 32768,
        score: 95,
        scoreExplanation: "Perfect fit for GPU",
        fitsInVram: true,
        fitsInRam: true,
      },
    ],
  })

  expect(formatted).toContain("AGENTX CODE — LOCAL MODEL SYSTEM")
  expect(formatted).toContain("Hardware Profile")
  expect(formatted).toContain("Qwen 2.5 Coder")
})
