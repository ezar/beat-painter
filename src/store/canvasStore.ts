import { create } from 'zustand'
import { MODES, PALETTES } from '../modes'
import type { PaintMode, Palette } from '../types'

interface CanvasState {
  mode: PaintMode
  palette: Palette
  isRecording: boolean
  setMode: (mode: PaintMode) => void
  setPalette: (palette: Palette) => void
  setRecording: (v: boolean) => void
}

export const useCanvasStore = create<CanvasState>()((set) => ({
  mode: MODES[0],
  palette: PALETTES[0],
  isRecording: false,
  setMode: (mode) => set({ mode }),
  setPalette: (palette) => set({ palette }),
  setRecording: (isRecording) => set({ isRecording }),
}))
