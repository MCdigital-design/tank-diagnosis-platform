import { Line, Text } from '@react-three/drei'
import {
  getFloatingRoofTravel,
  ROOF_PHASE_COLORS,
  ROOF_PHASE_LABELS,
} from '../../data/floatingRoofState'
import { getTankById } from '../../data/mock'

type Props = {
  tankId: string
}

export function RoofTravelGauge({ tankId }: Props) {
  const tank = getTankById(tankId)
  const travel = getFloatingRoofTravel(tankId)
  if (!tank || !travel) return null

  const [tx, baseY, tz] = tank.position
  const offsetX = tx + tank.radius + 0.75
  const shaftBottom = baseY + 0.15
  const shaftTop = baseY + tank.height * 0.95
  const shaftH = shaftTop - shaftBottom

  const yForHeight = (h: number) =>
    shaftBottom + (h / travel.highLimit) * shaftH * 0.92

  const markerY = yForHeight(travel.roofHeight)
  const highY = yForHeight(travel.highLimit)
  const lowY = yForHeight(travel.lowLimit)
  const phaseColor = ROOF_PHASE_COLORS[travel.phase]

  const shaftPoints: [number, number, number][] = [
    [offsetX, shaftBottom, tz],
    [offsetX, shaftTop, tz],
  ]

  return (
    <group>
      <Line points={shaftPoints} color="#3a6a9a" lineWidth={2} />
      <Line
        points={[
          [offsetX - 0.12, highY, tz],
          [offsetX + 0.12, highY, tz],
        ]}
        color="#ffb347"
        lineWidth={2}
      />
      <Line
        points={[
          [offsetX - 0.12, lowY, tz],
          [offsetX + 0.12, lowY, tz],
        ]}
        color="#ffb347"
        lineWidth={2}
      />
      <mesh position={[offsetX, markerY, tz]}>
        <boxGeometry args={[0.22, 0.14, 0.08]} />
        <meshStandardMaterial
          color={phaseColor}
          emissive={phaseColor}
          emissiveIntensity={travel.phase === 'landed' ? 0.9 : 0.45}
        />
      </mesh>
      <Text
        position={[offsetX + 0.35, markerY, tz]}
        fontSize={0.14}
        color={phaseColor}
        anchorX="left"
        anchorY="middle"
      >
        {travel.roofHeight.toFixed(2)}m
      </Text>
      <Text
        position={[offsetX + 0.35, shaftTop + 0.2, tz]}
        fontSize={0.11}
        color="#8aa8cc"
        anchorX="left"
      >
        {ROOF_PHASE_LABELS[travel.phase]}
      </Text>
    </group>
  )
}
