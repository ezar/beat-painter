import type { PaintMode, AudioFrame, RenderState } from '../types'
import { modeColor } from './colors'

export const WavesMode: PaintMode = {
  id: 'waves',
  labelKey: 'mode.waves',
  icon: '〰️',
  trailOpacity: 0.04,

  draw(ctx, audio: AudioFrame, state: RenderState) {
    const { volume, low, mid } = audio
    const { frame, hue, width, height, palette } = state

    const lines = 2 + Math.floor(low * 3)
    for (let li = 0; li < lines; li++) {
      const amp   = 20 + volume * 180 + low * 60
      const freq  = 0.012 + mid * 0.025
      const phase = frame * 0.035 + li * 1.1
      const yBase = height * (0.3 + li * 0.2)

      ctx.beginPath()
      for (let x = 0; x <= width; x += 3) {
        const y = yBase + Math.sin(x * freq + phase) * amp
                        * Math.sin(x * freq * 0.4 + phase * 0.6)
        x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
      }
      const alpha = 0.5 + volume * 0.4
      ctx.strokeStyle = modeColor(hue + li * 40, palette, mid * 15, alpha)
      ctx.lineWidth   = 2 + volume * 7 + li * 1
      ctx.stroke()
    }
  },
}
