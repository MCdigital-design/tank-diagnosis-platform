import { useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { getTankById } from '../../data/mock'
import { getFloatingRoofTopCenterWorld } from './tankSceneGeometry'
import { tankRoofNdc } from './tankLinkState'

type Props = {
  tankId: string
}

/** Projects roof-top world position to NDC only — never touches the DOM. */
export function TankRoofProjector({ tankId }: Props) {
  const world = useMemo(() => new THREE.Vector3(), [])

  useFrame(({ camera }) => {
    const tank = getTankById(tankId)
    if (!tank) {
      tankRoofNdc.current.valid = false
      return
    }

    getFloatingRoofTopCenterWorld(tank, world)
    world.project(camera)

    const onScreen =
      world.x >= -1.05 &&
      world.x <= 1.05 &&
      world.y >= -1.05 &&
      world.y <= 1.05 &&
      world.z > -1 &&
      world.z < 1

    tankRoofNdc.current = {
      x: world.x,
      y: world.y,
      z: world.z,
      valid: onScreen,
    }
  })

  return null
}
