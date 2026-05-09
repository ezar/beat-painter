import type { PaintMode, AudioFrame, RenderState } from '../types'
import { modeColor } from './colors'

export const BubblesMode: PaintMode = {
  id: 'bubbles',
  labelKey: 'mode.bubbles',
  icon: '🫧',
  trailOpacity: 0.07,

  draw(ctx, audio: AudioFrame, state: RenderState) {
    const { volume, low, mid, high, } = audio
    const { hue, width, height, palette } = state

    const count = 1 + Math.floor(volume * 4 + high * 3)

    for (let i = 0; i < count; i++) {
      const cx = width  / 2 + (Math.random() - 0.5) * width  * (0.3 + volume * 0.7)
      const cy = height / 2 + (Math.random() - 0.5) * height * (0.3 + volume * 0.7)
      const r  = 6 + volume * 100 + low * 50 + Math.random() * 20

      const h = hue + high * 160 + i * 25
      const boost = mid * 20
      const alpha = 0.4 + volume * 0.5

      ctx.beginPath()
      ctx.arc(cx, cy, r, 0, Math.PI * 2)
      ctx.fillStyle = modeColor(h, palette, boost, alpha)
      ctx.fill()

      // rim highlight
      ctx.strokeStyle = modeColor(h + 20, palette, 15, alpha * 0.6)
      ctx.lineWidth = 1.5
      ctx.stroke()
    }
  },
}
