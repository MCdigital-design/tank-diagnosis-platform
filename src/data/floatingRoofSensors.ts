/**
 * 浮盘屋面传感布局 — 参照 TG04 罐监测界面（温度 T4_x、液位/倾角 D4_x）
 * 屋面坐标：相对罐心 (x, z)，单位米，由罐半径与 layout 比例换算
 */

export type SensorStatus = 'ok' | 'warn' | 'alarm' | 'fire'
export type SensorType = 'temperature' | 'liquid_level' | 'tilt' | 'grounding'

export type SensorTimePoint = { time: string; value: number }

export type GroundingStatusEvent = { time: string; connected: boolean }

export type RoofSensor = {
  id: string
  label: string
  type: SensorType
  /** 罐体局部屋面坐标 (x, z)，y 由浮盘顶面高度决定；接地罐体点用 placement */
  roofXZ: [number, number]
  value: number
  unit: string
  status: SensorStatus
  timeSeries: SensorTimePoint[]
  thresholdNote: string
  /** 接地专用 */
  connected?: boolean
  statusEvents?: GroundingStatusEvent[]
  /** 接地罐体点：挂在罐壁低位 */
  placement?: 'roof' | 'shell'
}

export type DeviceInventoryRow = {
  name: string
  count: number
  status: SensorStatus | 'ok'
  statusLabel: string
}

export type FloatingRoofSensorSuite = {
  suiteId: string
  referenceTankCode: string
  inventory: DeviceInventoryRow[]
  sensors: RoofSensor[]
}

export type SensorSummary = {
  ok: number
  warn: number
  alarm: number
  fire: number
  total: number
}

export const SENSOR_STATUS_COLORS: Record<SensorStatus, string> = {
  ok: '#00e5a0',
  warn: '#ffb347',
  alarm: '#ff4d6d',
  fire: '#b91c1c',
}

export const SENSOR_STATUS_LABELS: Record<SensorStatus, string> = {
  ok: '正常',
  warn: '预警',
  alarm: '报警',
  fire: '火警',
}

const SEAL_TEMP_THRESHOLD_NOTE =
  '一次/二次密封圈温度监测 · 火灾预警 · 火警 ≥11.0°C · 报警 ≥10.75°C · 预警 ≥10.45°C'

const HOURS = 24

function buildSeries(base: number, spread: number, status: SensorStatus): SensorTimePoint[] {
  const bump =
    status === 'fire' || status === 'alarm'
      ? spread * 1.4
      : status === 'warn'
        ? spread * 0.8
        : spread * 0.35
  return Array.from({ length: HOURS }, (_, i) => {
    const h = (new Date().getHours() - (HOURS - 1 - i) + 48) % 24
    const label = `${String(h).padStart(2, '0')}:00`
    const wobble = Math.sin(i * 0.55) * bump + (Math.random() - 0.5) * bump * 0.25
    return { time: label, value: Math.round((base + wobble) * 1000) / 1000 }
  })
}

function buildGroundingEvents(connected: boolean): GroundingStatusEvent[] {
  const events: GroundingStatusEvent[] = []
  for (let i = HOURS - 1; i >= 0; i--) {
    const h = (new Date().getHours() - i + 48) % 24
    const label = `${String(h).padStart(2, '0')}:00`
    const wasConnected = i > 2 || connected
    events.push({ time: label, connected: wasConnected })
  }
  return events
}

function tempStatus(value: number): SensorStatus {
  if (value >= 11.0) return 'fire'
  if (value >= 10.75) return 'alarm'
  if (value >= 10.45) return 'warn'
  return 'ok'
}

function levelStatus(value: number): SensorStatus {
  const abs = Math.abs(value)
  if (abs >= 0.5) return 'alarm'
  if (abs >= 0.15) return 'warn'
  return 'ok'
}

function tiltStatus(value: number): SensorStatus {
  if (value >= 0.08) return 'alarm'
  if (value >= 0.04) return 'warn'
  return 'ok'
}

