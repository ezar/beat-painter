import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { useGalleryStore } from '../store/galleryStore'

export function Gallery() {
  const { t } = useTranslation()
  const { artworks, deleteArtwork } = useGalleryStore()
  const [confirmId, setConfirmId] = useState<string | null>(null)

  function handleDelete(id: string) {
    deleteArtwork(id)
    setConfirmId(null)
  }

  return (
    <div className="min-h-screen bg-[#0a0a10] text-white p-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Link
            to="/"
            className="px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-sm transition"
          >
            ← {t('btn.back')}
          </Link>
          <h1 className="text-xl font-bold">{t('gallery.title')}</h1>
        </div>

        {artworks.length === 0 ? (
          <p className="text-gray-400 text-center py-16">{t('gallery.empty')}</p>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {[...artworks].reverse().map((artwork) => (
              <div
                key={artwork.id}
                className="relative group rounded-xl overflow-hidden bg-gray-900"
              >
                <img
                  src={artwork.dataUrl}
                  alt=""
                  className="w-full aspect-video object-cover"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex flex-col items-center justify-center gap-2 p-2">
                  {confirmId === artwork.id ? (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleDelete(artwork.id)}
                        className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-sm text-white transition"
                      >
                        {t('gallery.delete')}
                      </button>
                      <button
                        onClick={() => setConfirmId(null)}
                        className="px-3 py-1.5 rounded-lg bg-gray-700 hover:bg-gray-600 text-sm text-white transition"
                      >
                        {t('gallery.cancel')}
                      </button>
                    </div>
                  ) : (
                    <>
                      <a
                        href={artwork.dataUrl}
                        download={`beat-painter-${artwork.id}.png`}
                        className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-sm text-white transition"
                      >
                        ⬇️ {t('gallery.download')}
                      </a>
                      <button
                        onClick={() => setConfirmId(artwork.id)}
                        className="px-3 py-1.5 rounded-lg bg-gray-700 hover:bg-gray-600 text-sm text-white transition"
                      >
                        🗑️ {t('gallery.delete_confirm')}
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
