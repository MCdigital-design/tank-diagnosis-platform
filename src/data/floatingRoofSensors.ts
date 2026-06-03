/**
 * 浮盘屋面传感布局 — 参照 TG04 罐监测界面（温度 T4_x、液位/倾角 D4_x）
 * 屋面坐标：相对罐心 (x, z)，单位米，由罐半径与 layout 比例换算
 */

export type SensorStatus = 'ok' | 'warn' | 'alarm'
export type SensorType = 'temperature' | 'liquid_level' | 'tilt'

export type SensorTimePoint = { time: string; value: number }

export type RoofSensor = {
  id: string
  label: string
  type: SensorType
  /** 罐体局部屋面坐标 (x, z)，y 由浮盘顶面高度决定 */
  roofXZ: [number, number]
  value: number
  unit: string
  status: SensorStatus
  timeSeries: SensorTimePoint[]
  /** 工业阈值说明（展示用） */
  thresholdNote: string
}

export type DeviceInventoryRow = {
  name: string
  count: number
  status: SensorStatus | 'ok'
  statusLabel: string
}

export type FloatingRoofSensorSuite = {
  suiteId: string
  /** 对标现场罐号，如 TG04 */
  referenceTankCode: string
  inventory: DeviceInventoryRow[]
  sensors: RoofSensor[]
}

export const SENSOR_STATUS_COLORS: Record<SensorStatus, string> = {
  ok: '#00e5a0',
  warn: '#ffb347',
  alarm: '#ff4d6d',
}

export const SENSOR_STATUS_LABELS: Record<SensorStatus, string> = {
  ok: '正常',
  warn: '预警',
  alarm: '报警',
}

const HOURS = 24

function buildSeries(base: number, spread: number, status: SensorStatus): SensorTimePoint[] {
  const bump = status === 'alarm' ? spread * 1.4 : status === 'warn' ? spread * 0.8 : spread * 0.35
  return Array.from({ length: HOURS }, (_, i) => {
    const h = (new Date().getHours() - (HOURS - 1 - i) + 48) % 24
    const label = `${String(h).padStart(2, '0')}:00`
    const wobble = Math.sin(i * 0.55) * bump + (Math.random() - 0.5) * bump * 0.25
    return { time: label, value: Math.round((base + wobble) * 1000) / 1000 }
  })
}

