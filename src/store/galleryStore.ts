import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Artwork } from '../types'

const MAX_ARTWORKS = 20

interface GalleryState {
  artworks: Artwork[]
  notification: string | null
  addArtwork: (data: Pick<Artwork, 'dataUrl' | 'mode' | 'palette'>) => void
  deleteArtwork: (id: string) => void
  clearNotification: () => void
}

export const useGalleryStore = create<GalleryState>()(
  persist(
    (set, get) => ({
      artworks: [],
      notification: null,
      addArtwork(data) {
        const list = get().artworks.slice()
        const wasFull = list.length >= MAX_ARTWORKS
        if (wasFull) list.shift()
        list.push({
          id: crypto.randomUUID(),
          createdAt: Date.now(),
          ...data,
        })
        set({
          artworks: list,
          notification: wasFull ? 'gallery.full_warning' : 'gallery.saved',
        })
      },
      deleteArtwork: (id) =>
        set((s) => ({ artworks: s.artworks.filter((a) => a.id !== id) })),
      clearNotification: () => set({ notification: null }),
    }),
    { name: 'beat-painter-gallery' },
  ),
)
