import type { AudioFrame } from '../types'

const FFT_SIZE = 256
const BIN_COUNT = FFT_SIZE / 2  // 128 bins

const LOW_END  = 42
const MID_END  = 85

export class AudioEngine {
  private ctx: AudioContext | null = null
  private analyser: AnalyserNode | null = null
  private source: MediaStreamAudioSourceNode | null = null
  private stream: MediaStream | null = null
  private data: Uint8Array = new Uint8Array(BIN_COUNT)

  async start(): Promise<void> {
    this.stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false })
    this.ctx = new AudioContext()
    this.analyser = this.ctx.createAnalyser()
    this.analyser.fftSize = FFT_SIZE
    this.analyser.smoothingTimeConstant = 0.8
    this.source = this.ctx.createMediaStreamSource(this.stream)
    this.source.connect(this.analyser)
    this.data = new Uint8Array(this.analyser.frequencyBinCount)
  }

  stop(): void {
    this.source?.disconnect()
    this.stream?.getTracks().forEach(t => t.stop())
    this.ctx?.close()
    this.ctx = null
    this.analyser = null
    this.source = null
    this.stream = null
  }

  isRunning(): boolean {
    return this.ctx !== null && this.ctx.state === 'running'
  }

  getFrame(): AudioFrame {
    if (!this.analyser) return this.silentFrame()

    this.analyser.getByteFrequencyData(this.data)

    const volume = this.bandAvg(0, BIN_COUNT - 1)
    const low    = this.bandAvg(0, LOW_END)
    const mid    = this.bandAvg(LOW_END + 1, MID_END)
    const high   = this.bandAvg(MID_END + 1, BIN_COUNT - 1)

    return { volume, low, mid, high, dataArray: this.data }
  }

  private bandAvg(start: number, end: number): number {
    let sum = 0
    for (let i = start; i <= end; i++) sum += this.data[i]
    return sum / ((end - start + 1) * 255)
  }

  private silentFrame(): AudioFrame {
    return { volume: 0, low: 0, mid: 0, high: 0, dataArray: this.data }
  }
}

// Demo audio: fake sinusoidal data for when mic is not active
export function demoFrame(frame: number): AudioFrame {
  const t = frame * 0.025
  const volume = 0.1 + 0.07 * Math.sin(t * 1.3) + 0.04 * Math.cos(t * 2.9)
  const low    = 0.15 + 0.1  * Math.sin(t * 0.7)
  const mid    = 0.10 + 0.09 * Math.cos(t * 1.1)
  const high   = 0.08 + 0.07 * Math.sin(t * 2.3)
  const data   = new Uint8Array(128).fill(0)
  return { volume, low, mid, high, dataArray: data }
}