function tempStatus(value: number): SensorStatus {
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

/** TG04 温度读数（与参考屏底部一致，T4_1 / T4_3 / T4_4 为报警点） */
const TG04_TEMP_VALUES: Record<string, number> = {
  T4_1: 10.91234,
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

/**
 * 屋面测点布局 — 同心环、等角度，贴近现场浮盘布线习惯：
 * - 外环（rim）：温度 T4_x，密封圈/边缘热监测
 * - 中环：翻液 D4_x，略向内错开半扇区，避免与温度点重叠
 * - 内环：倾角（少点），靠近中心仍沿径向均匀分布
 */
const ROOF_RING = {
  rim: 0.93,
  mid: 0.72,
  inner: 0.48,
} as const

const TG04_TEMP_IDS = Array.from({ length: 18 }, (_, i) => `T4_${i + 1}`)
const TG04_LEVEL_IDS = Array.from({ length: 10 }, (_, i) => `D4_${i + 1}`)
const TG04_TILT_IDS = ['D4_1', 'D4_2', 'D4_3', 'D4_4'] as const

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

/** 18 点温度：外环等分（起始 180°，T4_1 在左侧缘，与 TG04 参考图一致） */
const TG04_TEMP_LAYOUT = ringLayout(TG04_TEMP_IDS, ROOF_RING.rim, 180)

/** 10 点液位：中环，相对外环错开半扇区 */
const TG04_LEVEL_LAYOUT = ringLayout(
  TG04_LEVEL_IDS,
  ROOF_RING.mid,
  180 + 360 / TG04_LEVEL_IDS.length / 2,
)

const TG04_TILT_LAYOUT = ringLayout([...TG04_TILT_IDS], ROOF_RING.inner, 45)

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

function layoutToXZ(angleDeg: number, r01: number, roofRadius: number): [number, number] {
  const rad = (angleDeg * Math.PI) / 180
  const r = r01 * roofRadius * 0.92
  return [Math.cos(rad) * r, Math.sin(rad) * r]
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
      thresholdNote: '浮盘表面温度 · 报警 ≥10.75°C · 预警 ≥10.45°C',
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

  return [...temps, ...levels, ...tilts]
}

function countByStatus(sensors: RoofSensor[], type?: SensorType) {
  const list = type ? sensors.filter((s) => s.type === type) : sensors
  return {
    ok: list.filter((s) => s.status === 'ok').length,
    warn: list.filter((s) => s.status === 'warn').length,
    alarm: list.filter((s) => s.status === 'alarm').length,
    total: list.length,
  }
}

function buildInventory(sensors: RoofSensor[]): DeviceInventoryRow[] {
  const t = countByStatus(sensors, 'temperature')
  const l = countByStatus(sensors, 'liquid_level')
  const tilt = countByStatus(sensors, 'tilt')
  const row = (name: string, count: number, stats: ReturnType<typeof countByStatus>): DeviceInventoryRow => {
    const status: SensorStatus =
      stats.alarm > 0 ? 'alarm' : stats.warn > 0 ? 'warn' : 'ok'
    return {
      name,
      count,
      status,
      statusLabel: SENSOR_STATUS_LABELS[status],
    }
  }
  return [
    row('温度传感器', 34, { ...t, total: 34 }),
    row('倾角传感器', 8, { ...tilt, total: 8 }),
    row('翻液传感器', 18, { ...l, total: 18 }),
    { name: '解调仪', count: 1, status: 'ok', statusLabel: '正常' },
    { name: '显示器', count: 1, status: 'ok', statusLabel: '正常' },
  ]
}

/** 储罐 ID → 传感套件（T-02 对标 TG04 全量浮盘监测） */
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

export function getSensorSummary(tankId: string) {
  const sensors = getSensorsForTank(tankId)
  return countByStatus(sensors)
}

/** 仅用于 3D 点击的屋面测点（温度 18 + 液位 10，与参考图主视觉一致） */
export function getRoofMarkersForTank(tankId: string) {
  return getSensorsForTank(tankId).filter(
    (s) => s.type === 'temperature' || s.type === 'liquid_level',
  )
}

export function getLiveReadingsForTank(tankId: string) {
  const sensors = getSensorsForTank(tankId)
  return {
    temperature: sensors.filter((s) => s.type === 'temperature'),
    liquidLevel: sensors.filter((s) => s.type === 'liquid_level'),
    tilt: sensors.filter((s) => s.type === 'tilt'),
  }
}

/** T-01 简化浮盘监测（8 点外环等分，演示全绿） */
export function buildBasicRoofSensors(roofRadius: number): RoofSensor[] {
  const layout = ringLayout(
    ['T1_1', 'T1_2', 'T1_3', 'T1_4', 'T1_5', 'T1_6', 'T1_7', 'T1_8'],
    ROOF_RING.rim,
    0,
  )
  return layout.map(({ id, angleDeg, r01 }) => {
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
    .filter((s) => s.status === 'alarm' || s.status === 'warn')
    .map((s, i) => ({
      id: `sensor-${tankId}-${s.id}`,
      time: `14:${String(30 + i).padStart(2, '0')}`,
      text:
        s.status === 'alarm'
          ? `${s.label} ${SENSOR_STATUS_LABELS[s.status]} · 当前 ${s.value}${s.unit}`
          : `${s.label} ${SENSOR_STATUS_LABELS[s.status]}`,
      target: tankLabel,
      sensorId: s.id,
      sensorLabel: s.label,
      level: s.status,
    }))
}
