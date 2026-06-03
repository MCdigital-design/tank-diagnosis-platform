import * as THREE from 'three'
import type { Tank3DData } from '../../data/mock'
import type { RoofSensor } from '../../data/floatingRoofSensors'
import { FLOATING_ROOF_TOP_Y } from './tankSceneGeometry'

/** 传感点世界坐标（浮盘顶面上方少许，便于拾取与引线） */
export function getSensorWorldPosition(
  tank: Tank3DData,
  sensor: RoofSensor,
  target = new THREE.Vector3(),
) {
  const [tx, baseY, tz] = tank.position
  const [lx, lz] = sensor.roofXZ
  return target.set(tx + lx, baseY + FLOATING_ROOF_TOP_Y(tank.height) + 0.14, tz + lz)
}
