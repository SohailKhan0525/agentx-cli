import { detectHardware } from "./hardware"
import { discoverLocalRuntimes, checkModelHealth } from "./discovery"
import { getRecommendedModels, computeModelScore } from "./huggingface"
import { installModel } from "./installer"
import type { LocalModelCommandResult } from "./types"

export * from "./types"
export * from "./hardware"
export * from "./discovery"
export * from "./huggingface"
export * from "./installer"

export async function runLocalModelDiscovery(hfToken?: string): Promise<LocalModelCommandResult> {
  const [hardware, runtimes] = await Promise.all([detectHardware(), discoverLocalRuntimes()])

  const installedModels = runtimes.filter((r) => r.running).flatMap((r) => r.models)
  const recommendations = await getRecommendedModels(hardware, hfToken)

  return {
    hardware,
    runtimes,
    installedModels,
    recommendations,
  }
}

export function formatLocalModelSummary(result: LocalModelCommandResult): string {
  const { hardware, runtimes, installedModels, recommendations } = result
  const lines: string[] = []

  lines.push("╔═══════════════════════════════════════════════════════════════════════════════╗")
  lines.push("║                         AGENTX CODE — LOCAL MODEL SYSTEM                      ║")
  lines.push("╚═══════════════════════════════════════════════════════════════════════════════╝")
  lines.push("")

  // Hardware Section
  lines.push("💻 Hardware Profile:")
  lines.push(`  • OS: ${hardware.os} (${hardware.arch})`)
  lines.push(`  • CPU: ${hardware.cpuModel} (${hardware.cpuCores} cores)`)
  lines.push(`  • RAM: ${hardware.totalRamGb} GB total (${hardware.freeRamGb} GB free)`)
  if (hardware.gpuName) {
    lines.push(`  • GPU: ${hardware.gpuName}${hardware.vramGb ? ` (${hardware.vramGb} GB VRAM)` : ""}`)
  } else {
    lines.push(`  • GPU: Standard / CPU offload mode`)
  }
  lines.push(`  • Free Disk: ${hardware.freeDiskGb} GB`)
  lines.push("")

  // Active Runtimes
  const activeRuntimes = runtimes.filter((r) => r.running)
  lines.push("⚡ Local AI Runtimes:")
  if (activeRuntimes.length > 0) {
    for (const r of activeRuntimes) {
      lines.push(`  • [Active] ${r.name} (${r.endpoint}) — ${r.models.length} model(s) available`)
    }
  } else {
    lines.push("  • No local AI runtime currently running (Ollama:11434, LM Studio:1234, llama.cpp:8080)")
  }
  lines.push("")

  // Installed models
  if (installedModels.length > 0) {
    lines.push("📦 Installed Local Models:")
    for (const m of installedModels) {
      lines.push(`  • ${m.name} [${m.runtime}] ${m.sizeFormatted ? `(${m.sizeFormatted})` : ""}`)
    }
    lines.push("")
  }

  // Recommendations
  lines.push("🎯 Recommended Models for Your Hardware (Deterministic Fit Score):")
  for (const rec of recommendations.slice(0, 5)) {
    const fitBadge = rec.fitsInVram ? "🔥 GPU VRAM" : rec.fitsInRam ? "⚡ CPU RAM" : "⚠️ High Memory"
    lines.push(`  • [Score: ${rec.score}/100 | ${fitBadge}] ${rec.name} (${rec.sizeGb} GB)`)
    lines.push(`    Category: ${rec.category.toUpperCase()} | Context: ${rec.contextLength.toLocaleString()} tokens | Quant: ${rec.quantization}`)
    lines.push(`    ${rec.description}`)
    lines.push(`    Fit: ${rec.scoreExplanation}`)
    lines.push("")
  }

  lines.push("💡 To use a model, run: /local-model install <model-tag>")
  return lines.join("\n")
}
