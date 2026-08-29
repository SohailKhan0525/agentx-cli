import os from "os"
import childProcess from "child_process"
import type { HardwareProfile } from "./types"

export async function detectHardware(): Promise<HardwareProfile> {
  const cpus = os.cpus() || []
  const cpuModel = cpus[0]?.model || "Unknown CPU"
  const cpuCores = cpus.length || 1
  const totalRamGb = Math.round((os.totalmem() / 1024 / 1024 / 1024) * 10) / 10
  const freeRamGb = Math.round((os.freemem() / 1024 / 1024 / 1024) * 10) / 10

  const gpuInfo = detectGpu(os.platform())
  const freeDiskGb = detectFreeDisk(os.platform())

  return {
    os: `${os.type()} ${os.release()}`,
    platform: os.platform(),
    arch: os.arch(),
    cpuModel,
    cpuCores,
    totalRamGb,
    freeRamGb,
    gpuName: gpuInfo.name,
    gpuVendor: gpuInfo.vendor,
    vramGb: gpuInfo.vramGb,
    freeDiskGb,
  }
}

function detectGpu(platform: NodeJS.Platform): {
  name?: string
  vendor?: "nvidia" | "apple" | "amd" | "intel" | "unknown"
  vramGb?: number
} {
  // 1. Try NVIDIA via nvidia-smi (cross-platform: Linux, Windows)
  try {
    const smi = childProcess.spawnSync("nvidia-smi", ["--query-gpu=gpu_name,memory.total", "--format=csv,noheader,nounits"], {
      encoding: "utf8",
      timeout: 2000,
    })
    if (smi.status === 0 && smi.stdout) {
      const line = smi.stdout.trim().split("\n")[0]
      if (line) {
        const [name, memMb] = line.split(",").map((s) => s.trim())
        const vramGb = memMb ? Math.round((Number(memMb) / 1024) * 10) / 10 : undefined
        return {
          name,
          vendor: "nvidia",
          vramGb,
        }
      }
    }
  } catch {
    // nvidia-smi not present
  }

  // 2. macOS Apple Silicon unified memory
  if (platform === "darwin") {
    try {
      const isArm = os.arch() === "arm64"
      if (isArm) {
        const totalMemGb = Math.round((os.totalmem() / 1024 / 1024 / 1024) * 10) / 10
        // On Apple Silicon, unified memory is shared with GPU (approx 75% allocatable to GPU)
        return {
          name: "Apple Silicon GPU (Unified Memory)",
          vendor: "apple",
          vramGb: Math.round(totalMemGb * 0.75 * 10) / 10,
        }
      }
    } catch {
      // ignore
    }
  }

  // 3. Windows WMI / wmic detection (fast, low latency)
  if (platform === "win32") {
    try {
      const wmic = childProcess.spawnSync("wmic", ["path", "win32_VideoController", "get", "name,adapterram", "/value"], {
        encoding: "utf8",
        timeout: 800,
        windowsHide: true,
      })
      if (wmic.status === 0 && wmic.stdout) {
        const text = wmic.stdout
        const nameMatch = text.match(/Name=(.+)/i)
        const ramMatch = text.match(/AdapterRAM=(\d+)/i)
        if (nameMatch && nameMatch[1]) {
          const name = nameMatch[1].trim()
          const rawRam = ramMatch ? Number(ramMatch[1]) : 0
          const vramGb = rawRam > 0 ? Math.round((rawRam / 1024 / 1024 / 1024) * 10) / 10 : undefined
          let vendor: "nvidia" | "apple" | "amd" | "intel" | "unknown" = "unknown"
          const lower = name.toLowerCase()
          if (lower.includes("nvidia") || lower.includes("geforce") || lower.includes("rtx") || lower.includes("gtx")) {
            vendor = "nvidia"
          } else if (lower.includes("amd") || lower.includes("radeon")) {
            vendor = "amd"
          } else if (lower.includes("intel")) {
            vendor = "intel"
          }
          return { name, vendor, vramGb }
        }
      }
    } catch {
      // ignore
    }
  }

  // 4. Linux / lspci fallback
  if (platform === "linux") {
    try {
      const lspci = childProcess.spawnSync("lspci", [], { encoding: "utf8", timeout: 2000 })
      if (lspci.status === 0 && lspci.stdout) {
        const match = lspci.stdout.match(/VGA compatible controller:\s*(.+)/i) || lspci.stdout.match(/3D controller:\s*(.+)/i)
        if (match && match[1]) {
          const name = match[1].trim()
          let vendor: "nvidia" | "apple" | "amd" | "intel" | "unknown" = "unknown"
          const lower = name.toLowerCase()
          if (lower.includes("nvidia")) vendor = "nvidia"
          else if (lower.includes("amd") || lower.includes("radeon")) vendor = "amd"
          else if (lower.includes("intel")) vendor = "intel"
          return { name, vendor }
        }
      }
    } catch {
      // ignore
    }
  }

  return { vendor: "unknown" }
}

import fs from "fs"

function detectFreeDisk(platform: NodeJS.Platform): number {
  try {
    // Native fast statfs in Node.js 18.15+ and Bun (instantaneous, 0ms)
    if (typeof fs.statfsSync === "function") {
      const stats = fs.statfsSync(".")
      const freeBytes = Number(stats.bfree) * Number(stats.bsize)
      if (freeBytes > 0) {
        return Math.round((freeBytes / 1024 / 1024 / 1024) * 10) / 10
      }
    }
  } catch {
    // fallback
  }
  return 50 // Default assumption 50 GB free
}

