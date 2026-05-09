import type { Palette } from '../types'

export function modeColor(
  hue: number,
  palette: Palette,
  lightnessBoost = 0,
  alpha = 1,
): string {
  if (palette.monochrome) {
    const l = Math.min(
      100,
      Math.round(
        palette.lightnessMin +
          (palette.lightnessMax - palette.lightnessMin) * 0.5 +
          lightnessBoost,
      ),
    )
    return `hsla(0,0%,${l}%,${alpha})`
  }
  const h =
    palette.id === 'sunset'
      ? ((hue % 60) + palette.hueOffset + 360) % 360
      : (hue + palette.hueOffset + 360) % 360
  const l = Math.min(palette.lightnessMax, palette.lightnessMin + lightnessBoost)
  return `hsla(${Math.round(h)},${palette.saturation}%,${Math.round(l)}%,${alpha})`
}
