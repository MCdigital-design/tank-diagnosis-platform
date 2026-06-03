import { useCallback, useRef, useState } from 'react'
import { Canvas, type ThreeEvent } from '@react-three/fiber'
import { Grid, OrbitControls, useCursor } from '@react-three/drei'
import { useTankSelection } from '../../context/TankSelectionContext'
import { tanks3D } from '../../data/mock'
import { scaledCanvasEvents } from './scaledCanvasEvents'
import { SceneSelectionLink, type SceneSelectionLinkHandle } from './SceneSelectionLink'
import { TankIdCard } from './TankIdCard'
import { TankRoofProjector } from './TankRoofProjector'
import { useSelectionLinkLoop } from './useSelectionLinkLoop'

const noopRaycast = () => null

type TankMeshProps = {
  id: string
  position: [number, number, number]
  radius: number
  height: number
  color: string
  selected: boolean
  onSelect: (id: string) => void
}

function SimpleTank({
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

      {/* Single pick target — aligned to visible tank */}
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

type SceneProps = {
  activeTankId: string | null
  onSelectTank: (id: string) => void
}

function Scene({ activeTankId, onSelectTank }: SceneProps) {
  const tankMeshes = tanks3D.map((t, i) => ({
    id: t.id,
    position: t.position,
    radius: t.radius,
    height: t.height,
    color: i === 0 ? '#6b849c' : '#5a7088',
  }))

  return (
    <>
      <color attach="background" args={['#0a1420']} />
      <ambientLight intensity={0.65} />
      <directionalLight position={[10, 14, 8]} intensity={1.1} />
      <directionalLight position={[-6, 8, -4]} intensity={0.35} />

      <Grid
        raycast={noopRaycast}
        position={[0, 0.01, 0]}
        args={[32, 32]}
        cellSize={1}
        cellThickness={0.5}
        sectionSize={5}
        sectionThickness={1}
        fadeDistance={36}
        fadeStrength={1}
      />

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} raycast={noopRaycast}>
        <planeGeometry args={[80, 80]} />
        <meshStandardMaterial color="#0c141e" />
      </mesh>

      {tankMeshes.map((t) => (
        <SimpleTank
          key={t.id}
          {...t}
          selected={activeTankId === t.id}
          onSelect={onSelectTank}
        />
      ))}

      <OrbitControls
        makeDefault
        enableDamping
        dampingFactor={0.08}
        target={[0, 2, 0]}
        minDistance={6}
        maxDistance={28}
        maxPolarAngle={Math.PI / 2 - 0.08}
      />

      {activeTankId && <TankRoofProjector tankId={activeTankId} />}
    </>
  )
}

export function TankScene3D() {
  const {
    activeTank,
    activeTankId,
    pinned,
    selectTank,
    togglePin,
    clearTank,
    dismissIfUnpinned,
  } = useTankSelection()
  const viewportRef = useRef<HTMLDivElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const linkPainter = useRef<SceneSelectionLinkHandle | null>(null)

  const attachLinkPainter = useCallback((handle: SceneSelectionLinkHandle | null) => {
    linkPainter.current = handle
  }, [])

  useSelectionLinkLoop({
    active: !!activeTank,
    viewportRef,
    cardRef,
    painterRef: linkPainter,
  })

  return (
    <div className="scene scene--interactive">
      <p className="scene__hint">
        拖拽旋转 · 滚轮缩放 · 右键平移 · 悬停高亮 · 点击储罐打开右侧信息卡
        {pinned ? ' · 已固定选中' : ' · 点击空白关闭'}
      </p>
      <div className="scene__viewport" ref={viewportRef}>
        <Canvas
          events={scaledCanvasEvents}
          camera={{ position: [9, 5.5, 11], fov: 48, near: 0.1, far: 200 }}
          gl={{ antialias: true, alpha: false }}
          onPointerMissed={() => dismissIfUnpinned()}
          style={{ background: '#0a1420' }}
        >
          <Scene activeTankId={activeTankId} onSelectTank={selectTank} />
        </Canvas>

        {activeTank && <SceneSelectionLink onReady={attachLinkPainter} />}

        {activeTank && (
          <aside className="scene__id-dock" aria-label={`${activeTank.label} 信息卡`}>
            <p className="scene__id-dock-label">储罐详情</p>
            <TankIdCard
              ref={cardRef}
              tank={activeTank}
              pinned={pinned}
              onPinToggle={togglePin}
              onClose={clearTank}
            />
          </aside>
        )}
      </div>
      <div className="scene__selection" data-empty={!activeTank}>
        {activeTank ? (
          <>
            <strong>
              当前：{activeTank.label}
              {pinned ? '（已固定，可自由旋转场景）' : ''}
            </strong>
            <span>信息卡固定在视口右侧；绿线连接浮盘顶面中心与信息卡左侧中部</span>
          </>
        ) : (
          <span>将鼠标移到储罐上会高亮，点击圆柱体打开信息卡</span>
        )}
      </div>
    </div>
  )
}
