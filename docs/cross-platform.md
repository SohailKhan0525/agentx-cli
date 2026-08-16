# Cross-Platform Compatibility Guide

AgentX is engineered to deliver a seamless, native experience across all major operating systems, shells, and terminal emulators.

---

## 🖥️ Operating Systems

### 1. Windows
- **Supported Versions**: Windows 10 (1809+) & Windows 11 (x64 and ARM64)
- **Supported Shells**: PowerShell 5.1+, PowerShell 7+, Windows Terminal, Command Prompt (`cmd.exe`), Git Bash, WSL2
- **Key Features**:
  - Native Windows binary execution (`agentx.exe`)
  - Full UTF-8 box-drawing and ANSI 24-bit TrueColor rendering in Windows Terminal
  - Cross-platform path normalization (`\` and `/`)
  - Hardware feature detection for AVX2 and CUDA

---

### 2. macOS
- **Supported Versions**: macOS 12+ (Monterey, Ventura, Sonoma, Sequoia)
- **Supported Architectures**: Apple Silicon (M1/M2/M3/M4 ARM64) and Intel (x64)
- **Supported Shells**: zsh, bash, fish
- **Supported Terminals**: macOS Terminal, iTerm2, Alacritty, Ghostty, Warp, WezTerm
- **Key Features**:
  - Native Metal GPU acceleration discovery for local models
  - Apple Silicon optimized single-binaries

---

### 3. Linux
- **Supported Distributions**: Ubuntu, Debian, Arch Linux, Fedora, RHEL, CentOS, Alpine Linux
- **Supported Architectures**: x64, ARM64 (aarch64)
- **C Libraries**: Both `glibc` and `musl` (Alpine) natively supported
- **Supported Shells**: bash, zsh, fish, ash, sh
- **Key Features**:
  - Headless server mode (`agentx serve`)
  - CI/CD integration (`agentx run`)
  - High-performance system call polling