const TG04_TEMP_VALUES: Record<string, number> = {
  T4_1: 11.24,
  T4_2: 10.03636,
  T4_3: 10.88421,
  T4_4: 10.79102,
  T4_5: 9.98211,
  T4_6: 9.87402,
  T4_7: 10.10233,
  T4_8: 9.95678,
  T4_9: 10.22145,
  T4_10: 9.81234,
  T4_11: 10.05432,
  T4_12: 9.90123,
  T4_13: 10.18765,
  T4_14: 9.76543,
  T4_15: 10.03321,
  T4_16: 9.88876,
  T4_17: 10.14567,
  T4_18: 9.92345,
}

const ROOF_RING = {
  rim: 0.93,
  mid: 0.72,
  inner: 0.48,
} as const

const TG04_TEMP_IDS = Array.from({ length: 18 }, (_, i) => `T4_${i + 1}`)
const TG04_LEVEL_IDS = Array.from({ length: 10 }, (_, i) => `D4_${i + 1}`)
const TG04_TILT_IDS = ['D4_1', 'D4_2', 'D4_3', 'D4_4'] as const
const TG04_GROUND_ROOF_IDS = ['G4_1', 'G4_2', 'G4_3', 'G4_4']
const TG04_GROUND_SHELL_IDS = ['G4_T1', 'G4_T2']

function ringLayout(
  ids: string[],
  r01: number,
  startAngleDeg: number,
): { id: string; angleDeg: number; r01: number }[] {
  const step = 360 / ids.length
  return ids.map((id, i) => ({
    id,
    angleDeg: startAngleDeg + i * step,
    r01,
  }))
}

const TG04_TEMP_LAYOUT = ringLayout(TG04_TEMP_IDS, ROOF_RING.rim, 180)
const TG04_LEVEL_LAYOUT = ringLayout(
  TG04_LEVEL_IDS,
  ROOF_RING.mid,
  180 + 360 / TG04_LEVEL_IDS.length / 2,
)
const TG04_TILT_LAYOUT = ringLayout([...TG04_TILT_IDS], ROOF_RING.inner, 45)
const TG04_GROUND_ROOF_LAYOUT = ringLayout(TG04_GROUND_ROOF_IDS, ROOF_RING.inner, 90)
const TG04_GROUND_SHELL_LAYOUT = ringLayout(TG04_GROUND_SHELL_IDS, 1.02, 0)

const TG04_LEVEL_VALUES: Record<string, number> = {
  D4_1: 0.0,
  D4_2: -0.01,
  D4_3: -0.13,
  D4_4: 0.02,
  D4_5: 0.0,
  D4_6: -0.02,
  D4_7: 0.01,
  D4_8: 0.0,
  D4_9: -0.01,
  D4_10: 0.0,
}

const TG04_TILT_VALUES: Record<string, number> = {
  D4_1: 0.05,
  D4_2: 0.02,
  D4_3: 0.0,
  D4_4: 0.01,
}

const TG04_GROUND_CONNECTED: Record<string, boolean> = {
  G4_1: true,
  G4_2: false,
  G4_3: true,
  G4_4: true,
  G4_T1: true,
  G4_T2: true,
}

function layoutToXZ(angleDeg: number, r01: number, roofRadius: number): [number, number] {
  const rad = (angleDeg * Math.PI) / 180
  const r = r01 * roofRadius * 0.92
  return [Math.cos(rad) * r, Math.sin(rad) * r]
}

function buildGroundingSensor(
  id: string,
  angleDeg: number,
  r01: number,
  roofRadius: number,
  placement: 'roof' | 'shell',
): RoofSensor {
  const connected = TG04_GROUND_CONNECTED[id] ?? true
  const status: SensorStatus = connected ? 'ok' : 'alarm'
  return {
    id,
    label: id,
    type: 'grounding',
    roofXZ: layoutToXZ(angleDeg, r01, roofRadius),
    value: connected ? 1 : 0,
    unit: '',
    status,
    connected,
    timeSeries: [],
    statusEvents: buildGroundingEvents(connected),
    thresholdNote: placement === 'shell' ? '罐体静电导出 · 连接监测' : '浮盘静电线 · 连接监测',
    placement,
  }
}

