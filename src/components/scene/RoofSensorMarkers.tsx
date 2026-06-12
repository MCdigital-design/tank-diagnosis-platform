import { useRef, useState } from 'react'
import { useCursor } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import type { ThreeEvent } from '@react-three/fiber'
import type { Mesh } from 'three'
import {
  SENSOR_STATUS_COLORS,
  getRoofMarkersForTank,
  type RoofSensor,
} from '../../data/floatingRoofSensors'
import { getTankById } from '../../data/mock'
import { getSensorWorldPosition } from './roofSensorGeometry'

type MarkerProps = {
  tankId: string
  sensor: RoofSensor
  selected: boolean
  onSelect: (sensorId: string) => void
}

function SensorMarker({ tankId, sensor, selected, onSelect }: MarkerProps) {
  const [hovered, setHovered] = useState(false)
  const meshRef = useRef<Mesh>(null)
  useCursor(hovered && !selected, 'pointer')

  const tank = getTankById(tankId)
  if (!tank) return null

  const world = getSensorWorldPosition(tank, sensor)
  const color = SENSOR_STATUS_COLORS[sensor.status]
  const isFire = sensor.status === 'fire'
  const isGrounding = sensor.type === 'grounding'
  const scale = selected ? 1.35 : hovered ? 1.15 : 1
  const emissiveIntensity = selected
    ? 0.85
    : hovered
      ? 0.55
      : sensor.status === 'fire' || sensor.status === 'alarm'
        ? 0.55
        : 0.2

  useFrame((state) => {
    if (!meshRef.current || !isFire) return
    const pulse = 0.45 + Math.sin(state.clock.elapsedTime * 6) * 0.35
    const mat = meshRef.current.material
    if (mat && 'emissiveIntensity' in mat) {
      ;(mat as { emissiveIntensity: number }).emissiveIntensity = pulse
    }
  })

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation()
    onSelect(sensor.id)
  }

  return (
    <group position={[world.x, world.y, world.z]}>
      <mesh
        ref={meshRef}
        scale={scale}
        onClick={handleClick}
        onPointerOver={(e) => {
          e.stopPropagation()
          setHovered(true)
        }}
        onPointerOut={(e) => {
          e.stopPropagation()
          setHovered(false)
        }}
      >
        {isGrounding ? (
          <boxGeometry args={[0.14, 0.14, 0.14]} />
        ) : (
          <sphereGeometry args={[0.11, 12, 12]} />
        )}
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={emissiveIntensity}
          toneMapped={false}
        />
      </mesh>
      {selected && (
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.16, 0.22, 24]} />
          <meshBasicMaterial color={color} transparent opacity={0.75} />
        </mesh>
      )}
    </group>
  )
}

type Props = {
  tankId: string
  activeSensorId: string | null
  onSelectSensor: (id: string) => void
}

export function RoofSensorMarkers({ tankId, activeSensorId, onSelectSensor }: Props) {
  const markers = getRoofMarkersForTank(tankId)
  if (markers.length === 0) return null

  return (
    <group>
      {markers.map((s) => (
        <SensorMarker
          key={s.id}
          tankId={tankId}
          sensor={s}
          selected={activeSensorId === s.id}
          onSelect={onSelectSensor}
        />
      ))}
    </group>
  )
}
