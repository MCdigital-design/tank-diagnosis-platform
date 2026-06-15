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

function VariantGltf({ glbPath, onStats }: VariantGltfProps) {
  const started = useMemo(() => performance.now(), [glbPath])
  const { scene } = useGLTF(glbPath)
  const model = useMemo(
    () => fitSceneToTank(scene, LAB_TANK_RADIUS, LAB_TANK_HEIGHT),
    [scene],
  )

  useEffect(() => {
    onStats({
      loadMs: Math.round(performance.now() - started),
      triangles: estimateTriangles(model),
      missing: false,
      usedFallback: false,
    })
  }, [model, onStats, started])

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

function ProceduralFallback({ onStats }: { onStats: (stats: LoadStats) => void }) {
  useEffect(() => {
    onStats({
      loadMs: 0,
      triangles: 0,
      missing: true,
      usedFallback: true,
    })
  }, [onStats])

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

export function VariantScene({ glbPath, cameraPreset, onStats }: VariantSceneProps) {
  const [fps, setFps] = useState(0)
  const [useFallback, setUseFallback] = useState(false)

  const handleStats = (stats: LoadStats) => {
    onStats(stats)
  }

  return (
    <>
      <CameraRig preset={cameraPreset} />
      <FpsReporter onFps={setFps} />
      <group>
        {useFallback ? (
          <ProceduralFallback onStats={handleStats} />
        ) : (
          <GltfErrorBoundary
            onFallback={() => setUseFallback(true)}
            fallback={<ProceduralFallback onStats={handleStats} />}
          >
            <Suspense
              fallback={
                <mesh position={[0, LAB_TANK_HEIGHT / 2, 0]}>
                  <cylinderGeometry args={[LAB_TANK_RADIUS, LAB_TANK_RADIUS, LAB_TANK_HEIGHT, 24]} />
                  <meshStandardMaterial color="#6b849c" transparent opacity={0.25} />
                </mesh>
              }
            >
              <VariantGltf glbPath={glbPath} onStats={handleStats} />
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
