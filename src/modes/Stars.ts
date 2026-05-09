import type { PaintMode, AudioFrame, RenderState } from '../types'
import { modeColor } from './colors'

export const StarsMode: PaintMode = {
  id: 'stars',
  labelKey: 'mode.stars',
  icon: '⭐',
  trailOpacity: 0.06,

  draw(ctx, audio: AudioFrame, state: RenderState) {
    const { volume, low, mid, high } = audio
    const { frame, hue, width, height, palette } = state

    const count  = 1 + Math.floor(high * 6 + volume * 3)
    const spikes = 4 + Math.floor(low * 5)

    for (let i = 0; i < count; i++) {
      const x = Math.random() * width
      const y = Math.random() * height
      const r = 4 + volume * 50 + Math.random() * 25 * mid

      ctx.save()
      ctx.translate(x, y)
      ctx.rotate(frame * 0.04 + i * 1.3)

      ctx.beginPath()
      for (let s = 0; s < spikes * 2; s++) {
        const angle = (s / (spikes * 2)) * Math.PI * 2
        const rad   = s % 2 === 0 ? r : r * 0.38
        const px    = Math.cos(angle) * rad
        const py    = Math.sin(angle) * rad
        s === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py)
      }
      ctx.closePath()

      const alpha = 0.5 + volume * 0.45
      ctx.fillStyle = modeColor(hue + i * 35 + high * 180, palette, mid * 20, alpha)
      ctx.fill()
      ctx.restore()
    }
  },
}
