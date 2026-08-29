import * as fs from "node:fs"
import * as path from "node:path"

const FONT: Record<string, string[]> = {
  A: ["01110", "10001", "11111", "10001", "10001"],
  G: ["01111", "10000", "10111", "10001", "01110"],
  E: ["11111", "10000", "11110", "10000", "11111"],
  N: ["10001", "11001", "10101", "10011", "10001"],
  T: ["11111", "00100", "00100", "00100", "00100"],
  X: ["10001", "01010", "00100", "01010", "10001"],
  " ": ["00", "00", "00", "00", "00"],
  C: ["01111", "10000", "10000", "10000", "01111"],
  O: ["01110", "10001", "10001", "10001", "01110"],
  D: ["11110", "10001", "10001", "10001", "11110"],
}

const DETECTIVE = [
  "00000001111110000000",
  "00000111111111100000",
  "00001111111111110000",
  "00011111111111111000",
  "00111111111111111100",
  "11111111111111111111",
  "00000111111111000000",
  "00001111111111100000",
  "00011000011000011000",
  "00011000011000011000",
  "00011111111111111000",
  "00000111111111000000",
  "00000011111100000000",
  "00011101111011100000",
  "00111110110111110000",
  "01111111001111111000",
  "11111111111111111100",
  "11110011111100111100",
  "11100001111000011100",
  "11000000110000001100",
]

export function generateBadgeSvg(fgColor = "#FFE600", bgColor = "#000000") {
  const pixelSize = 4
  const paddingX = 24
  const paddingY = 18

  const rects: string[] = []

  // Render Detective
  for (let r = 0; r < DETECTIVE.length; r++) {
    for (let c = 0; c < DETECTIVE[r].length; c++) {
      if (DETECTIVE[r][c] === "1") {
        rects.push(
          `<rect x="${paddingX + c * pixelSize}" y="${paddingY + r * pixelSize}" width="${pixelSize}" height="${pixelSize}" fill="${fgColor}"/>`,
        )
      }
    }
  }

  // Render Text: AGENTX CODE
  const textStartX = paddingX + 24 * pixelSize
  const textStartY = paddingY + 2 * pixelSize
  const textScale = 3

  let curX = textStartX
  const text = "AGENTX CODE"
  for (const char of text) {
    const glyph = FONT[char] || FONT[" "]
    for (let r = 0; r < glyph.length; r++) {
      for (let c = 0; c < glyph[r].length; c++) {
        if (glyph[r][c] === "1") {
          rects.push(
            `<rect x="${curX + c * textScale * pixelSize}" y="${textStartY + r * textScale * pixelSize}" width="${textScale * pixelSize}" height="${textScale * pixelSize}" fill="${fgColor}"/>`,
          )
        }
      }
    }
    curX += (glyph[0].length + 1) * textScale * pixelSize
  }

  const totalWidth = curX + paddingX
  const totalHeight = paddingY * 2 + DETECTIVE.length * pixelSize

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${totalWidth} ${totalHeight}" width="100%" height="100%">
  <rect x="2" y="2" width="${totalWidth - 4}" height="${totalHeight - 4}" rx="14" ry="14" fill="${bgColor}" stroke="${fgColor}" stroke-width="5"/>
  <rect x="7" y="7" width="${totalWidth - 14}" height="${totalHeight - 14}" rx="10" ry="10" fill="none" stroke="${fgColor}" stroke-width="1.5" opacity="0.4"/>
  ${rects.join("\n  ")}
</svg>`
}

export function generateIconOnlySvg(fgColor = "#FFE600", bgColor = "#000000") {
  const pixelSize = 6
  const padding = 16
  const rects: string[] = []

  for (let r = 0; r < DETECTIVE.length; r++) {
    for (let c = 0; c < DETECTIVE[r].length; c++) {
      if (DETECTIVE[r][c] === "1") {
        rects.push(
          `<rect x="${padding + c * pixelSize}" y="${padding + r * pixelSize}" width="${pixelSize}" height="${pixelSize}" fill="${fgColor}"/>`,
        )
      }
    }
  }

  const totalSize = padding * 2 + 20 * pixelSize
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${totalSize} ${totalSize}" width="100%" height="100%">
  <rect x="2" y="2" width="${totalSize - 4}" height="${totalSize - 4}" rx="12" ry="12" fill="${bgColor}" stroke="${fgColor}" stroke-width="4"/>
  ${rects.join("\n  ")}
</svg>`
}

const darkSvg = generateBadgeSvg("#FFE600", "#000000")
const lightSvg = generateBadgeSvg("#1A1A1A", "#FFE600")
const iconDarkSvg = generateIconOnlySvg("#FFE600", "#000000")
const iconLightSvg = generateIconOnlySvg("#1A1A1A", "#FFE600")

const targetFiles = [
  { path: "packages/web/src/assets/logo-dark.svg", content: darkSvg },
  { path: "packages/web/src/assets/logo-light.svg", content: lightSvg },
  { path: "packages/web/src/assets/logo-ornate-dark.svg", content: darkSvg },
  { path: "packages/web/src/assets/logo-ornate-light.svg", content: lightSvg },
  { path: "packages/web/public/favicon.svg", content: iconDarkSvg },
  { path: "packages/web/public/favicon-v3.svg", content: iconDarkSvg },
  { path: "packages/ui/src/assets/icons/provider/agentx.svg", content: iconDarkSvg },
  { path: "sdks/vscode/images/button-dark.svg", content: darkSvg },
  { path: "sdks/vscode/images/button-light.svg", content: lightSvg },
]

for (const target of targetFiles) {
  const dir = path.dirname(target.path)
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
  fs.writeFileSync(target.path, target.content)
  console.log(`Generated: ${target.path}`)
}
