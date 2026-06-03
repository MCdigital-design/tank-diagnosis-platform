import { useTankSelection } from '../context/TankSelectionContext'
import { HealthDonut, UtilizationGauge } from './Charts'
import { Panel } from './Panel'
import {
  SENSOR_STATUS_COLORS,
  SENSOR_STATUS_LABELS,
  getLiveReadingsForTank,
  getSensorSuiteForTank,
} from '../data/floatingRoofSensors'
import {
  alerts,
  diagnosticModels,
  environment,
  healthDistribution,
  modelDescription,
  quickActions,
  reports,
  tankAreaStatus,
  tanks3D,
  todaySummary,
  utilization,
} from '../data/mock'

function useDashboardFocus() {
  const {
    activeTank,
    activeTankId,
    activeSensorId,
    relatedAlerts,
    relatedDiagnostics,
    selectTank,
    selectSensor,
  } = useTankSelection()

  const alertIds = new Set(relatedAlerts.map((a) => a.id))
  const diagnosticNames = new Set(relatedDiagnostics.map((d) => d.name))
  const sensorSuite = getSensorSuiteForTank(activeTankId)

  return {
    activeTank,
    activeTankId,
    activeSensorId,
    relatedAlerts,
    relatedDiagnostics,
    selectTank,
    selectSensor,
    alertIds,
    diagnosticNames,
    sensorSuite,
  }
}

