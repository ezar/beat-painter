import type { PaintMode, AudioFrame, RenderState } from '../types'
import { modeColor } from './colors'

// ─── Petals ─────────────────────────────────────────────────────────────────

export const PetalsMode: PaintMode = {
  id: 'petals',
  labelKey: 'mode.petals',
  icon: '🌸',
  trailOpacity: 0.03,

  draw(ctx, audio: AudioFrame, state: RenderState) {
    const { volume, low, mid } = audio
    const { frame, hue, width, height, palette } = state

    const cx     = width  / 2
    const cy     = height / 2
    const petals = 4 + Math.floor(low * 6)
    const r      = 20 + volume * 130 + mid * 50

    ctx.save()
    ctx.translate(cx, cy)
    ctx.rotate(frame * 0.008 + low * 0.05)

    for (let i = 0; i < petals; i++) {
      const angle = (i / petals) * Math.PI * 2
      ctx.save()
      ctx.rotate(angle)
      ctx.beginPath()
      ctx.ellipse(0, -r / 2, r * 0.28 + mid * 18, r / 2, 0, 0, Math.PI * 2)
      const alpha = 0.4 + volume * 0.45
      ctx.fillStyle = modeColor(hue + (i / petals) * 90, palette, mid * 15, alpha)
      ctx.fill()
      ctx.restore()
    }

    // center dot
    ctx.beginPath()
    ctx.arc(0, 0, 8 + volume * 25, 0, Math.PI * 2)
    ctx.fillStyle = modeColor(hue + 60, palette, 15, 0.85)
    ctx.fill()
    ctx.restore()
  },
}

// ─── Rain ────────────────────────────────────────────────────────────────────

interface Drop { x: number; y: number; speed: number; len: number; alpha: number }
const drops: Drop[] = Array.from({ length: 120 }, () => ({
  x: Math.random(),
  y: Math.random(),
  speed: 0.004 + Math.random() * 0.008,
  len:   0.04  + Math.random() * 0.06,
  alpha: 0.3   + Math.random() * 0.5,
}))

export const RainMode: PaintMode = {
  id: 'rain',
  labelKey: 'mode.rain',
  icon: '🌧️',
  trailOpacity: 0.08,

  draw(ctx, audio: AudioFrame, state: RenderState) {
    const { volume, high } = audio
    const { hue, width, height, palette } = state

    const speedMult = 1 + volume * 5 + high * 4

    for (const drop of drops) {
      drop.y += drop.speed * speedMult
      if (drop.y > 1 + drop.len) { drop.y = -drop.len; drop.x = Math.random() }

      const x  = drop.x * width
      const y1 = drop.y * height
      const y2 = y1 + drop.len * height * (1 + volume)

      ctx.beginPath()
      ctx.moveTo(x, y1)
      ctx.lineTo(x, y2)
      ctx.strokeStyle = modeColor(hue + high * 80, palette, 10, drop.alpha * (0.5 + volume * 0.5))
      ctx.lineWidth   = 1 + volume * 2
      ctx.stroke()
    }
  },
}

// ─── Galaxy ──────────────────────────────────────────────────────────────────

export const GalaxyMode: PaintMode = {
  id: 'galaxy',
  labelKey: 'mode.galaxy',
  icon: '🌌',
  trailOpacity: 0.025,

  draw(ctx, audio: AudioFrame, state: RenderState) {
    const { volume, low, mid, high } = audio
    const { frame, hue, width, height, palette } = state

    const cx = width  / 2
    const cy = height / 2
    const n  = 6 + Math.floor(volume * 30 + high * 20)

    for (let i = 0; i < n; i++) {
      const angle = (i / n) * Math.PI * 2 + frame * (0.005 + volume * 0.02)
      const dist  = 20 + Math.random() * (80 + volume * 180 + low * 80)
      const spread = 12 + mid * 30
      const x     = cx + Math.cos(angle) * dist + (Math.random() - 0.5) * spread
      const y     = cy + Math.sin(angle) * dist * 0.55 + (Math.random() - 0.5) * spread

      const r     = 1 + volume * 5 + Math.random() * 4
      const alpha = 0.4 + volume * 0.55

      ctx.beginPath()
      ctx.arc(x, y, r, 0, Math.PI * 2)
      ctx.fillStyle = modeColor(hue + angle * 30, palette, high * 20, alpha)
      ctx.fill()
    }

    // core glow
    ctx.beginPath()
    ctx.arc(cx, cy, 4 + volume * 20, 0, Math.PI * 2)
    ctx.fillStyle = modeColor(hue, palette, 20, 0.7 + volume * 0.3)
    ctx.fill()
  },
}

// ─── Lava ────────────────────────────────────────────────────────────────────

interface Blob { x: number; y: number; vx: number; vy: number; r: number }
const blobs: Blob[] = Array.from({ length: 7 }, (_, i) => ({
  x:  100 + i * 80,
  y:  150 + Math.random() * 100,
  vx: (Math.random() - 0.5) * 0.6,
  vy: (Math.random() - 0.5) * 0.4,
  r:  40 + Math.random() * 50,
}))

export const LavaMode: PaintMode = {
  id: 'lava',
  labelKey: 'mode.lava',
  icon: '🌋',
  trailOpacity: 0.02,

  draw(ctx, audio: AudioFrame, state: RenderState) {
    const { volume, low, mid } = audio
    const { hue, width, height, palette } = state

    const speedMult = 0.5 + low * 3 + volume * 2

    for (const blob of blobs) {
      blob.x += blob.vx * speedMult
      blob.y += blob.vy * speedMult
      if (blob.x < -blob.r)       blob.x = width  + blob.r
      if (blob.x > width  + blob.r) blob.x = -blob.r
      if (blob.y < -blob.r)       blob.y = height + blob.r
      if (blob.y > height + blob.r) blob.y = -blob.r

      const r     = blob.r * (0.8 + volume * 0.6 + low * 0.5)
      const alpha = 0.35 + volume * 0.4 + mid * 0.15

      ctx.beginPath()
      ctx.arc(blob.x, blob.y, r, 0, Math.PI * 2)
      ctx.fillStyle = modeColor(hue + blob.x * 0.1, palette, 0, alpha)
      ctx.fill()
    }
  },
}
