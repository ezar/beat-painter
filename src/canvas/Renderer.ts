import { AudioEngine, demoFrame } from '../audio/AudioEngine'
import { drawBackground } from './Background'
import type { PaintMode, Palette, AudioFrame } from '../types'

export class Renderer {
  private rafId = 0
  private frame = 0
  private hue = 0
  private canvas: HTMLCanvasElement | null = null
  private ctx: CanvasRenderingContext2D | null = null
  private _mode: PaintMode | null = null
  private _palette: Palette | null = null
  private _onFrame: ((audio: AudioFrame) => void) | null = null

  constructor(private readonly engine: AudioEngine) {}

  attach(canvas: HTMLCanvasElement): void {
    this.canvas = canvas
    this.ctx = canvas.getContext('2d')
    this.clear()
  }

  setMode(mode: PaintMode): void {
    this._mode = mode
  }

  setPalette(palette: Palette): void {
    this._palette = palette
  }

  setOnFrame(cb: (audio: AudioFrame) => void): void {
    this._onFrame = cb
  }

  getCanvas(): HTMLCanvasElement | null {
    return this.canvas
  }

  start(): void {
    if (this.rafId) return
    const tick = () => {
      this.rafId = requestAnimationFrame(tick)
      this._tick()
    }
    this.rafId = requestAnimationFrame(tick)
  }

  stop(): void {
    cancelAnimationFrame(this.rafId)
    this.rafId = 0
  }

  clear(): void {
    if (!this.ctx || !this.canvas) return
    this.ctx.fillStyle = 'rgb(10,10,16)'
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)
  }

  private _tick(): void {
    const { ctx, canvas } = this
    const mode = this._mode
    const palette = this._palette
    if (!ctx || !canvas || !mode || !palette) return

    const audio = this.engine.isRunning() ? this.engine.getFrame() : demoFrame(this.frame)
    this._onFrame?.(audio)

    drawBackground(ctx, canvas.width, canvas.height, mode.trailOpacity)
    this.hue = (this.hue + 0.3 + audio.volume * 1.5) % 360
    mode.draw(ctx, audio, {
      frame: this.frame,
      hue: this.hue,
      width: canvas.width,
      height: canvas.height,
      palette,
    })
    this.frame++
  }
}

export const engine = new AudioEngine()
export const renderer = new Renderer(engine)
