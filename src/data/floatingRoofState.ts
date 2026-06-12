import type { SensorTimePoint } from './floatingRoofSensors'

export type RoofTravelPhase =
  | 'floating'
  | 'near_high'
  | 'high_alarm'
  | 'near_low'
  | 'low_alarm'
  | 'landed'
  | 'rate_abnormal'

export type FloatingRoofTravel = {
  roofHeight: number
  travelRate: number
  highLimit: number
  lowLimit: number
  phase: RoofTravelPhase
  heightSeries: SensorTimePoint[]
}

export const ROOF_PHASE_LABELS: Record<RoofTravelPhase, string> = {
  floating: '正常漂浮',
  near_high: '接近高限',
  high_alarm: '超高位报警',
  near_low: '接近低限',
  low_alarm: '超低位报警',
  landed: '落底（高风险）',
  rate_abnormal: '升降速率异常',
}

export const ROOF_PHASE_COLORS: Record<RoofTravelPhase, string> = {
  floating: '#00e5a0',
  near_high: '#ffb347',
  high_alarm: '#ff4d6d',
  near_low: '#ffb347',
  low_alarm: '#ff4d6d',
  landed: '#b91c1c',
  rate_abnormal: '#ff4d6d',
}

/** 演示落底罐：改此常量可切换落底演示（默认 T-01 正常漂浮） */
export const DEMO_LANDED_TANK_ID: string | null = null

const HOURS = 24
const RATE_ABNORMAL_THRESHOLD = 120
const NEAR_MARGIN = 0.35
const LANDED_HEIGHT = 0.08

function buildHeightSeries(base: number, spread: number): SensorTimePoint[] {
  return Array.from({ length: HOURS }, (_, i) => {
    const h = (new Date().getHours() - (HOURS - 1 - i) + 48) % 24
    const label = `${String(h).padStart(2, '0')}:00`
    const wobble = Math.sin(i * 0.4) * spread
    return { time: label, value: Math.round((base + wobble) * 100) / 100 }
  })
}

export function derivePhase(
  height: number,
  rate: number,
  highLimit: number,
  lowLimit: number,
): RoofTravelPhase {
  if (height <= LANDED_HEIGHT) return 'landed'
  if (Math.abs(rate) >= RATE_ABNORMAL_THRESHOLD) return 'rate_abnormal'
  if (height >= highLimit) return 'high_alarm'
  if (height >= highLimit - NEAR_MARGIN) return 'near_high'
  if (height <= lowLimit) return 'low_alarm'
  if (height <= lowLimit + NEAR_MARGIN) return 'near_low'
  return 'floating'
}

const tankRoofTravelMap: Record<string, FloatingRoofTravel> = {}

export function registerFloatingRoofTravel(tankId: string, travel: FloatingRoofTravel) {
  tankRoofTravelMap[tankId] = travel
}

export function getFloatingRoofTravel(tankId: string | null | undefined): FloatingRoofTravel | null {
  if (!tankId) return null
  return tankRoofTravelMap[tankId] ?? null
}

export function getRoofTravelAlerts(tankId: string, tankLabel: string) {
  const travel = getFloatingRoofTravel(tankId)
  if (!travel) return []

  const { phase } = travel
  if (phase === 'floating') return []

  const level =
    phase === 'near_high' || phase === 'near_low'
      ? 'warn'
      : phase === 'landed'
        ? 'alarm'
        : 'alarm'

  return [
    {
      id: `roof-travel-${tankId}`,
      time: '14:37',
      text: `浮盘行程 ${ROOF_PHASE_LABELS[phase]} · 高度 ${travel.roofHeight}m · 速率 ${travel.travelRate}mm/min`,
      target: tankLabel,
      level: level as 'warn' | 'alarm',
      travelPhase: phase,
    },
  ]
}

export function initFloatingRoofTravel(
  tanks: { id: string; height: number }[],
) {
  for (const t of tanks) {
    const highLimit = t.height * 0.92
    const lowLimit = t.height * 0.12

    if (DEMO_LANDED_TANK_ID === t.id) {
      registerFloatingRoofTravel(t.id, {
        roofHeight: 0.05,
        travelRate: 0,
        highLimit,
        lowLimit,
        phase: 'landed',
        heightSeries: buildHeightSeries(0.05, 0.02),
      })
      continue
    }

    if (t.id === 'T-02') {
      const roofHeight = highLimit - 0.28
      const travelRate = 18
      registerFloatingRoofTravel(t.id, {
        roofHeight,
        travelRate,
        highLimit,
        lowLimit,
        phase: derivePhase(roofHeight, travelRate, highLimit, lowLimit),
        heightSeries: buildHeightSeries(roofHeight, 0.15),
      })
      continue
    }

    const roofHeight = t.height * 0.55
    const travelRate = 12
    registerFloatingRoofTravel(t.id, {
      roofHeight,
      travelRate,
      highLimit,
      lowLimit,
      phase: derivePhase(roofHeight, travelRate, highLimit, lowLimit),
      heightSeries: buildHeightSeries(roofHeight, 0.2),
    })
  }
}
