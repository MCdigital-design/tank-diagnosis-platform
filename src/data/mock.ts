export const siteInfo = {
  title: '储罐运行诊断指挥平台',
  location: '东港储运终端',
  subtitle: '汇聚多源监测数据，统一诊断储罐运行状态',
  alertLevel: '高' as const,
}

export const tankAreaStatus = {
  total: 12,
  running: 10,
  maintenance: 1,
  stopped: 1,
  overall: '正常',
}

export const utilization = {
  percent: 68,
  used: 83420,
  capacity: 122000,
}

export const diagnosticModels = [
  { name: '浮盘监测', status: '正常', level: 'ok' },
  { name: '静电风险', status: '可控', level: 'ok' },
  { name: '腐蚀监测', status: '正常', level: 'ok' },
  { name: '密封完整性', status: '正常', level: 'ok' },
  { name: '液位温度', status: '正常', level: 'ok' },
  { name: '压力平衡', status: '低', level: 'warn' },
] as const

export const todaySummary = [
  { label: '今日进罐', value: '12,450', unit: 'm³' },
  { label: '今日出罐', value: '9,870', unit: 'm³' },
  { label: '平均温度', value: '28.6', unit: '°C' },
  { label: '综合健康', value: '89', unit: '/100' },
]

import { initFloatingRoofTravel } from './floatingRoofState'
import { initTankSensorSuites } from './floatingRoofSensors'

export type Tank3DData = {
  id: string
  label: string
  /** 现场对标罐号（浮盘传感布局参考） */
  referenceTankCode?: string
  status: string
  medium: string
  level: number
  temp: number
  pressure: number
  health: number
  conclusion: string
  note?: string
  position: [number, number, number]
  radius: number
  height: number
  liquidColor: string
  /** 小地图 pin 的 CSS 类名后缀 */
  mapPinClass: '1' | '2' | '7'
  /** 关联诊断模型名称 */
  diagnosticTags: string[]
  /** 关联告警 target 匹配关键词 */
  alertKeys: string[]
  volumeM3: number
  capacityM3: number
}

export const tanks3D: Tank3DData[] = [
  {
    id: 'T-01',
    label: '储罐01',
    referenceTankCode: 'TG01',
    status: '正常',
    medium: '原油',
    level: 72.4,
    temp: 31.2,
    pressure: 1.25,
    health: 92,
    conclusion: '运行平稳',
    position: [-5.2, 0, 0.8],
    radius: 2.35,
    height: 5.4,
    liquidColor: '#1a2838',
    mapPinClass: '1',
    diagnosticTags: ['浮盘监测', '液位温度', '密封完整性'],
    alertKeys: ['储罐01', 'T-01'],
    volumeM3: 15200,
    capacityM3: 21000,
  },
  {
    id: 'T-02',
    label: '储罐02',
    referenceTankCode: 'TG04',
    status: '关注',
    medium: '柴油',
    level: 45.8,
    temp: 28.7,
    pressure: 1.18,
    health: 84,
    conclusion: '建议复检',
    note: '浮盘关注 · 静电风险中',
    position: [4.8, 0, -0.4],
    radius: 2.1,
    height: 4.8,
    liquidColor: '#243548',
    mapPinClass: '2',
    diagnosticTags: ['静电风险', '浮盘监测', '压力平衡'],
    alertKeys: ['储罐02', 'T-02'],
    volumeM3: 9800,
    capacityM3: 21400,
  },
]

export type AlertItem = {
  id: string
  time: string
  text: string
  target: string
  sensorId?: string
  level?: 'ok' | 'warn' | 'alarm' | 'fire'
  travelPhase?: string
}

export const alerts: AlertItem[] = [
  {
    id: 'a-fire',
    time: '14:40',
    text: '密封区火警 T4_1 · 当前 11.24°C',
    target: '储罐02',
    sensorId: 'T4_1',
    level: 'fire',
  },
  {
    id: 'a-roof-near',
    time: '14:39',
    text: '浮盘行程接近高限 · 高度 4.14m',
    target: '储罐02',
    level: 'warn',
    travelPhase: 'near_high',
  },
  {
    id: 'a-ground',
    time: '14:38',
    text: '静电接地 G4_2 连接断开',
    target: '储罐02',
    sensorId: 'G4_2',
    level: 'alarm',
  },
  { id: 'a1', time: '14:32', text: '浮盘位移预警', target: '储罐07' },
  { id: 'a2', time: '14:21', text: '静电风险提示', target: '储罐03' },
  {
    id: 'a3',
    time: '14:18',
    text: '液位波动关注',
    target: '储罐02',
    level: 'warn',
  },
  { id: 'a4', time: '14:10', text: '防腐巡检计划', target: '泵组02' },
  {
    id: 'a6',
    time: '14:35',
    text: '密封区温度 T4_3 超限报警',
    target: '储罐02',
    sensorId: 'T4_3',
    level: 'alarm',
  },
  {
    id: 'a7',
    time: '14:34',
    text: '密封区温度 T4_4 温度预警',
    target: '储罐02',
    sensorId: 'T4_4',
    level: 'warn',
  },
]

const tankInitPayload = tanks3D.map((t) => ({
  id: t.id,
  radius: t.radius,
  height: t.height,
  referenceCode: t.referenceTankCode,
}))

initTankSensorSuites(tankInitPayload)
initFloatingRoofTravel(tankInitPayload)

export function getTankById(id: string) {
  return tanks3D.find((t) => t.id === id)
}

export function getAlertsForTank(tank: Tank3DData) {
  return alerts.filter((a) =>
    tank.alertKeys.some((k) => a.target.includes(k) || a.target === tank.label),
  )
}

export function getDiagnosticsForTank(tank: Tank3DData) {
  return diagnosticModels.filter((d) => tank.diagnosticTags.includes(d.name))
}

export const environment = [
  { label: '天气', value: '晴' },
  { label: '气温', value: '28.2°C' },
  { label: '风速', value: '12.6 km/h' },
  { label: '湿度', value: '54%' },
]

export const quickActions = ['罐区总览', '动设备监测', '告警历史', '报告中心']

export const healthDistribution = [
  { range: '90-100', label: '优秀', count: 5, percent: 42, color: '#00e5a0' },
  { range: '70-90', label: '良好', count: 4, percent: 33, color: '#3d9eff' },
  { range: '50-70', label: '一般', count: 2, percent: 17, color: '#ffb347' },
  { range: '0-50', label: '较差', count: 1, percent: 8, color: '#ff4d6d' },
]

export const reports = [
  { period: '日报', status: '已生成' },
  { period: '周报', status: '待生成' },
  { period: '月报', status: '已归档' },
]

export const navItems = [
  { id: 'overview', label: '总览', active: true },
  { id: 'tanks', label: '储罐' },
  { id: 'pipe', label: '管网' },
  { id: 'rotating', label: '动设备' },
  { id: 'maintenance', label: '维保' },
  { id: 'reports', label: '报告' },
  { id: 'system', label: '系统' },
]

export const modelDescription =
  '综合健康度模型融合液位、温度、压力、浮盘位移、静电场强及腐蚀速率等多维指标，采用加权评分与趋势预测，对单罐及罐区整体运行风险进行分级诊断。'
