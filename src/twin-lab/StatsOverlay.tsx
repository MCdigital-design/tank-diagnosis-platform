import type { VariantId } from './types'
import { VARIANTS } from './variantConfig'

export type LabStats = {
  fps: number
  loadMs: number
  triangles: number
  fileMb: number | null
  missing: boolean
  usedFallback: boolean
}

type Props = {
  variant: VariantId
  stats: LabStats
}

export function StatsOverlay({ variant, stats }: Props) {
  const meta = VARIANTS.find((v) => v.id === variant)

  return (
    <footer className="lab-stats">
      <div className="lab-stats__block">
        <strong>{meta?.label ?? variant}</strong>
        <span>{meta?.route}</span>
      </div>
      <div className="lab-stats__grid">
        <span>FPS: {stats.fps || '—'}</span>
        <span>Load: {stats.loadMs ? `${stats.loadMs} ms` : '—'}</span>
        <span>Tris: {stats.triangles ? stats.triangles.toLocaleString() : '—'}</span>
        <span>GLB: {stats.fileMb != null ? `${stats.fileMb.toFixed(2)} MB` : '—'}</span>
      </div>
      {stats.missing && (
        <p className="lab-stats__warn">
          {stats.usedFallback
            ? `Missing public/models/variants/${meta?.glbFile} — showing procedural fallback (Route D baseline).`
            : 'Awaiting GLB export for this route.'}
        </p>
      )}
    </footer>
  )
}
