/**
 * Shared hero-tank proportions for R3F DetailedTank and scripts/blender/generate_hero_tank.py.
 * Tuned toward docs/reference/v2-command-center-mock.png (外浮顶储罐).
 */
export const heroTankSpec = {
  /** Shell vertical segments (visual weld panels) */
  shellPanels: 24,
  /** Floating roof sits at this fraction of total height */
  roofHeightRatio: 0.94,
  /** Roof diameter vs shell */
  roofRadiusRatio: 0.91,
  /** Top seal / rim gallery */
  seal: {
    heightRatio: 0.028,
    radiusOutRatio: 1.04,
    radiusInRatio: 0.96,
  },
  /** Perimeter walkway on tank rim */
  walkway: {
    heightRatio: 0.018,
    radiusRatio: 1.055,
    railHeightRatio: 0.045,
  },
  /** Base ring / foundation */
  foundation: {
    heightRatio: 0.035,
    radiusRatio: 1.06,
  },
  /** Side ladder + cage (clock position: radians from +X) */
  ladder: {
    angle: -Math.PI / 2,
    widthRatio: 0.055,
    railOffsetRatio: 0.02,
    cageRungs: 14,
  },
  /** Pipe stubs (angle rad, height ratio, length ratio, radius ratio) */
  pipes: [
    { angle: 0.35, heightRatio: 0.22, lengthRatio: 0.28, radiusRatio: 0.035 },
    { angle: 2.1, heightRatio: 0.38, lengthRatio: 0.22, radiusRatio: 0.028 },
    { angle: -1.2, heightRatio: 0.55, lengthRatio: 0.18, radiusRatio: 0.025 },
  ],
  /** Roof vent / gauge stack */
  vent: {
    angle: 0.9,
    radiusRatio: 0.045,
    heightRatio: 0.12,
  },
  /** Sensor anchor names → normalized roof XZ (fraction of radius) */
  anchors: {
    anchor_fire: [0, -0.42],
    anchor_ground: [0.38, 0.1],
    anchor_level: [-0.25, 0.32],
    anchor_seal: [0.15, -0.28],
  },
} as const

export type HeroTankSpec = typeof heroTankSpec
