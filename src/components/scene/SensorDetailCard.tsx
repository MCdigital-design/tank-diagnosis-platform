import {
  SENSOR_STATUS_COLORS,
  SENSOR_STATUS_LABELS,
  type RoofSensor,
} from '../../data/floatingRoofSensors'
import { SensorTimeSeriesChart } from '../Charts'

const TYPE_LABELS = {
  temperature: '温度传感器',
  liquid_level: '翻液/液位传感器',
  tilt: '倾角传感器',
} as const

type Props = {
  sensor: RoofSensor
  referenceTankCode?: string
  onClose: () => void
}

export function SensorDetailCard({ sensor, referenceTankCode, onClose }: Props) {
  return (
    <div
      className={`sensor-detail-card sensor-detail-card--${sensor.status}`}
      onPointerDown={(e) => e.stopPropagation()}
    >
      <header className="sensor-detail-card__head">
        <div>
          <span className="sensor-detail-card__title">{sensor.label}</span>
          <span className="sensor-detail-card__type">{TYPE_LABELS[sensor.type]}</span>
        </div>
        <button type="button" className="sensor-detail-card__close" onClick={onClose} title="返回储罐概览">
          ×
        </button>
      </header>
      {referenceTankCode && (
        <p className="sensor-detail-card__ref">对标现场 · {referenceTankCode} 浮盘屋面测点</p>
      )}
      <div className="sensor-detail-card__value-row">
        <span
          className="sensor-detail-card__status-dot"
          style={{ background: SENSOR_STATUS_COLORS[sensor.status] }}
        />
        <strong>
          {sensor.value}
          {sensor.unit}
        </strong>
        <span className={`sensor-detail-card__badge sensor-detail-card__badge--${sensor.status}`}>
          {SENSOR_STATUS_LABELS[sensor.status]}
        </span>
      </div>
      <p className="sensor-detail-card__threshold">{sensor.thresholdNote}</p>
      <SensorTimeSeriesChart points={sensor.timeSeries} unit={sensor.unit} status={sensor.status} />
      <p className="sensor-detail-card__hint">近 24 小时趋势 · 与解调仪/上位机时序一致（演示数据）</p>
    </div>
  )
}
