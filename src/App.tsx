import { useCallback, useEffect, useState } from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Canvas } from './components/Canvas'
import { VolumeBar } from './components/VolumeBar'
import { MicButton } from './components/MicButton'
import { ModeSelector } from './components/ModeSelector'
import { PaletteSelector } from './components/PaletteSelector'
import { SaveButton } from './components/SaveButton'
import { ShareButton } from './components/ShareButton'
import { Gallery } from './components/Gallery'
import { useGalleryStore } from './store/galleryStore'
import { renderer } from './canvas/Renderer'
import type { AudioFrame } from './types'

const LANGS = ['es', 'ca', 'en'] as const

function MainPage() {
  const { t, i18n } = useTranslation()
  const [volume, setVolume] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const { notification, clearNotification } = useGalleryStore()

  const handleFrame = useCallback((audio: AudioFrame) => {
    setVolume(audio.volume)
  }, [])

  useEffect(() => {
    if (!notification) return
    const tid = setTimeout(clearNotification, 3000)
    return () => clearTimeout(tid)
  }, [notification, clearNotification])

  function cycleLang() {
    const idx = LANGS.indexOf(i18n.language as (typeof LANGS)[number])
    void i18n.changeLanguage(LANGS[(idx + 1) % LANGS.length])
  }

  return (
    <div
      className="h-svh bg-[#0a0a10] text-white flex flex-col select-none"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-2 border-b border-gray-800 flex-shrink-0">
        <h1 className="text-lg font-bold tracking-tight bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          beat-painter
        </h1>
        <div className="flex gap-2">
          <button
            onClick={cycleLang}
            className="px-2 py-1 rounded-lg bg-gray-800 hover:bg-gray-700 text-xs transition"
          >
            🌐 {i18n.language.toUpperCase()}
          </button>
          <Link
            to="/gallery"
            className="px-2 py-1 rounded-lg bg-gray-800 hover:bg-gray-700 text-xs transition"
          >
            🖼️ {t('btn.gallery')}
          </Link>
        </div>
      </header>

      {/* Canvas — direct flex child so its own div carries flex-1 */}
      <Canvas onFrame={handleFrame} />

      {/* Volume bar */}
      <div className="px-4 py-1.5 flex-shrink-0">
        <VolumeBar volume={volume} />
      </div>

      {/* Notifications */}
      {notification && (
        <div className="mx-4 mb-1 px-3 py-2 rounded-lg bg-green-900/60 border border-green-700 text-green-300 text-sm text-center">
          {t(notification)}
        </div>
      )}
      {error && (
        <div className="mx-4 mb-1 px-3 py-2 rounded-lg bg-red-900/60 border border-red-700 text-red-300 text-sm">
          {error}
          <button onClick={() => setError(null)} className="ml-2 underline text-xs">
            ×
          </button>
        </div>
      )}

      {/* Action buttons — 2×2 grid so nothing wraps on narrow phones */}
      <div className="grid grid-cols-2 gap-2 px-4 py-1.5 flex-shrink-0">
        <MicButton onError={setError} />
        <button
          onClick={() => renderer.clear()}
          className="flex items-center justify-center gap-2 px-3 py-2 rounded-xl font-semibold text-sm
            bg-gray-700 hover:bg-gray-600 text-white transition w-full"
        >
          🗑️ {t('btn.clear')}
        </button>
        <SaveButton />
        <ShareButton />
      </div>

      {/* Mode selector */}
      <div className="px-4 py-1.5 flex-shrink-0">
        <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1 text-center">{t('section.mode')}</p>
        <ModeSelector />
      </div>

      {/* Palette selector */}
      <div className="px-4 pb-3 flex-shrink-0">
        <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1 text-center">{t('section.palette')}</p>
        <PaletteSelector />
      </div>
    </div>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="/gallery" element={<Gallery />} />
    </Routes>
  )
}
