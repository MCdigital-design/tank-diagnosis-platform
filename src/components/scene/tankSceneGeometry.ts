import * as THREE from 'three'
import type { Tank3DData } from '../../data/mock'

/** 浮盘顶盖 mesh 顶面中心（与 SimpleTank 顶盖几何一致：y = height + 0.1） */
export const FLOATING_ROOF_TOP_Y = (height: number) => height + 0.1

export function getFloatingRoofTopCenterWorld(tank: Tank3DData, target = new THREE.Vector3()) {
  const [x, baseY, z] = tank.position
  return target.set(x, baseY + FLOATING_ROOF_TOP_Y(tank.height), z)
}
