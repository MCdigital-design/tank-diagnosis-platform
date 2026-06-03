/** Shared NDC point for roof top — written only from inside Canvas (no DOM). */
export type TankRoofNdc = {
  x: number
  y: number
  z: number
  valid: boolean
}

export const tankRoofNdc: { current: TankRoofNdc } = {
  current: { x: 0, y: 0, z: 0, valid: false },
}
