import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useCanvasStore } from '../store/canvasStore'
import { renderer } from '../canvas/Renderer'
import type { AudioFrame } from '../types'

interface Props {
  onFrame: (audio: AudioFrame) => void
}

export function Canvas({ onFrame }: Props) {
  const { t } = useTranslation()
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const onFrameRef = useRef(onFrame)
  const { mode, palette, isRecording } = useCanvasStore()

  useEffect(() => {
    onFrameRef.current = onFrame
  }, [onFrame])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    renderer.attach(canvas)
    renderer.setOnFrame((audio) => onFrameRef.current(audio))
    renderer.start()
  }, [])

  useEffect(() => {
    renderer.setMode(mode)
  }, [mode])

  useEffect(() => {
    renderer.setPalette(palette)
  }, [palette])

  useEffect(() => {
    const container = containerRef.current
    const canvas = canvasRef.current
    if (!container || !canvas) return
    const ro = new ResizeObserver(() => {
      canvas.width = container.clientWidth
      canvas.height = container.clientHeight
    })
    ro.observe(container)
    return () => ro.disconnect()
  }, [])

  return (
    <div ref={containerRef} className="flex-1 min-h-0 relative bg-[#0a0a10]">
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />
      {!isRecording && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap px-3 py-1 bg-black/60 rounded-full text-xs text-gray-400 pointer-events-none">
          {t('demo.label')}
        </div>
      )}
    </div>
  )
}
