import { ContactShadows, Environment, Grid } from '@react-three/drei'
import type { ReactNode } from 'react'

type Props = {
  children: ReactNode
}

export function LabEnvironment({ children }: Props) {
  return (
    <>
      <color attach="background" args={['#0a1420']} />
      <fog attach="fog" args={['#0a1420', 28, 72]} />
      <ambientLight intensity={0.35} />
      <directionalLight position={[12, 18, 8]} intensity={1.15} castShadow />
      <directionalLight position={[-8, 10, -6]} intensity={0.4} />

      <Environment preset="city" />

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
