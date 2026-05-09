import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useCanvasStore } from '../store/canvasStore'
import { engine } from '../canvas/Renderer'

interface Props {
  onError: (msg: string) => void
}

export function MicButton({ onError }: Props) {
  const { t } = useTranslation()
  const { isRecording, setRecording } = useCanvasStore()
  const [loading, setLoading] = useState(false)

  async function toggle() {
    if (isRecording) {
      engine.stop()
      setRecording(false)
      return
    }
    setLoading(true)
    try {
      await engine.start()
      setRecording(true)
    } catch (err: unknown) {
      const name = err instanceof DOMException ? err.name : ''
      const msg =
        name === 'NotAllowedError' || name === 'PermissionDeniedError'
          ? t('mic.permission_denied')
          : t('mic.not_supported')
      onError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={() => void toggle()}
      disabled={loading}
      className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm transition
        disabled:opacity-50 ${
          isRecording
            ? 'bg-red-500 hover:bg-red-600 text-white'
            : 'bg-purple-600 hover:bg-purple-700 text-white'
        }`}
    >
      {isRecording ? '⏹️' : '🎤'}
      {loading ? '…' : isRecording ? t('btn.stop') : t('btn.paint')}
    </button>
  )
}
