import { useCallback, useEffect, useMemo, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { isWebGLAvailable } from '../utils/webgl'
import { getCameraPreset, CAMERA_PRESETS } from './cameraPresets'
import { LabEnvironment } from './labEnvironment'
import { ReferencePanel } from './ReferencePanel'
import { StatsOverlay, type LabStats } from './StatsOverlay'
import { VariantPicker } from './VariantPicker'
import { VariantScene } from './VariantScene'
import type { CameraPresetId, VariantId, ViewMode } from './types'
import {
  resolveBestAvailableVariant,
  variantGlbPath,
  VARIANTS,
} from './variantConfig'
import './lab.css'

function pushVariantToUrl(variant: VariantId) {
  const url = new URL(window.location.href)
  url.searchParams.set('variant', variant)
  window.history.replaceState({}, '', url)
}

async function fetchFileSizeMb(url: string): Promise<number | null> {
  try {
    const res = await fetch(url, { method: 'GET', headers: { Range: 'bytes=0-0' } })
    if (!res.ok && res.status !== 206) return null
    const len = res.headers.get('content-range')?.split('/')[1] ?? res.headers.get('content-length')
    if (!len) return null
    return Number(len) / (1024 * 1024)
  } catch {
    return null
  }
}

export function LabApp() {
  const [variant, setVariant] = useState<VariantId>('D')
  const [cameraPreset, setCameraPreset] = useState<CameraPresetId>('hero45')
  const [viewMode, setViewMode] = useState<ViewMode>('split')
  const [stats, setStats] = useState<LabStats>({
    fps: 0,
    loadMs: 0,
    triangles: 0,
    fileMb: null,
    missing: true,
    usedFallback: true,
    glbLoaded: false,
  })

  const glbPath = useMemo(() => variantGlbPath(variant), [variant])
  const meta = VARIANTS.find((v) => v.id === variant)

  useEffect(() => {
    let cancelled = false
    resolveBestAvailableVariant().then((id) => {
      if (!cancelled) {
        setVariant(id)
        pushVariantToUrl(id)
      }
    })
    return () => {
      cancelled = true
    }
  }, [])

  const handleVariant = useCallback((id: VariantId) => {
    setVariant(id)
    pushVariantToUrl(id)
    setStats((s) => ({
      ...s,
      loadMs: 0,
      triangles: 0,
      fileMb: null,
      usedFallback: true,
      glbLoaded: false,
    }))
  }, [])

  const handleSceneStats = useCallback(
    (partial: Pick<LabStats, 'loadMs' | 'triangles' | 'missing' | 'usedFallback' | 'glbLoaded'>) => {
      setStats((s) => ({ ...s, ...partial }))
    },
    [],
  )

  useEffect(() => {
    fetchFileSizeMb(glbPath).then((fileMb) => {
      setStats((s) => ({
        ...s,
        fileMb,
        missing: fileMb == null,
      }))
    })
  }, [glbPath])

  useEffect(() => {
    const onFps = (e: Event) => {
      const fps = (e as CustomEvent<number>).detail
      setStats((s) => ({ ...s, fps }))
    }
    window.addEventListener('twin-lab-fps', onFps)
    return () => window.removeEventListener('twin-lab-fps', onFps)
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return
      }
      const idx = Number(e.key)
      if (idx >= 1 && idx <= 6) {
        handleVariant(String.fromCharCode(64 + idx) as VariantId)
      }
      if (e.key === 'c' || e.key === 'C') {
        setCameraPreset((current) => {
          const i = CAMERA_PRESETS.findIndex((p) => p.id === current)
          const next = CAMERA_PRESETS[(i + 1) % CAMERA_PRESETS.length]
          return next.id
        })
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [handleVariant])

  const cam = getCameraPreset(cameraPreset)

  if (!isWebGLAvailable()) {
    return (
      <div className="lab-root lab-root--error">
        <p>WebGL unavailable. Twin-Lab requires a desktop browser with WebGL.</p>
      </div>
    )
  }

  return (
    <div className="lab-root">
      <VariantPicker
        variant={variant}
        cameraPreset={cameraPreset}
        viewMode={viewMode}
        onVariant={handleVariant}
        onCamera={setCameraPreset}
        onViewMode={setViewMode}
      />

      <div className={`lab-stage lab-stage--${viewMode}`}>
        <ReferencePanel viewMode={viewMode} />

        {viewMode !== 'mock' && (
          <div className="lab-canvas-wrap">
            <Canvas
              camera={{ position: cam.position, fov: cam.fov, near: 0.1, far: 200 }}
              gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
              style={{ background: '#0a1420' }}
              shadows
            >
              <LabEnvironment>
                <VariantScene
                  key={glbPath}
                  glbPath={glbPath}
                  cameraPreset={cameraPreset}
                  onStats={handleSceneStats}
                />
              </LabEnvironment>
            </Canvas>
            <div
              className={`lab-status-banner ${stats.usedFallback ? 'lab-status-banner--fallback' : 'lab-status-banner--glb'}`}
            >
              {stats.usedFallback
                ? `PROCEDURAL FALLBACK — ${meta?.glbFile ?? 'tank'} not loaded`
                : `GLB ACTIVE — ${meta?.glbFile}`}
            </div>
            <div className="lab-canvas-badge">
              <span>{meta?.glbFile}</span>
            </div>
          </div>
        )}
      </div>

      <StatsOverlay variant={variant} stats={stats} />
    </div>
  )
}