export function buildTg04Sensors(roofRadius: number): RoofSensor[] {
  const temps: RoofSensor[] = TG04_TEMP_LAYOUT.map(({ id, angleDeg, r01 }) => {
    const value = TG04_TEMP_VALUES[id] ?? 10
    const status = tempStatus(value)
    return {
      id,
      label: id,
      type: 'temperature',
      roofXZ: layoutToXZ(angleDeg, r01, roofRadius),
      value,
      unit: '°C',
      status,
      timeSeries: buildSeries(value, 0.35, status),
      thresholdNote: SEAL_TEMP_THRESHOLD_NOTE,
    }
  })

  const levels: RoofSensor[] = TG04_LEVEL_LAYOUT.map(({ id, angleDeg, r01 }) => {
    const value = TG04_LEVEL_VALUES[id] ?? 0
    const status = levelStatus(value)
    return {
      id: `${id}-L`,
      label: id,
      type: 'liquid_level',
      roofXZ: layoutToXZ(angleDeg, r01, roofRadius),
      value,
      unit: 'mm',
      status,
      timeSeries: buildSeries(value, 0.08, status),
      thresholdNote: '翻液/液位偏差 · |值|≥0.5mm 报警',
    }
  })

  const tilts: RoofSensor[] = TG04_TILT_LAYOUT.map(({ id, angleDeg, r01 }) => {
    const value = TG04_TILT_VALUES[id as keyof typeof TG04_TILT_VALUES] ?? 0
    const status = tiltStatus(value)
    return {
      id: `${id}-T`,
      label: `${id}倾角`,
      type: 'tilt',
      roofXZ: layoutToXZ(angleDeg, r01, roofRadius),
      value,
      unit: '°',
      status,
      timeSeries: buildSeries(value, 0.02, status),
      thresholdNote: '浮盘倾角 · 报警 ≥0.08°',
    }
  })

  const groundRoof: RoofSensor[] = TG04_GROUND_ROOF_LAYOUT.map(({ id, angleDeg, r01 }) =>
    buildGroundingSensor(id, angleDeg, r01, roofRadius, 'roof'),
  )

  const groundShell: RoofSensor[] = TG04_GROUND_SHELL_LAYOUT.map(({ id, angleDeg, r01 }) =>
    buildGroundingSensor(id, angleDeg, r01, roofRadius, 'shell'),
  )

  return [...temps, ...levels, ...tilts, ...groundRoof, ...groundShell]
}

function countByStatus(sensors: RoofSensor[], type?: SensorType): SensorSummary {
  const list = type ? sensors.filter((s) => s.type === type) : sensors
  return {
    ok: list.filter((s) => s.status === 'ok').length,
    warn: list.filter((s) => s.status === 'warn').length,
    alarm: list.filter((s) => s.status === 'alarm').length,
    fire: list.filter((s) => s.status === 'fire').length,
    total: list.length,
  }
}

function rowStatus(stats: SensorSummary): SensorStatus | 'ok' {
  if (stats.fire > 0) return 'fire'
  if (stats.alarm > 0) return 'alarm'
  if (stats.warn > 0) return 'warn'
  return 'ok'
}

function buildInventory(sensors: RoofSensor[]): DeviceInventoryRow[] {
  const t = countByStatus(sensors, 'temperature')
  const l = countByStatus(sensors, 'liquid_level')
  const tilt = countByStatus(sensors, 'tilt')
  const g = countByStatus(sensors, 'grounding')

  const row = (name: string, count: number, stats: SensorSummary): DeviceInventoryRow => {
    const status = rowStatus(stats)
    return {
      name,
      count,
      status,
      statusLabel: status === 'ok' ? '正常' : SENSOR_STATUS_LABELS[status],
    }
  }

  return [
    row('密封区温度', t.total, t),
    row('倾角传感器', tilt.total, tilt),
    row('翻液传感器', l.total, l),
    row('静电接地', g.total, g),
    { name: '解调仪', count: 1, status: 'ok', statusLabel: '正常' },
    { name: '显示器', count: 1, status: 'ok', statusLabel: '正常' },
  ]
}

export const tankSensorSuiteMap: Record<string, FloatingRoofSensorSuite> = {}

