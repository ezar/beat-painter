// Audio frame passed to every paint mode on each render tick
export interface AudioFrame {
  volume: number        // 0-1 overall RMS
  low: number           // 0-1 bass energy (bins 0-42)
  mid: number           // 0-1 mid energy  (bins 43-85)
  high: number          // 0-1 treble energy (bins 86-127)
  dataArray: Uint8Array // raw FFT byte data (128 bins)
}

// Render state passed alongside AudioFrame
export interface RenderState {
  frame: number
  hue: number           // 0-360, advances each frame
  width: number
  height: number
  palette: Palette
}

// A paint mode: one visual style
export interface PaintMode {
  id: string
  labelKey: string      // i18n key e.g. "mode.bubbles"
  icon: string          // emoji for the button
  trailOpacity: number  // background fade per frame: 0.02 (slow) – 0.15 (fast)
  draw(
    ctx: CanvasRenderingContext2D,
    audio: AudioFrame,
    state: RenderState
  ): void
}

// Color palette
export interface Palette {
  id: string
  labelKey: string
  hueOffset: number
  saturation: number
  lightnessMin: number
  lightnessMax: number
  monochrome: boolean
}

// A saved artwork in the gallery
export interface Artwork {
  id: string
  createdAt: number     // Date.now()
  dataUrl: string       // PNG base64
  mode: string
  palette: string
}
