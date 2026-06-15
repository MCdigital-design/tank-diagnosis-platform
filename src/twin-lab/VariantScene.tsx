import { Component, Suspense, useEffect, useMemo, useState, type ReactNode } from 'react'
import { OrbitControls, useGLTF } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { DetailedTank } from '../components/scene/DetailedTank'
import { getCameraPreset } from './cameraPresets'
import { estimateTriangles, fitSceneToTank } from './labGlbUtils'
import { LAB_TANK_HEIGHT, LAB_TANK_RADIUS } from './variantConfig'
import type { CameraPresetId } from './types'

type LoadStats = {
  loadMs: number
  triangles: number
  missing: boolean
  usedFallback: boolean
  glbLoaded: boolean
}

type VariantSceneProps = {
  glbPath: string
  cameraPreset: CameraPresetId
  onStats: (stats: LoadStats) => void
}

function CameraRig({ preset }: { preset: CameraPresetId }) {
  const { camera } = useThree()
  const cfg = getCameraPreset(preset)

  useEffect(() => {
    camera.position.set(...cfg.position)
    if ('fov' in camera) {
      camera.fov = cfg.fov
      camera.updateProjectionMatrix()
    }
  }, [camera, cfg])

  return (
    <OrbitControls
      makeDefault
      target={cfg.target}
      enableDamping
      dampingFactor={0.08}
      minDistance={4}
      maxDistance={32}
      maxPolarAngle={Math.PI / 2 - 0.05}
    />
  )
}

function FpsReporter({ onFps }: { onFps: (fps: number) => void }) {
  const [frames, setFrames] = useState(0)
  const [last, setLast] = useState(performance.now())

  useFrame(() => {
    const now = performance.now()
    const next = frames + 1
    if (now - last >= 1000) {
      onFps(Math.round((next * 1000) / (now - last)))
      setFrames(0)
      setLast(now)
    } else {
      setFrames(next)
    }
  })

  return null
}

type VariantGltfProps = {
  glbPath: string
  onStats: (stats: LoadStats) => void
}

function VariantGltf({ glbPath, onStats, onEmpty }: VariantGltfProps & { onEmpty: () => void }) {
  const started = useMemo(() => performance.now(), [glbPath])
  const { scene } = useGLTF(glbPath)
  const model = useMemo(
    () => fitSceneToTank(scene, LAB_TANK_RADIUS, LAB_TANK_HEIGHT),
    [scene],
  )

  useEffect(() => {
    const tris = estimateTriangles(model)
    if (tris < 100) {
      onEmpty()
      return
    }
    onStats({
      loadMs: Math.round(performance.now() - started),
      triangles: tris,
      missing: false,
      usedFallback: false,
      glbLoaded: true,
    })
  }, [model, onEmpty, onStats, started])

  return <primitive object={model} />
}

type GltfErrorBoundaryProps = {
  fallback: ReactNode
  children: ReactNode
  onFallback: () => void
}

type GltfErrorBoundaryState = { failed: boolean }

class GltfErrorBoundary extends Component<GltfErrorBoundaryProps, GltfErrorBoundaryState> {
  state: GltfErrorBoundaryState = { failed: false }

  static getDerivedStateFromError(): GltfErrorBoundaryState {
    return { failed: true }
  }

  componentDidCatch(): void {
    this.props.onFallback()
  }

  render() {
    if (this.state.failed) {
      return this.props.fallback
    }
    return this.props.children
  }
}

function ProceduralFallback({
  onStats,
  reason,
}: {
  onStats: (stats: LoadStats) => void
  reason: 'missing' | 'error' | 'loading'
}) {
  useEffect(() => {
    onStats({
      loadMs: 0,
      triangles: 0,
      missing: reason !== 'loading',
      usedFallback: true,
      glbLoaded: false,
    })
  }, [onStats, reason])

  return (
    <DetailedTank
      id="lab-fallback"
      position={[0, 0, 0]}
      radius={LAB_TANK_RADIUS}
      height={LAB_TANK_HEIGHT}
      color="#6b849c"
      selected={false}
      onSelect={() => {}}
    />
  )
}

async function checkGlbAvailable(url: string): Promise<boolean> {
  try {
    const res = await fetch(url, { method: 'GET', headers: { Range: 'bytes=0-15' } })
    return res.ok
  } catch {
    return false
  }
}

export function VariantScene({ glbPath, cameraPreset, onStats }: VariantSceneProps) {
  const [fps, setFps] = useState(0)
  const [glbAvailable, setGlbAvailable] = useState<boolean | null>(null)
  const [loadFailed, setLoadFailed] = useState(false)
  const [emptyGlb, setEmptyGlb] = useState(false)

  useEffect(() => {
    let cancelled = false
    setGlbAvailable(null)
    setLoadFailed(false)
    setEmptyGlb(false)
    checkGlbAvailable(glbPath).then((ok) => {
      if (!cancelled) setGlbAvailable(ok)
    })
    return () => {
      cancelled = true
    }
  }, [glbPath])

  const useFallback = glbAvailable === false || loadFailed || emptyGlb
  const showProcedural = glbAvailable === null || useFallback

  const handleStats = (stats: LoadStats) => {
    onStats(stats)
  }

  const fallbackReason =
    glbAvailable === null ? 'loading' : useFallback ? 'missing' : 'loading'

  return (
    <>
      <CameraRig preset={cameraPreset} />
      <FpsReporter onFps={setFps} />
      <group>
        {showProcedural ? (
          <ProceduralFallback onStats={handleStats} reason={fallbackReason} />
        ) : (
          <GltfErrorBoundary
            onFallback={() => setLoadFailed(true)}
            fallback={<ProceduralFallback onStats={handleStats} reason="error" />}
          >
            <Suspense
              fallback={<ProceduralFallback onStats={handleStats} reason="loading" />}
            >
              <VariantGltf
                glbPath={glbPath}
                onStats={handleStats}
                onEmpty={() => setEmptyGlb(true)}
              />
            </Suspense>
          </GltfErrorBoundary>
        )}
      </group>
      <FpsBridge fps={fps} />
    </>
  )
}

function FpsBridge({ fps }: { fps: number }) {
  useEffect(() => {
    window.dispatchEvent(new CustomEvent('twin-lab-fps', { detail: fps }))
  }, [fps])
  return null
}