export function registerTankSensorSuite(
  tankId: string,
  referenceTankCode: string,
  roofRadius: number,
  builder: (r: number) => RoofSensor[],
) {
  const sensors = builder(roofRadius)
  tankSensorSuiteMap[tankId] = {
    suiteId: referenceTankCode,
    referenceTankCode,
    inventory: buildInventory(sensors),
    sensors,
  }
}

export function getSensorSuiteForTank(tankId: string | null | undefined) {
  if (!tankId) return null
  return tankSensorSuiteMap[tankId] ?? null
}

export function getSensorsForTank(tankId: string) {
  return tankSensorSuiteMap[tankId]?.sensors ?? []
}

export function getSensorById(tankId: string, sensorId: string) {
  return getSensorsForTank(tankId).find((s) => s.id === sensorId) ?? null
}

export function getSensorSummary(tankId: string): SensorSummary {
  const sensors = getSensorsForTank(tankId)
  return countByStatus(sensors)
}

export function hasFireSensors(tankId: string) {
  return getSensorsForTank(tankId).some((s) => s.status === 'fire')
}

export function getRoofMarkersForTank(tankId: string) {
  return getSensorsForTank(tankId).filter(
    (s) =>
      s.type === 'temperature' ||
      s.type === 'liquid_level' ||
      s.type === 'grounding',
  )
}

export function getLiveReadingsForTank(tankId: string) {
  const sensors = getSensorsForTank(tankId)
  return {
    temperature: sensors.filter((s) => s.type === 'temperature'),
    liquidLevel: sensors.filter((s) => s.type === 'liquid_level'),
    tilt: sensors.filter((s) => s.type === 'tilt'),
    grounding: sensors.filter((s) => s.type === 'grounding'),
  }
}

export function buildBasicRoofSensors(roofRadius: number): RoofSensor[] {
  const layout = ringLayout(
    ['T1_1', 'T1_2', 'T1_3', 'T1_4', 'T1_5', 'T1_6', 'T1_7', 'T1_8'],
    ROOF_RING.rim,
    0,
  )
  const temps = layout.map(({ id, angleDeg, r01 }) => {
    const value = 28.4 + (angleDeg % 10) * 0.05
    return {
      id,
      label: id,
      type: 'temperature' as const,
      roofXZ: layoutToXZ(angleDeg, r01, roofRadius),
      value,
      unit: '°C',
      status: 'ok' as const,
      timeSeries: buildSeries(value, 0.4, 'ok'),
      thresholdNote: '罐壁区温度 · 运行正常',
    }
  })

  const groundLayout = ringLayout(['G1_1', 'G1_2', 'G1_3', 'G1_4'], ROOF_RING.inner, 45)
  const grounding = groundLayout.map(({ id, angleDeg, r01 }) =>
    buildGroundingSensor(id, angleDeg, r01, roofRadius, 'roof'),
  )

  return [...temps, ...grounding]
}

export function initTankSensorSuites(
  tanks: { id: string; radius: number; referenceCode?: string }[],
) {
  for (const t of tanks) {
    if (t.id === 'T-02') {
      registerTankSensorSuite(t.id, t.referenceCode ?? 'TG04', t.radius, buildTg04Sensors)
    } else if (t.id === 'T-01') {
      registerTankSensorSuite(t.id, 'TG01', t.radius, buildBasicRoofSensors)
    }
  }
}

export function getSensorAlertsFromSuite(tankId: string, tankLabel: string) {
  return getSensorsForTank(tankId)
    .filter((s) => s.status !== 'ok')
    .map((s, i) => {
      const isFire = s.status === 'fire'
      const isGrounding = s.type === 'grounding'
      const prefix = isFire ? '密封区火警' : isGrounding ? '静电接地' : s.label
      const detail =
        isGrounding && s.connected === false
          ? '连接断开'
          : isFire || s.status === 'alarm'
            ? `当前 ${s.value}${s.unit}`
            : SENSOR_STATUS_LABELS[s.status]

      return {
        id: `sensor-${tankId}-${s.id}`,
        time: `14:${String(38 + i).padStart(2, '0')}`,
        text: `${prefix} ${detail}`,
        target: tankLabel,
        sensorId: s.id,
        sensorLabel: s.label,
        level: s.status === 'fire' ? ('fire' as const) : s.status,
      }
    })
}
