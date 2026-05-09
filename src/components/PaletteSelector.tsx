import { useTranslation } from 'react-i18next'
import { useCanvasStore } from '../store/canvasStore'
import { PALETTES } from '../modes'

const SWATCH: Record<string, string> = {
  neon: 'from-purple-500 to-cyan-400',
  pastel: 'from-pink-300 to-blue-300',
  bw: 'from-gray-200 to-gray-600',
  sunset: 'from-orange-400 to-red-600',
}

export function PaletteSelector() {
  const { t } = useTranslation()
  const { palette, setPalette } = useCanvasStore()

  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {PALETTES.map((p) => (
        <button
          key={p.id}
          onClick={() => setPalette(p)}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium text-white transition
            bg-gray-800 hover:bg-gray-700 ${
              palette.id === p.id ? 'ring-2 ring-white' : ''
            }`}
        >
          <span
            className={`w-4 h-4 rounded-full bg-gradient-to-r ${SWATCH[p.id] ?? 'from-gray-400 to-gray-600'} flex-shrink-0`}
          />
          {t(p.labelKey)}
        </button>
      ))}
    </div>
  )
}
