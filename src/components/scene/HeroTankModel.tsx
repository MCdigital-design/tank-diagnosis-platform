import { Component, Suspense, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { ThreeEvent } from '@react-three/fiber'
import { useCursor, useGLTF } from '@react-three/drei'
import { Box3, MeshStandardMaterial, Vector3, type Material, type Object3D } from 'three'
import { DetailedTank } from './DetailedTank'
import { SimpleTank, type TankMeshProps } from './SimpleTank'

export type HeroTankMode = 'procedural' | 'glb' | 'simple'

function resolveHeroTankMode(): HeroTankMode {
  const mode = import.meta.env.VITE_HERO_TANK_MODE?.toLowerCase()
  if (mode === 'glb' || mode === 'simple' || mode === 'procedural') {
    return mode
  }
  // Legacy flag: VITE_USE_HERO_GLB=false → simple only
  if (import.meta.env.VITE_USE_HERO_GLB === 'false') {
    return 'simple'
  }
  return 'procedural'
}

export type HeroTankModelProps = TankMeshProps & {
  modelPath?: string
}

function resolveModelPath(modelPath?: string): string {
  const relative = modelPath ?? 'models/tank_hero.glb'
  if (relative.startsWith('http://') || relative.startsWith('https://')) {
    return relative
  }
  const normalized = relative.startsWith('/') ? relative.slice(1) : relative
  return `${import.meta.env.BASE_URL}${normalized}`
}

function fitSceneToTank(scene: Object3D, radius: number, height: number): Object3D {
  const clone = scene.clone(true)
  const box = new Box3().setFromObject(clone)
  const size = box.getSize(new Vector3())
  const center = box.getCenter(new Vector3())
  clone.position.sub(center)
  clone.position.y += size.y / 2

  const diameter = Math.max(size.x, size.z, 0.001)
  const scale = Math.min(height / Math.max(size.y, 0.001), (radius * 2) / diameter)
  clone.scale.setScalar(scale)
  return clone
}

function applyTankHighlight(root: Object3D, selected: boolean, hovered: boolean) {
  root.traverse((child) => {
    const mesh = child as Object3D & { material?: Material | Material[] }
    if (!mesh.material) return
    const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material]
    for (const material of materials) {
      if (!(material instanceof MeshStandardMaterial)) continue
      material.emissive.set(selected ? '#1a8cff' : hovered ? '#3d8fd4' : '#000000')
      material.emissiveIntensity = selected ? 0.35 : hovered ? 0.18 : 0
    }
  })
}

type TankLoadingPlaceholderProps = Pick<TankMeshProps, 'position' | 'radius' | 'height'>

function TankLoadingPlaceholder({ position, radius, height }: TankLoadingPlaceholderProps) {
  return (
    <group position={position}>
      <mesh position={[0, height / 2, 0]}>
        <cylinderGeometry args={[radius, radius, height, 24]} />
        <meshStandardMaterial color="#6b849c" transparent opacity={0.22} />
      </mesh>
    </group>
  )
}

type HeroGltfTankProps = TankMeshProps & { resolvedPath: string }

function HeroGltfTank({
  id,
  position,
  radius,
  height,
  selected,
  onSelect,
  resolvedPath,
}: HeroGltfTankProps) {
  const [hovered, setHovered] = useState(false)
  useCursor(hovered && !selected, 'pointer')
  const { scene } = useGLTF(resolvedPath)

  const model = useMemo(
    () => fitSceneToTank(scene, radius, height),
    [scene, radius, height],
  )

  useEffect(() => {
    applyTankHighlight(model, selected, hovered)
  }, [model, selected, hovered])

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation()
    onSelect(id)
  }

  const handleOver = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation()
    setHovered(true)
  }

  const handleOut = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation()
    setHovered(false)
  }

  const ringOpacity = selected ? 0.95 : hovered ? 0.8 : 0.4
  const ringColor = selected || hovered ? '#00e5a0' : '#3a6a9a'

  return (
    <group position={position}>
      <primitive object={model} />
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[radius + 0.35, radius + 0.5, 48]} />
        <meshBasicMaterial color={ringColor} transparent opacity={ringOpacity} />
      </mesh>
      <mesh
        position={[0, height / 2, 0]}
        onClick={handleClick}
        onPointerOver={handleOver}
        onPointerOut={handleOut}
      >
        <cylinderGeometry args={[radius * 1.08, radius * 1.08, height * 1.02, 24]} />
        <meshBasicMaterial visible={false} />
      </mesh>
    </group>
  )
}

type GltfErrorBoundaryProps = {
  fallback: ReactNode
  children: ReactNode
}

type GltfErrorBoundaryState = { failed: boolean }

class GltfErrorBoundary extends Component<GltfErrorBoundaryProps, GltfErrorBoundaryState> {
  state: GltfErrorBoundaryState = { failed: false }

  static getDerivedStateFromError(): GltfErrorBoundaryState {
    return { failed: true }
  }

  render() {
    if (this.state.failed) {
      return this.props.fallback
    }
    return this.props.children
  }
}

export function HeroTankModel(props: HeroTankModelProps) {
  const mode = resolveHeroTankMode()

  if (mode === 'simple') {
    return <SimpleTank {...props} />
  }

  if (mode === 'procedural') {
    return <DetailedTank {...props} />
  }

  const resolvedPath = resolveModelPath(props.modelPath)
  const placeholder = (
    <TankLoadingPlaceholder
      position={props.position}
      radius={props.radius}
      height={props.height}
    />
  )

  return (
    <GltfErrorBoundary fallback={<DetailedTank {...props} />}>
      <Suspense fallback={placeholder}>
        <HeroGltfTank {...props} resolvedPath={resolvedPath} />
      </Suspense>
    </GltfErrorBoundary>
  )
}
