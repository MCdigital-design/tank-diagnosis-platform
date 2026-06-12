import * as THREE from 'three'
import type { Tank3DData } from '../../data/mock'
import type { RoofSensor } from '../../data/floatingRoofSensors'
import { FLOATING_ROOF_TOP_Y } from './tankSceneGeometry'

export function getSensorWorldPosition(
  tank: Tank3DData,
  sensor: RoofSensor,
  target = new THREE.Vector3(),
) {
  const [tx, baseY, tz] = tank.position
  const [lx, lz] = sensor.roofXZ

  if (sensor.placement === 'shell') {
    const shellR = tank.radius * 1.02
    const len = Math.hypot(lx, lz) || 1
    const nx = lx / len
    const nz = lz / len
    return target.set(
      tx + nx * shellR,
      baseY + tank.height * 0.12,
      tz + nz * shellR,
    )
  }

  return target.set(tx + lx, baseY + FLOATING_ROOF_TOP_Y(tank.height) + 0.14, tz + lz)
}
