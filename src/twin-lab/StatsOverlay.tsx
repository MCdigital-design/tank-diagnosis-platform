import type { VariantId } from './types'
import { VARIANTS } from './variantConfig'

export type LabStats = {
  fps: number
  loadMs: number
  triangles: number
  fileMb: number | null
  missing: boolean
  usedFallback: boolean
  glbLoaded: boolean
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
      {stats.usedFallback && (
        <p className="lab-stats__warn lab-stats__warn--fallback">
          {stats.missing
            ? `GLB missing — showing procedural DetailedTank fallback. Export: npm run twin-lab:export-procedural`
            : 'Loading GLB… showing procedural DetailedTank until ready.'}
        </p>
      )}
      {!stats.usedFallback && stats.glbLoaded && (
        <p className="lab-stats__ok">GLB loaded — {meta?.glbFile}</p>
      )}
    </footer>
  )
}
