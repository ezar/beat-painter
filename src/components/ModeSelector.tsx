import { useTranslation } from 'react-i18next'
import { useCanvasStore } from '../store/canvasStore'
import { MODES } from '../modes'

export function ModeSelector() {
  const { t } = useTranslation()
  const { mode, setMode } = useCanvasStore()

  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {MODES.map((m) => (
        <button
          key={m.id}
          onPointerDown={() => console.log('[MODE] pointerdown:', m.id)}
          onClick={() => {
            console.log('[MODE] click:', m.id)
            setMode(m)
          }}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition
            ${
              mode.id === m.id
                ? 'bg-white text-gray-900'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
        >
          <span>{m.icon}</span>
          <span>{t(m.labelKey)}</span>
        </button>
      ))}
    </div>
  )
}
