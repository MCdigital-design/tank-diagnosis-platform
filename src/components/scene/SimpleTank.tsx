import { useState } from 'react'
import type { ThreeEvent } from '@react-three/fiber'
import { useCursor } from '@react-three/drei'

const noopRaycast = () => null

export type TankMeshProps = {
  id: string
  position: [number, number, number]
  radius: number
  height: number
  color: string
  selected: boolean
  onSelect: (id: string) => void
}

export function SimpleTank({
  id,
  position,
  radius,
  height,
  color,
  selected,
  onSelect,
}: TankMeshProps) {
  const [hovered, setHovered] = useState(false)
  useCursor(hovered && !selected, 'pointer')

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

  const bodyColor = selected ? '#4dd4ff' : hovered ? '#8ec8f0' : color
  const emissive = selected ? '#1a8cff' : hovered ? '#3d8fd4' : '#000000'
  const emissiveIntensity = selected ? 0.5 : hovered ? 0.28 : 0
  const ringOpacity = selected ? 0.95 : hovered ? 0.8 : 0.4
  const ringColor = selected || hovered ? '#00e5a0' : '#3a6a9a'

  return (
    <group position={position}>
      <mesh position={[0, height / 2, 0]} raycast={noopRaycast}>
        <cylinderGeometry args={[radius, radius, height, 32]} />
        <meshStandardMaterial
          color={bodyColor}
          emissive={emissive}
          emissiveIntensity={emissiveIntensity}
        />
      </mesh>
      <mesh position={[0, height + 0.05, 0]} raycast={noopRaycast}>
        <cylinderGeometry args={[radius * 0.92, radius * 0.92, 0.1, 32]} />
        <meshStandardMaterial
          color={selected ? '#8ee8ff' : hovered ? '#a8d8f0' : '#9ab0c4'}
          emissive={hovered || selected ? '#4488bb' : '#000000'}
          emissiveIntensity={hovered || selected ? 0.2 : 0}
        />
      </mesh>
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]} raycast={noopRaycast}>
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
