import {
  SENSOR_STATUS_COLORS,
  SENSOR_STATUS_LABELS,
  type FloatingRoofSensorSuite,
} from '../../data/floatingRoofSensors'
import type { Tank3DData } from '../../data/mock'

type SensorSummary = {
  ok: number
  warn: number
  alarm: number
  total: number
}

type Props = {
  tank: Tank3DData
  pinned: boolean
  sensorSuite: FloatingRoofSensorSuite | null
  sensorSummary: SensorSummary | null
  activeSensorId: string | null
  onPinToggle: () => void
  onClose: () => void
  onSelectSensor: (id: string) => void
}

export function TankIdCard({
  tank,
  pinned,
  sensorSuite,
  sensorSummary,
  activeSensorId,
  onPinToggle,
  onClose,
  onSelectSensor,
}: Props) {
  const isOk = tank.status === '正常'
  const alarmSensors =
    sensorSuite?.sensors.filter((s) => s.status === 'alarm' || s.status === 'warn') ?? []

  return (
    <div
      className={`tank-id-card tank-id-card--dock tank-id-card--${isOk ? 'ok' : 'warn'} ${pinned ? 'tank-id-card--pinned' : ''}`}
      onPointerDown={(e) => e.stopPropagation()}
    >
      <header className="tank-id-card__head">
        <div>
          <span className="tank-id-card__title">{tank.label}</span>
          <span className="tank-id-card__id">
            {tank.id}
            {tank.referenceTankCode ? ` · 对标 ${tank.referenceTankCode}` : ''}
          </span>
        </div>
        <div className="tank-id-card__actions">
          <button
            type="button"
            className={`tank-id-card__pin ${pinned ? 'tank-id-card__pin--on' : ''}`}
            title={pinned ? '取消固定' : '固定信息卡'}
            onClick={(e) => {
              e.stopPropagation()
              onPinToggle()
            }}
          >
            {pinned ? '已固定' : '固定'}
          </button>
          <button
            type="button"
            className="tank-id-card__close"
            title="关闭"
            onClick={(e) => {
              e.stopPropagation()
              onClose()
            }}
          >
            ×
          </button>
        </div>
      </header>
      <span className={`tank-id-card__badge tank-id-card__badge--${isOk ? 'ok' : 'warn'}`}>
        {tank.status}
      </span>

      {sensorSuite && sensorSummary && (
        <>
          <section className="tank-id-card__sensors-intro">
            <p>
              浮盘屋面 IoT 测点 <strong>{sensorSummary.total}</strong> 个（3D 可点选）
            </p>
            <div className="traffic-lights" aria-label="测点状态统计">
              <span className="traffic-lights__item traffic-lights__item--ok">
                正常 {sensorSummary.ok}
              </span>
              <span className="traffic-lights__item traffic-lights__item--warn">
                预警 {sensorSummary.warn}
              </span>
              <span className="traffic-lights__item traffic-lights__item--alarm">
                报警 {sensorSummary.alarm}
              </span>
            </div>
          </section>

          <table className="device-inv">
            <caption>设备信息（浮盘监测）</caption>
            <thead>
              <tr>
                <th>设备</th>
                <th>数量</th>
                <th>状态</th>
              </tr>
            </thead>
            <tbody>
              {sensorSuite.inventory.map((row) => (
                <tr key={row.name}>
                  <td>{row.name}</td>
                  <td>{row.count}</td>
                  <td
                    className={`device-inv__status device-inv__status--${row.status}`}
                    style={
                      row.status !== 'ok'
                        ? { color: SENSOR_STATUS_COLORS[row.status] }
                        : undefined
                    }
                  >
                    {row.statusLabel}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {alarmSensors.length > 0 && (
            <ul className="tank-id-card__alarm-points">
              {alarmSensors.slice(0, 6).map((s) => (
                <li key={s.id}>
                  <button
                    type="button"
                    className={`sensor-pick sensor-pick--${s.status} ${activeSensorId === s.id ? 'sensor-pick--active' : ''}`}
                    onClick={() => onSelectSensor(s.id)}
                  >
                    <span
                      className="sensor-pick__dot"
                      style={{ background: SENSOR_STATUS_COLORS[s.status] }}
                    />
                    {s.label} · {SENSOR_STATUS_LABELS[s.status]} · {s.value}
                    {s.unit}
                  </button>
                </li>
              ))}
            </ul>
          )}

          <p className="tank-id-card__roof-hint">
            外环温度 · 中环液位 · 内环倾角（等角度分布）；绿/黄/红为状态，点击查看 24h 时序
          </p>
        </>
      )}

      <dl className="tank-id-card__metrics">
        <div>
          <dt>介质</dt>
          <dd>{tank.medium}</dd>
        </div>
        <div>
          <dt>液位</dt>
          <dd>{tank.level}%</dd>
        </div>
        <div>
          <dt>温度</dt>
          <dd>{tank.temp}°C</dd>
        </div>
        <div>
          <dt>压力</dt>
          <dd>{tank.pressure} kPa</dd>
        </div>
        <div>
          <dt>库存</dt>
          <dd>{tank.volumeM3.toLocaleString()} m³</dd>
        </div>
        <div>
          <dt>容量</dt>
          <dd>{tank.capacityM3.toLocaleString()} m³</dd>
        </div>
      </dl>
      <p className="tank-id-card__health">
        健康度 <strong>{tank.health}</strong>/100
      </p>
      <p className="tank-id-card__conclusion">{tank.conclusion}</p>
      {tank.note && <p className="tank-id-card__note">{tank.note}</p>}
      {pinned && (
        <p className="tank-id-card__pin-hint">已固定：可自由旋转场景，信息卡不随视角移动</p>
      )}
    </div>
  )
}
