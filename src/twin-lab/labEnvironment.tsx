import { ContactShadows, Grid } from '@react-three/drei'
import { useEffect, type ReactNode } from 'react'
import { Color } from 'three'
import { useThree } from '@react-three/fiber'

type Props = {
  children: ReactNode
}

function SceneBackground() {
  const { scene } = useThree()
  useEffect(() => {
    scene.background = new Color('#0a1420')
  }, [scene])
  return null
}

export function LabEnvironment({ children }: Props) {
  return (
    <>
      <SceneBackground />
      <color attach="background" args={['#0a1420']} />
      <fog attach="fog" args={['#0a1420', 28, 72]} />
      <ambientLight intensity={0.55} />
      <directionalLight position={[12, 18, 8]} intensity={1.25} castShadow />
      <directionalLight position={[-8, 10, -6]} intensity={0.45} />
      <hemisphereLight args={['#8ab0d0', '#1a2838', 0.35]} />

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[80, 80]} />
        <meshStandardMaterial color="#0c141e" roughness={0.92} metalness={0.08} />
      </mesh>

      <Grid
        position={[0, 0.02, 0]}
        args={[48, 48]}
        cellSize={1}
        cellThickness={0.45}
        sectionSize={5}
        sectionThickness={0.9}
        fadeDistance={40}
        fadeStrength={1}
        cellColor="#1a3048"
        sectionColor="#2a5070"
      />

      <mesh position={[8, 1.2, -4]} castShadow receiveShadow>
        <cylinderGeometry args={[1.6, 1.6, 3.2, 24]} />
        <meshStandardMaterial color="#4a5a68" roughness={0.7} metalness={0.35} />
      </mesh>
      <mesh position={[-7, 1, 5]} castShadow receiveShadow>
        <cylinderGeometry args={[1.4, 1.4, 2.8, 24]} />
        <meshStandardMaterial color="#455560" roughness={0.72} metalness={0.32} />
      </mesh>

      <ContactShadows
        position={[0, 0.02, 0]}
        opacity={0.55}
        scale={24}
        blur={2.2}
        far={12}
      />

      {children}
    </>
  )
}
