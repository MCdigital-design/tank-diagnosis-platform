import type { AlertItem } from './mock'

const LEVEL_ORDER: Record<string, number> = {
  fire: 0,
  alarm: 1,
  warn: 2,
  ok: 3,
}

export function sortAlerts(alerts: AlertItem[]): AlertItem[] {
  return [...alerts].sort((a, b) => {
    const la = LEVEL_ORDER[a.level ?? ''] ?? 4
    const lb = LEVEL_ORDER[b.level ?? ''] ?? 4
    if (la !== lb) return la - lb
    return b.time.localeCompare(a.time)
  })
}
