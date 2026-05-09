import { describe, it, expect } from 'vitest'
import { demoFrame } from '../audio/AudioEngine'

describe('demoFrame', () => {
  it('returns all values in the [0, 1] range for many frames', () => {
    for (let i = 0; i < 200; i++) {
      const f = demoFrame(i)
      expect(f.volume).toBeGreaterThanOrEqual(0)
      expect(f.volume).toBeLessThanOrEqual(1)
      expect(f.low).toBeGreaterThanOrEqual(0)
      expect(f.low).toBeLessThanOrEqual(1)
      expect(f.mid).toBeGreaterThanOrEqual(0)
      expect(f.mid).toBeLessThanOrEqual(1)
      expect(f.high).toBeGreaterThanOrEqual(0)
      expect(f.high).toBeLessThanOrEqual(1)
    }
  })

  it('returns a dataArray of length 128', () => {
    const f = demoFrame(0)
    expect(f.dataArray).toHaveLength(128)
  })
})
