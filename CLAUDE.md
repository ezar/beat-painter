# beat-painter — CLAUDE.md

## Project overview

**beat-painter** is a web app for kids where sound and music become visual art in real time. The user speaks, sings, or makes noise into the microphone, and the app paints shapes, colors, and movement on a canvas reacting to volume, pitch (frequency bands), and rhythm.

Built for a specific user: an 11-year-old girl who loves music and creativity. The UX must be **immediately delightful**, zero learning curve, fully in Spanish/Catalan/English.

## Tech stack

| Layer | Choice |
|---|---|
| Framework | React 18 + TypeScript (strict) |
| Build | Vite 5 |
| Styling | Tailwind CSS 3 |
| State | Zustand 5 + persist middleware |
| Animation | Web Audio API + Canvas 2D API |
| i18n | react-i18next (ES / CA / EN) |
| PWA | vite-plugin-pwa + Workbox |
| Tests | Vitest 2 |
| Deploy | GitHub Actions → GitHub Pages |

## Project structure

```
beat-painter/
├── src/
│   ├── audio/
│   │   ├── AudioEngine.ts         # AudioContext, analyser, mic stream
│   │   └── FrequencyBands.ts      # Extract low/mid/high band energy from FFT
│   ├── canvas/
│   │   ├── Renderer.ts            # Main render loop (requestAnimationFrame)
│   │   └── Background.ts          # Fade trail effect (dark background)
│   ├── modes/
│   │   ├── index.ts               # Mode registry + type definitions
│   │   ├── Bubbles.ts             # Circles — size=volume, color=pitch
│   │   ├── Waves.ts               # Sine wave — amplitude=volume, freq=mid
│   │   ├── Stars.ts               # Spiky stars — spikes=low, scatter=high
│   │   ├── Petals.ts              # Rotating petals — count=low, size=volume
│   │   ├── Rain.ts                # Falling drops — density=volume, speed=high
│   │   ├── Galaxy.ts              # Spiral particles — spin speed=volume
│   │   └── Lava.ts                # Blob/metaball shapes — slow and heavy
│   ├── components/
│   │   ├── Canvas.tsx             # <canvas> element + resize observer
│   │   ├── MicButton.tsx          # Start/stop mic, permission error handling
│   │   ├── ModeSelector.tsx       # Grid of mode buttons with icons
│   │   ├── PaletteSelector.tsx    # Color palette picker (Neon, Pastel, BW, Sunset)
│   │   ├── VolumeBar.tsx          # Thin real-time volume indicator
│   │   ├── Gallery.tsx            # Saved artworks grid with delete/share
│   │   ├── SaveButton.tsx         # Save PNG to gallery (localStorage + blob)
│   │   └── ShareButton.tsx        # Web Share API, fallback copy link
│   ├── store/
│   │   ├── canvasStore.ts         # Active mode, palette, isRecording
│   │   └── galleryStore.ts        # Saved artworks array (Zustand persist)
│   ├── i18n/
│   │   ├── es.json                # Spanish strings
│   │   ├── ca.json                # Catalan strings
│   │   └── en.json                # English strings
│   ├── pwa/
│   │   └── manifest.json          # PWA manifest
│   ├── App.tsx
│   ├── main.tsx
│   └── vite-env.d.ts
├── public/
│   └── icons/                     # PWA icons (192, 512)
├── CLAUDE.md                      # This file
├── README.md
├── index.html
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── vite.config.ts
```

## Core concepts

### Audio pipeline

```
Microphone → MediaStream → AudioContext → AnalyserNode → Uint8Array (FFT)
```

- FFT size: 256 (128 frequency bins)
- Split bins into 3 bands: low (0-42), mid (43-85), high (86-127)
- Normalize each band to [0, 1]
- Volume = average of all bins normalized

### Render loop

```
requestAnimationFrame → getFrequencyData() → drawBackground() → drawMode() → repeat
```

- Background is NOT cleared each frame — a semi-transparent dark fill creates the trail effect
- Trail opacity should be configurable per mode (fast fade for waves, slow for petals)
- hue advances continuously, speed proportional to volume

### Mode interface

Every paint mode must implement this interface:

