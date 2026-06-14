import { useMemo, useState } from 'react'
import type { ThreeEvent } from '@react-three/fiber'
import { useCursor } from '@react-three/drei'
import * as THREE from 'three'
import { heroTankSpec } from '../../data/heroTankSpec'
import { detailMaterial, railMaterial, roofMaterial, shellMaterial } from './heroTankMaterials'
import type { TankMeshProps } from './SimpleTank'

const noopRaycast = () => null

function ShellPanels({
  radius,
  height,
  material,
}: {
  radius: number
  height: number
  material: THREE.MeshStandardMaterial
}) {
  const panels = heroTankSpec.shellPanels
  const panelArc = (Math.PI * 2) / panels
  const panelWidth = radius * 0.08
  const panelDepth = radius * 0.012

  return (
    <group>
      {Array.from({ length: panels }, (_, i) => {
        const a = i * panelArc
        const x = Math.cos(a) * (radius + panelDepth * 0.5)
        const z = Math.sin(a) * (radius + panelDepth * 0.5)
        return (
          <mesh
            key={i}
            position={[x, height / 2, z]}
            rotation={[0, -a + Math.PI / 2, 0]}
            raycast={noopRaycast}
          >
            <boxGeometry args={[panelWidth, height * 0.92, panelDepth]} />
            <primitive object={material} attach="material" />
          </mesh>
        )
      })}
    </group>
  )
}

function LadderAssembly({ radius, height }: { radius: number; height: number }) {
  const { angle, widthRatio, railOffsetRatio, cageRungs } = heroTankSpec.ladder
  const ladderW = radius * widthRatio
  const railOff = radius * railOffsetRatio
  const x = Math.cos(angle) * (radius + railOff)
  const z = Math.sin(angle) * (radius + railOff)
  const railMat = railMaterial()
  const detailMat = detailMaterial('#6a7a88')

  return (
    <group position={[x, 0, z]} rotation={[0, -angle + Math.PI / 2, 0]}>
      <mesh position={[-ladderW / 2, height / 2, 0]} raycast={noopRaycast}>
        <boxGeometry args={[0.04, height * 0.88, 0.04]} />
        <primitive object={detailMat} attach="material" />
      </mesh>
      <mesh position={[ladderW / 2, height / 2, 0]} raycast={noopRaycast}>
        <boxGeometry args={[0.04, height * 0.88, 0.04]} />
        <primitive object={detailMat} attach="material" />
      </mesh>
      {Array.from({ length: cageRungs }, (_, i) => {
        const y = 0.35 + (i / (cageRungs - 1)) * (height * 0.82)
        return (
          <mesh key={i} position={[0, y, 0]} raycast={noopRaycast}>
            <boxGeometry args={[ladderW, 0.035, 0.03]} />
            <primitive object={detailMat} attach="material" />
          </mesh>
        )
      })}
      {Array.from({ length: 4 }, (_, i) => {
        const y = height * 0.9 + i * 0.08
        return (
          <mesh key={`cage-${i}`} position={[0, y, 0.06]} raycast={noopRaycast}>
            <boxGeometry args={[ladderW + 0.06, 0.03, 0.03]} />
            <primitive object={railMat} attach="material" />
          </mesh>
        )
      })}
    </group>
  )
}

function WalkwayRing({ radius, height }: { radius: number; height: number }) {
  const { walkway } = heroTankSpec
  const y = height + walkway.heightRatio * height * 0.5
  const outer = radius * walkway.radiusRatio
  const inner = radius * 0.98
  const railH = height * walkway.railHeightRatio
  const deckMat = detailMaterial('#5a6a78')
  const railMat = railMaterial()

  return (
    <group>
      <mesh position={[0, y, 0]} rotation={[-Math.PI / 2, 0, 0]} raycast={noopRaycast}>
        <ringGeometry args={[inner, outer, 64]} />
        <primitive object={deckMat} attach="material" />
      </mesh>
      {Array.from({ length: 32 }, (_, i) => {
        const a = (i / 32) * Math.PI * 2
        const rx = Math.cos(a) * outer
        const rz = Math.sin(a) * outer
        return (
          <mesh key={i} position={[rx, y + railH / 2, rz]} raycast={noopRaycast}>
            <boxGeometry args={[0.04, railH, 0.04]} />
            <primitive object={railMat} attach="material" />
          </mesh>
        )
      })}
    </group>
  )
}

