import type { PaintMode, Palette } from '../types'
import { BubblesMode } from './Bubbles'
import { WavesMode } from './Waves'
import { StarsMode } from './Stars'
import { PetalsMode } from './Petals'
import { RainMode } from './Rain'
import { GalaxyMode } from './Galaxy'
import { LavaMode } from './Lava'

export const MODES: PaintMode[] = [
  BubblesMode,
  WavesMode,
  StarsMode,
  PetalsMode,
  RainMode,
  GalaxyMode,
  LavaMode,
]

export const PALETTES: Palette[] = [
  {
    id: 'neon',
    labelKey: 'palette.neon',
    hueOffset: 0,
    saturation: 90,
    lightnessMin: 50,
    lightnessMax: 70,
    monochrome: false,
  },
  {
    id: 'pastel',
    labelKey: 'palette.pastel',
    hueOffset: 30,
    saturation: 60,
    lightnessMin: 72,
    lightnessMax: 88,
    monochrome: false,
  },
  {
    id: 'bw',
    labelKey: 'palette.bw',
    hueOffset: 0,
    saturation: 0,
    lightnessMin: 40,
    lightnessMax: 90,
    monochrome: true,
  },
  {
    id: 'sunset',
    labelKey: 'palette.sunset',
    hueOffset: 0,
    saturation: 85,
    lightnessMin: 50,
    lightnessMax: 70,
    monochrome: false,
  },
]

// Helper used by all modes
export function modeColor(
  hue: number,
  palette: Palette,
  lightnessBoost = 0,
  alpha = 1
): string {
  if (palette.monochrome) {
    const l = Math.round(
      palette.lightnessMin + (palette.lightnessMax - palette.lightnessMin) * 0.5 + lightnessBoost
    )
    return `hsla(0,0%,${l}%,${alpha})`
  }
  // Sunset palette constrains hue to warm range
  const h = palette.id === 'sunset'
    ? ((hue % 60) + palette.hueOffset + 360) % 360
    : (hue + palette.hueOffset + 360) % 360
  const l = Math.min(
    palette.lightnessMax,
    palette.lightnessMin + lightnessBoost
  )
  return `hsla(${Math.round(h)},${palette.saturation}%,${Math.round(l)}%,${alpha})`
}
