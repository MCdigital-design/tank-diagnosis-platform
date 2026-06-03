import { forwardRef } from 'react'
import type { Tank3DData } from '../../data/mock'

type Props = {
  tank: Tank3DData
  pinned: boolean
  onPinToggle: () => void
  onClose: () => void
}

export const TankIdCard = forwardRef<HTMLDivElement, Props>(function TankIdCard(
  { tank, pinned, onPinToggle, onClose },
  ref,
) {
  const isOk = tank.status === '正常'

  return (
    <div
      ref={ref}
      className={`tank-id-card tank-id-card--dock tank-id-card--${isOk ? 'ok' : 'warn'} ${pinned ? 'tank-id-card--pinned' : ''}`}
      onPointerDown={(e) => e.stopPropagation()}
    >
      <header className="tank-id-card__head">
        <div>
          <span className="tank-id-card__title">{tank.label}</span>
          <span className="tank-id-card__id">{tank.id}</span>
        </div>
        <div className="tank-id-card__actions">
          <button
            type="button"
            className={`tank-id-card__pin ${pinned ? 'tank-id-card__pin--on' : ''}`}
            title={pinned ? '取消固定（旋转场景后点击空白可关闭）' : '固定信息卡（旋转场景时保持显示）'}
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
})
