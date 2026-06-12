import { useEffect, useState } from 'react'
import { DemoBanner } from './components/DemoBanner'
import { DemoModal } from './components/DemoModal'
import { FontSizeControl } from './components/FontSizeControl'
import { DashboardFooter, DashboardLeft, DashboardRight } from './components/DashboardPanels'
import { TankScene3D } from './components/scene/TankScene3D'
import { DEMO_MODE_MESSAGE, useDemoNotice } from './context/DemoNoticeContext'
import { DESIGN_HEIGHT, DESIGN_WIDTH, useViewportScale } from './hooks/useViewportScale'
import { navItems, siteInfo } from './data/mock'

function formatDateTime(d: Date) {
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
}

export default function App() {
  const [now, setNow] = useState(() => formatDateTime(new Date()))
  const [emergencyOpen, setEmergencyOpen] = useState(false)
  const scale = useViewportScale()
  const { showDemoNotice } = useDemoNotice()

  useEffect(() => {
    const t = setInterval(() => setNow(formatDateTime(new Date())), 1000)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    window.dispatchEvent(new Event('resize'))
  }, [scale])

  return (
    <div className="viewport">
      <div
        className="viewport__stage"
        style={{
          width: DESIGN_WIDTH * scale,
          height: DESIGN_HEIGHT * scale,
        }}
      >
        <div
          className="dashboard"
          style={{
            width: DESIGN_WIDTH,
            height: DESIGN_HEIGHT,
            transform: `scale(${scale})`,
          }}
        >
          <div className="dashboard__grid-bg" aria-hidden />

          <DemoBanner />

          <header className="header">
            <div className="header__left">
              <h1 className="header__title">{siteInfo.title}</h1>
              <p className="header__meta">
                <span>{siteInfo.location}</span>
                <span className="header__dot">·</span>
                <span>{siteInfo.subtitle}</span>
              </p>
            </div>
            <div className="header__center">
              <FontSizeControl />
              <span className="header__time">{now}</span>
            </div>
            <div className="header__alert">
              <span className="header__alert-label">告警等级</span>
              <span className="header__alert-value">{siteInfo.alertLevel}</span>
            </div>
          </header>

          <main className="main">
            <DashboardLeft />
            <section className="col col--center">
              <TankScene3D />
            </section>
            <DashboardRight />
          </main>

          <DashboardFooter />

          <nav className="nav">
            {navItems.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`nav__item nav__item--demo ${item.active ? 'nav__item--active' : ''}`}
                title={item.active ? '当前总览页（演示）' : DEMO_MODE_MESSAGE}
                onClick={() => {
                  if (!item.active) showDemoNotice(DEMO_MODE_MESSAGE)
                }}
              >
                {item.label}
              </button>
            ))}
            <button
              type="button"
              className="nav__emergency"
              title="演示：应急广播流程"
              onClick={() => setEmergencyOpen(true)}
            >
              应急广播
            </button>
          </nav>
        </div>
      </div>

      <DemoModal open={emergencyOpen} title="应急广播（演示）" onClose={() => setEmergencyOpen(false)}>
        <p>当前为<strong>内部演示版本</strong>，应急广播尚未接入真实调度与通知系统。</p>
        <p>正式版本将支持：一键广播、预案联动、值班确认与记录归档。</p>
        <p className="demo-modal__note">演示数据不代表现场告警状态，请勿用于真实应急决策。</p>
      </DemoModal>
    </div>
  )
}
