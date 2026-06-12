import { usePreviewAuth } from '../context/PreviewAuthContext'

export function DemoBanner() {
  const { enabled, logout } = usePreviewAuth()

  return (
    <div className="demo-banner" role="note">
      <span className="demo-banner__badge">内部演示</span>
      <span className="demo-banner__text">
        模拟数据 · 非生产环境 · 桌面浏览器体验最佳 · 首次加载约数秒（3D 与图表）
      </span>
      {enabled ? (
        <button type="button" className="demo-banner__logout" onClick={logout}>
          退出预览
        </button>
      ) : null}
    </div>
  )
}
