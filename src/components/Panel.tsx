import type { ReactNode } from 'react'

type Props = {
  title: string
  children: ReactNode
  className?: string
  extra?: ReactNode
}

export function Panel({ title, children, className = '', extra }: Props) {
  return (
    <section className={`panel ${className}`}>
      <header className="panel__header">
        <span className="panel__title">{title}</span>
        {extra}
      </header>
      <div className="panel__body">{children}</div>
    </section>
  )
}
