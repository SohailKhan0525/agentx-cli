// design-system.ts
// AgentX Design System — Black and White ONLY
// Apply ALL rules from frontend-ui-ux-wizard and ui-ux-pro-max skills
// NO other colors anywhere in the codebase

import chalk from 'chalk'

// ═══════════════════════════════════════
// COLORS — white and gray ONLY
// NO cyan, blue, green, red, yellow, magenta
// Visual hierarchy via bold and dim ONLY
// ═══════════════════════════════════════
export const color = {
  primary:  (t: string) => chalk.white(t),
  bold:     (t: string) => chalk.bold.white(t),
  dim:      (t: string) => chalk.dim(t),
  dimBold:  (t: string) => chalk.dim.bold(t),
}

// ═══════════════════════════════════════
// ICONS — safe on ALL terminals (Windows cmd, PowerShell, macOS, Linux)
// ═══════════════════════════════════════
export const icon = {
  prompt:  '❯',
  success: '✓',
  error:   '✗',
  info:    '→',
  wait:    '○',
  dot:     '·',
  arrow:   '↳',
  star:    '⭐',
  confirm: '◆',
}

// ═══════════════════════════════════════
// SPINNER FRAMES — safe on Windows cmd
// ═══════════════════════════════════════
export const spinnerFrames = ['⠋','⠙','⠹','⠸','⠼','⠴','⠦','⠧','⠇','⠏']
export const spinnerInterval = 80
