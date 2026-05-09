import { useTranslation } from 'react-i18next'
import { useGalleryStore } from '../store/galleryStore'
import { useCanvasStore } from '../store/canvasStore'
import { renderer } from '../canvas/Renderer'

export function SaveButton() {
  const { t } = useTranslation()
  const { addArtwork } = useGalleryStore()
  const { mode, palette } = useCanvasStore()

  function save() {
    const canvas = renderer.getCanvas()
    if (!canvas) return
    const dataUrl = canvas.toDataURL('image/png')
    addArtwork({ dataUrl, mode: mode.id, palette: palette.id })
  }

  return (
    <button
      onClick={save}
      className="flex items-center justify-center gap-2 px-3 py-2 rounded-xl font-semibold text-sm w-full
        bg-green-600 hover:bg-green-700 text-white transition"
    >
      💾 {t('btn.save')}
    </button>
  )
}