```typescript
export interface PaintMode {
  id: string
  labelKey: string        // i18n key
  icon: string            // Tabler icon name
  trailOpacity: number    // 0.02 (slow) to 0.15 (fast)
  draw(ctx: CanvasRenderingContext2D, audio: AudioFrame, state: RenderState): void
}

export interface AudioFrame {
  volume: number          // 0-1 overall
  low: number             // 0-1 bass energy
  mid: number             // 0-1 mid energy
  high: number            // 0-1 treble energy
  dataArray: Uint8Array   // raw FFT
}

export interface RenderState {
  frame: number
  hue: number
  width: number
  height: number
  palette: Palette
}
```

### Palettes

```typescript
export interface Palette {
  id: string
  labelKey: string
  hueOffset: number       // base hue shift
  saturation: number      // 0-100
  lightnessRange: [number, number]  // min/max lightness
  monochrome?: boolean    // BW mode: draw in gray
}
```

Palettes: `neon` (vivid, sat=90), `pastel` (soft, sat=60, light=75-85), `bw` (monochrome), `sunset` (hue 0-60 range only)

## Screens / layout

### Main screen (single page)

```
┌─────────────────────────────────┐
│  beat-painter          [🌐] [?] │  ← language + help
├─────────────────────────────────┤
│                                 │
│         CANVAS (dark)           │  ← full width, 16:9 aspect ratio
│                                 │
├─────────────────────────────────┤
│  [████░░░░░░░░░░░░░] volume bar │
├─────────────────────────────────┤
│  [🎤 Pintar] [🗑 Limpiar] [💾]  │
├─────────────────────────────────┤
│  Modes: [Bubbles][Waves][Stars]  │
│         [Petals][Rain][Galaxy]   │
├─────────────────────────────────┤
│  Palettes: [Neon][Pastel][BW]   │
└─────────────────────────────────┘
```

Gallery is a separate route `/gallery` with a back button.

## Implementation notes

- **Microphone permission**: Show a friendly error if denied, with instructions to enable it in browser settings. Never crash silently.
- **Demo mode**: When mic is not active, run a demo animation with fake sinusoidal audio data so the canvas is never empty.
- **Mobile first**: Canvas must resize correctly on mobile. Use ResizeObserver on the canvas container.
- **Save to gallery**: Convert canvas to PNG blob → store as base64 in localStorage via Zustand persist. Limit: 20 artworks max, show warning before oldest is overwritten.
- **PWA**: Must be installable. Offline mode shows only the painter (gallery from localStorage works offline too).
- **No external API calls** — fully local, no backend, no auth.
- **Performance**: Keep draw calls minimal. Avoid allocating objects in the render loop — reuse typed arrays.

## i18n keys (minimum required)

```json
{
  "app.title": "beat-painter",
  "btn.paint": "Pintar",
  "btn.stop": "Parar",
  "btn.clear": "Limpiar",
  "btn.save": "Guardar",
  "btn.gallery": "Mis obras",
  "btn.share": "Compartir",
  "mode.bubbles": "Burbujas",
  "mode.waves": "Ondas",
  "mode.stars": "Estrellas",
  "mode.petals": "Pétalos",
  "mode.rain": "Lluvia",
  "mode.galaxy": "Galaxia",
  "mode.lava": "Lava",
  "palette.neon": "Neón",
  "palette.pastel": "Pastel",
  "palette.bw": "B&N",
  "palette.sunset": "Atardecer",
  "mic.permission_denied": "No se pudo acceder al micrófono. Ve a los ajustes del navegador y permite el acceso.",
  "gallery.empty": "Todavía no has guardado ninguna obra",
  "gallery.saved": "¡Obra guardada!",
  "gallery.full": "Galería llena — se eliminará la más antigua",
  "gallery.delete_confirm": "¿Eliminar esta obra?"
}
```

## Commands

```bash
npm install
npm run dev          # http://localhost:5173
npm run type-check   # tsc --noEmit
npm test             # vitest run
npm run build        # production build
npm run preview      # preview production build
```

## GitHub Actions

Deploy to GitHub Pages on every push to `main`:
- Run `npm run type-check`
- Run `npm test`
- Run `npm run build`
- Deploy `dist/` to `gh-pages` branch

## What NOT to do

- Do not use Web Workers for audio (unnecessary complexity at this scale)
- Do not use Three.js or any 3D library — Canvas 2D is enough
- Do not store images as data URLs in React state — use Zustand persist only
- Do not add a backend — everything is local
- Do not add user accounts or login
- Do not use `alert()` or `confirm()` — use in-UI feedback components