export function DashboardLeft() {
  const { activeTank, activeTankId, diagnosticNames, sensorSuite } = useDashboardFocus()

  return (
    <aside className="col col--left">
      <Panel title="罐区运行状态" className={activeTank ? 'panel--focused' : ''}>
        <div className="status-grid">
          <div className="status-item">
            <span className="status-item__num">{tankAreaStatus.total}</span>
            <span className="status-item__label">储罐总数</span>
          </div>
          <div className="status-item status-item--run">
            <span className="status-item__num">{tankAreaStatus.running}</span>
            <span className="status-item__label">运行中</span>
          </div>
          <div className="status-item status-item--maint">
            <span className="status-item__num">{tankAreaStatus.maintenance}</span>
            <span className="status-item__label">检修</span>
          </div>
          <div className="status-item status-item--stop">
            <span className="status-item__num">{tankAreaStatus.stopped}</span>
            <span className="status-item__label">停运</span>
          </div>
        </div>
        <div className="overall-badge">
          系统状态：<strong>{tankAreaStatus.overall}</strong>
        </div>
        {activeTank && (
          <p className="panel-focus-line">
            聚焦：<strong>{activeTank.label}</strong> · 液位 {activeTank.level}% · 健康{' '}
            {activeTank.health}/100
          </p>
        )}
      </Panel>

      <Panel title="罐区利用率">
        <UtilizationGauge highlightPercent={activeTank?.level} />
        <p className="util-text">
          已用 <strong>{utilization.used.toLocaleString()}</strong> m³ / 总容量{' '}
          <strong>{utilization.capacity.toLocaleString()}</strong> m³
          {activeTank && (
            <>
              <br />
              <span className="util-text__focus">
                {activeTank.label} 当前约 <strong>{activeTank.volumeM3.toLocaleString()}</strong>{' '}
                m³ / {activeTank.capacityM3.toLocaleString()} m³
              </span>
            </>
          )}
        </p>
      </Panel>

      {activeTank && sensorSuite && (
        <Panel title="浮盘设备信息" className="panel--focused">
          <table className="device-inv device-inv--panel">
            <tbody>
              {sensorSuite.inventory.map((row) => (
                <tr key={row.name}>
                  <td>{row.name}</td>
                  <td className="device-inv__num">{row.count}</td>
                  <td className={`device-inv__status device-inv__status--${row.status}`}>
                    {row.statusLabel}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="panel-focus-line">
            对标 <strong>{sensorSuite.referenceTankCode}</strong> · 与 3D 浮盘测点布局一致
          </p>
        </Panel>
      )}

      <Panel title="诊断模型状态">
        <ul className="model-list">
          {diagnosticModels.map((m) => {
            const linked = activeTankId ? diagnosticNames.has(m.name) : false
            return (
              <li
                key={m.name}
                className={`model-list__item model-list__item--${m.level} ${linked ? 'model-list__item--linked' : ''}`}
              >
                <span>{m.name}</span>
                <span>{m.status}</span>
              </li>
            )
          })}
        </ul>
      </Panel>

      <Panel title="今日运行摘要">
        <div className="summary-grid">
          {todaySummary.map((s) => (
            <div key={s.label} className="summary-card">
              <span className="summary-card__label">{s.label}</span>
              <span className="summary-card__value">
                {s.value}
                <small>{s.unit}</small>
              </span>
            </div>
          ))}
        </div>
      </Panel>
    </aside>
  )
}

export function DashboardRight() {
  const {
    activeTank,
    activeTankId,
    relatedAlerts,
    selectTank,
    selectSensor,
    alertIds,
  } = useDashboardFocus()

  return (
    <aside className="col col--right">
      <Panel title="罐区总览">
        <div className="mini-map">
          <div className="mini-map__grid" />
          {tanks3D.map((t) => (
            <button
              key={t.id}
              type="button"
              className={`mini-map__pin mini-map__pin--${t.mapPinClass} ${activeTankId === t.id ? 'mini-map__pin--active' : ''}`}
              onClick={() => selectTank(t.id)}
              title={`选择 ${t.label}`}
            >
              {t.id}
            </button>
          ))}
          <button
            type="button"
            className="mini-map__pin mini-map__pin--7"
            title="储罐07（未在 3D 场景中）"
            disabled
          >
            T-07
          </button>
        </div>
      </Panel>

      <Panel title="告警与通知">
        <ul className="alert-list">
          {alerts.map((a) => {
            const linked = alertIds.has(a.id)
            const canJump = linked && !!a.sensorId && !!activeTankId
            return (
              <li
                key={a.id}
                className={`alert-list__item ${linked ? 'alert-list__item--linked' : ''} ${a.level ? `alert-list__item--${a.level}` : ''}`}
              >
                <time>{a.time}</time>
                {canJump ? (
                  <button
                    type="button"
                    className="alert-list__jump"
                    onClick={() => selectSensor(a.sensorId!)}
                  >
                    {a.text}（{a.target}）
                  </button>
                ) : (
                  <span>
                    {a.text}（{a.target}）
                  </span>
                )}
              </li>
            )
          })}
        </ul>
        {activeTank && relatedAlerts.length === 0 && (
          <p className="panel-focus-line panel-focus-line--dim">该储罐暂无匹配告警</p>
        )}
      </Panel>

      <Panel title="环境工况">
        <div className="env-grid">
          {environment.map((e) => (
            <div key={e.label} className="env-item">
              <span>{e.label}</span>
              <strong>{e.value}</strong>
            </div>
          ))}
        </div>
        {activeTank && (
          <p className="panel-focus-line">
            {activeTank.label} 罐温 {activeTank.temp}°C · 与环境气温对比参考
          </p>
        )}
      </Panel>

      <Panel title="快捷操作">
        <div className="quick-btns">
          {quickActions.map((label) => (
            <button key={label} type="button" className="quick-btn">
              {label}
            </button>
          ))}
        </div>
      </Panel>
    </aside>
  )
}

function FloatingRoofReadings({ tankId }: { tankId: string }) {
  const { activeSensorId, selectSensor } = useTankSelection()
  const live = getLiveReadingsForTank(tankId)

  const renderGroup = (
    title: string,
    unit: string,
    items: typeof live.temperature,
  ) => (
    <div className="roof-readings__group">
      <h4>
        {title} <small>({unit})</small>
      </h4>
      <ul>
        {items.map((s) => (
          <li key={s.id}>
            <button
              type="button"
              className={`roof-readings__cell roof-readings__cell--${s.status} ${activeSensorId === s.id ? 'roof-readings__cell--active' : ''}`}
              onClick={() => selectSensor(s.id)}
            >
              <span>{s.label}</span>
              <strong style={{ color: SENSOR_STATUS_COLORS[s.status] }}>
                {s.value}
                {s.unit}
              </strong>
              <em>{SENSOR_STATUS_LABELS[s.status]}</em>
            </button>
          </li>
        ))}
      </ul>
    </div>
  )

  return (
    <div className="roof-readings">
      {renderGroup('温度', '°C', live.temperature)}
      {renderGroup('液位', 'mm', live.liquidLevel)}
      {renderGroup('倾角', '°', live.tilt)}
    </div>
  )
}

export function DashboardFooter() {
  const { activeTank, activeTankId } = useDashboardFocus()
  const hasRoof = activeTankId && getSensorSuiteForTank(activeTankId)

  return (
    <footer className={`footer ${hasRoof ? 'footer--with-sensors' : ''}`}>
      {hasRoof && activeTankId && (
        <Panel
          title={`浮盘传感实时 · ${activeTank?.label ?? ''}`}
          className="footer__panel footer__panel--readings"
        >
          <FloatingRoofReadings tankId={activeTankId} />
        </Panel>
      )}

      <Panel title="诊断模型说明" className="footer__panel footer__panel--text">
        <p className="model-desc">
          {activeTank ? `${activeTank.label}：${modelDescription}` : modelDescription}
        </p>
      </Panel>

      <Panel title="定期运行报告" className="footer__panel">
        <ul className="report-list">
          {reports.map((r) => (
            <li key={r.period}>
              <span>{r.period}</span>
              <span
                className={`report-status report-status--${r.status === '待生成' ? 'pending' : 'done'}`}
              >
                {r.status}
              </span>
            </li>
          ))}
        </ul>
      </Panel>

      <Panel title="综合健康度分布" className="footer__panel footer__panel--chart">
        <div className="health-block">
          <HealthDonut highlightHealth={activeTank?.health} />
          <ul className="health-legend">
            {healthDistribution.map((h) => (
              <li
                key={h.range}
                className={
                  activeTank &&
                  activeTank.health >= parseInt(h.range.split('-')[0], 10) &&
                  activeTank.health <= parseInt(h.range.split('-')[1] ?? '100', 10)
                    ? 'health-legend__item--linked'
                    : ''
                }
              >
                <span className="health-legend__dot" style={{ background: h.color }} />
                <span>
                  {h.range}（{h.label}）
                </span>
                <span>
                  {h.count} 台 · {h.percent}%
                </span>
              </li>
            ))}
          </ul>
        </div>
      </Panel>
    </footer>
  )
}
