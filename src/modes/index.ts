import type { PaintMode, Palette } from '../types'
import { BubblesMode } from './Bubbles'
import { WavesMode } from './Waves'
import { StarsMode } from './Stars'
import { PetalsMode, RainMode, GalaxyMode, LavaMode } from './OtherModes'

export { modeColor } from './colors'

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
