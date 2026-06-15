import { useCallback, useRef } from 'react'
import { Grid, OrbitControls } from '@react-three/drei'
import { useTankSelection } from '../../context/TankSelectionContext'
import { tanks3D } from '../../data/mock'
import { SceneSelectionLink, type SceneSelectionLinkHandle } from './SceneSelectionLink'
import { HeroSceneEnvironment } from './HeroSceneEnvironment'
import { RoofSensorMarkers } from './RoofSensorMarkers'
import { RoofTravelGauge } from './RoofTravelGauge'
import { SensorDetailCard } from './SensorDetailCard'
import { TankIdCard } from './TankIdCard'
import { TankRoofProjector } from './TankRoofProjector'
import { SceneCanvas } from './SceneCanvas'
import { HeroTankModel } from './HeroTankModel'
import { useSelectionLinkLoop } from './useSelectionLinkLoop'

const noopRaycast = () => null

function useHeroGlbLighting(): boolean {
  return import.meta.env.VITE_HERO_TANK_MODE?.toLowerCase() === 'glb'
}

type SceneProps = {
  activeTankId: string | null
  activeSensorId: string | null
  onSelectTank: (id: string) => void
  onSelectSensor: (id: string) => void
}

function Scene({ activeTankId, activeSensorId, onSelectTank, onSelectSensor }: SceneProps) {
  const heroGlbLighting = useHeroGlbLighting()
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
      {heroGlbLighting ? (
        <HeroSceneEnvironment />
      ) : (
        <>
          <ambientLight intensity={0.65} />
          <directionalLight position={[10, 14, 8]} intensity={1.1} />
          <directionalLight position={[-6, 8, -4]} intensity={0.35} />
        </>
      )}

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
        <HeroTankModel
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

      {activeTankId && (
        <>
          <RoofTravelGauge tankId={activeTankId} />
          <RoofSensorMarkers
            tankId={activeTankId}
            activeSensorId={activeSensorId}
            onSelectSensor={onSelectSensor}
          />
          <TankRoofProjector tankId={activeTankId} sensorId={activeSensorId} />
        </>
      )}
    </>
  )
}

export function TankScene3D() {
  const {
    activeTank,
    activeTankId,
    activeSensor,
    activeSensorId,
    sensorSuite,
    sensorSummary,
    roofTravel,
    pinned,
    selectTank,
    selectSensor,
    togglePin,
    clearTank,
    clearSensor,
    dismissInteraction,
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
        3D 演示罐：<strong>储罐01、储罐02</strong>（T-07 等仅在总览标注）· 拖拽旋转 · 滚轮缩放 ·
        点击储罐打开信息卡 · 侧栏为浮盘行程标尺 · 方点=静电接地
        {pinned ? ' · 已固定' : ' · 空白处先关测点再关罐'}
      </p>
      <div className="scene__viewport" ref={viewportRef}>
        <SceneCanvas
          onPointerMissed={() => dismissInteraction()}
          canvasProps={{
            camera: { position: [9, 5.5, 11], fov: 48, near: 0.1, far: 200 },
            style: { background: '#0a1420' },
          }}
        >
          <Scene
            activeTankId={activeTankId}
            activeSensorId={activeSensorId}
            onSelectTank={selectTank}
            onSelectSensor={selectSensor}
          />
        </SceneCanvas>

        {activeTank && <SceneSelectionLink onReady={attachLinkPainter} />}

        {activeTank && (
          <aside className="scene__id-dock" aria-label={`${activeTank.label} 信息卡`}>
            <p className="scene__id-dock-label">
              {activeSensor ? `测点 · ${activeSensor.label}` : '储罐详情'}
            </p>
            <div className="scene__id-dock-stack" ref={cardRef}>
              {!activeSensor && (
                <TankIdCard
                  tank={activeTank}
                  pinned={pinned}
                  sensorSuite={sensorSuite}
                  sensorSummary={sensorSummary}
                  roofTravel={roofTravel}
                  activeSensorId={activeSensorId}
                  onPinToggle={togglePin}
                  onClose={clearTank}
                  onSelectSensor={selectSensor}
                />
              )}
              {activeSensor && (
                <SensorDetailCard
                  sensor={activeSensor}
                  referenceTankCode={activeTank.referenceTankCode}
                  onClose={clearSensor}
                />
              )}
            </div>
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
            <span>
              信息卡固定右侧；引线连接{activeSensor ? '选中测点' : '浮盘顶面中心'}与信息卡
            </span>
          </>
        ) : (
          <span>
            将鼠标移到储罐01/02上会高亮，点击圆柱体打开信息卡（其他罐号见右侧总览）
          </span>
        )}
      </div>
    </div>
  )
}
