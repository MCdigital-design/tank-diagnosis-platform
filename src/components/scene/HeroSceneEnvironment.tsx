import { ContactShadows, Environment } from '@react-three/drei'

/** Shared HDR lighting aligned with Twin-Lab viewer (Phase 3 handoff). */
export function HeroSceneEnvironment() {
  return (
    <>
      <fog attach="fog" args={['#0a1420', 28, 72]} />
      <Environment preset="city" />
      <ContactShadows
        position={[0, 0.02, 0]}
        opacity={0.45}
        scale={24}
        blur={2}
        far={12}
      />
    </>
  )
}
