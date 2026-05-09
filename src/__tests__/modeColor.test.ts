import { describe, it, expect } from 'vitest'
import { modeColor } from '../modes/colors'
import { PALETTES } from '../modes'

describe('modeColor', () => {
  it('returns an hsla string for the neon palette', () => {
    const neon = PALETTES.find((p) => p.id === 'neon')!
    const color = modeColor(0, neon)
    expect(color).toMatch(/^hsla\(/)
  })

  it('returns grayscale (hue=0) for the monochrome palette', () => {
    const bw = PALETTES.find((p) => p.id === 'bw')!
    const color = modeColor(180, bw)
    expect(color).toContain('hsla(0,0%,')
  })

  it('includes alpha in the output', () => {
    const neon = PALETTES.find((p) => p.id === 'neon')!
    const color = modeColor(0, neon, 0, 0.5)
    expect(color).toMatch(/,0\.5\)$/)
  })

  it('clamps lightness to lightnessMax', () => {
    const pastel = PALETTES.find((p) => p.id === 'pastel')!
    // very large boost should still stay within lightnessMax
    const color = modeColor(0, pastel, 999)
    const l = parseInt(color.match(/,(\d+)%,/)![1])
    expect(l).toBeLessThanOrEqual(pastel.lightnessMax)
  })

  it('constrains hue for the sunset palette', () => {
    const sunset = PALETTES.find((p) => p.id === 'sunset')!
    for (let h = 0; h < 360; h += 30) {
      const color = modeColor(h, sunset)
      expect(color).toMatch(/^hsla\(/)
      const hVal = parseInt(color.match(/hsla\((\d+),/)![1])
      expect(hVal).toBeGreaterThanOrEqual(0)
      expect(hVal).toBeLessThan(60)
    }
  })
})
