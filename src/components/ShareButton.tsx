import { useTranslation } from 'react-i18next'
import { renderer } from '../canvas/Renderer'

export function ShareButton() {
  const { t } = useTranslation()

  function share() {
    const canvas = renderer.getCanvas()
    if (!canvas) return

    canvas.toBlob((blob) => {
      if (!blob) return
      const file = new File([blob], 'beat-painter.png', { type: 'image/png' })

      if (navigator.canShare?.({ files: [file] })) {
        void navigator.share({ files: [file], title: 'beat-painter' }).catch(() => {
          void copyToClipboard(blob)
        })
      } else {
        void copyToClipboard(blob)
      }
    }, 'image/png')
  }

  async function copyToClipboard(blob: Blob) {
    try {
      await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })])
    } catch {
      // silently fail — clipboard API not available
    }
  }

  return (
    <button
      onClick={share}
      className="flex items-center justify-center gap-2 px-3 py-2 rounded-xl font-semibold text-sm w-full
        bg-blue-600 hover:bg-blue-700 text-white transition"
    >
      📤 {t('btn.share')}
    </button>
  )
}