function PipeStubs({ radius, height }: { radius: number; height: number }) {
  const mat = detailMaterial('#7a8a98')

  return (
    <group>
      {heroTankSpec.pipes.map((pipe, i) => {
        const y = height * pipe.heightRatio
        const len = radius * pipe.lengthRatio
        const pr = radius * pipe.radiusRatio
        const x = Math.cos(pipe.angle) * radius
        const z = Math.sin(pipe.angle) * radius
        const nx = Math.cos(pipe.angle)
        const nz = Math.sin(pipe.angle)
        return (
          <group key={i}>
            <mesh
              position={[x + (nx * len) / 2, y, z + (nz * len) / 2]}
              rotation={[0, -pipe.angle + Math.PI / 2, Math.PI / 2]}
              raycast={noopRaycast}
            >
              <cylinderGeometry args={[pr, pr, len, 12]} />
              <primitive object={mat} attach="material" />
            </mesh>
            <mesh
              position={[x + nx * (len + pr * 1.2), y, z + nz * (len + pr * 1.2)]}
              raycast={noopRaycast}
            >
              <cylinderGeometry args={[pr * 1.35, pr * 1.35, pr * 2, 12]} />
              <primitive object={mat} attach="material" />
            </mesh>
          </group>
        )
      })}
    </group>
  )
}

function SensorAnchors({ radius, height }: { radius: number; height: number }) {
  const roofY = height * heroTankSpec.roofHeightRatio
  return (
    <group>
      {Object.entries(heroTankSpec.anchors).map(([name, [nx, nz]]) => (
        <group
          key={name}
          name={name}
          position={[nx * radius, roofY + 0.08, nz * radius]}
        />
      ))}
    </group>
  )
}

export function DetailedTank({
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

  const shellMat = useMemo(
    () => shellMaterial(color, selected, hovered),
    [color, selected, hovered],
  )
  const roofMat = useMemo(() => roofMaterial(selected, hovered), [selected, hovered])
  const foundationMat = useMemo(() => detailMaterial('#4a5a68'), [])
  const sealMat = useMemo(() => detailMaterial('#6a7888'), [])

  const roofY = height * heroTankSpec.roofHeightRatio
  const roofR = radius * heroTankSpec.roofRadiusRatio
  const seal = heroTankSpec.seal
  const foundation = heroTankSpec.foundation
  const vent = heroTankSpec.vent

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
    <group position={position} name={`tank-${id}`}>
      {/* Foundation */}
      <mesh position={[0, (height * foundation.heightRatio) / 2, 0]} raycast={noopRaycast}>
        <cylinderGeometry
          args={[
            radius * foundation.radiusRatio,
            radius * foundation.radiusRatio,
            height * foundation.heightRatio,
            48,
          ]}
        />
        <primitive object={foundationMat} attach="material" />
      </mesh>

      {/* Shell */}
      <mesh position={[0, height / 2, 0]} raycast={noopRaycast}>
        <cylinderGeometry args={[radius, radius, height * 0.97, 64]} />
        <primitive object={shellMat} attach="material" />
      </mesh>

      <ShellPanels radius={radius} height={height} material={shellMat} />

      {/* Floating roof */}
      <mesh position={[0, roofY, 0]} raycast={noopRaycast}>
        <cylinderGeometry args={[roofR, roofR, height * 0.045, 64]} />
        <primitive object={roofMat} attach="material" />
      </mesh>
      <mesh position={[0, roofY + height * 0.02, 0]} raycast={noopRaycast}>
        <cylinderGeometry args={[roofR * 0.88, roofR * 0.88, height * 0.018, 48]} />
        <primitive object={roofMat} attach="material" />
      </mesh>

      {/* Seal gallery */}
      <mesh position={[0, height * 0.985, 0]} raycast={noopRaycast}>
        <cylinderGeometry
          args={[
            radius * seal.radiusOutRatio,
            radius * seal.radiusInRatio,
            height * seal.heightRatio,
            64,
          ]}
        />
        <primitive object={sealMat} attach="material" />
      </mesh>

      <WalkwayRing radius={radius} height={height} />
      <LadderAssembly radius={radius} height={height} />
      <PipeStubs radius={radius} height={height} />

      {/* Vent stack */}
      <group
        position={[
          Math.cos(vent.angle) * roofR * 0.35,
          roofY + height * vent.heightRatio * 0.5,
          Math.sin(vent.angle) * roofR * 0.35,
        ]}
      >
        <mesh raycast={noopRaycast}>
          <cylinderGeometry
            args={[radius * vent.radiusRatio, radius * vent.radiusRatio, height * vent.heightRatio, 16]}
          />
          <primitive object={detailMaterial('#909aa8')} attach="material" />
        </mesh>
      </group>

      <SensorAnchors radius={radius} height={height} />

      {/* Selection ring */}
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]} raycast={noopRaycast}>
        <ringGeometry args={[radius + 0.35, radius + 0.5, 48]} />
        <meshBasicMaterial color={ringColor} transparent opacity={ringOpacity} />
      </mesh>

      {/* Pick target */}
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
