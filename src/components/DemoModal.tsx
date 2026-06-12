import type { ReactNode } from 'react'

type Props = {
  open: boolean
  title: string
  children: ReactNode
  onClose: () => void
}

export function DemoModal({ open, title, children, onClose }: Props) {
  if (!open) return null

  return (
    <div className="demo-modal" role="dialog" aria-modal="true" aria-labelledby="demo-modal-title">
      <button type="button" className="demo-modal__backdrop" aria-label="关闭" onClick={onClose} />
      <div className="demo-modal__panel">
        <header className="demo-modal__head">
          <h2 id="demo-modal-title">{title}</h2>
          <button type="button" className="demo-modal__close" onClick={onClose}>
            ×
          </button>
        </header>
        <div className="demo-modal__body">{children}</div>
      </div>
    </div>
  )
}
