import type { VariantId, VariantMeta } from './types'

export const LAB_TANK_RADIUS = 2.35
export const LAB_TANK_HEIGHT = 5.4

export const VARIANTS: VariantMeta[] = [
  {
    id: 'A',
    label: 'A — Blender MCP',
    route: 'Blender MCP + PBR',
    glbFile: 'tank_a.glb',
    description: 'Agent-native hard-surface modeling in Blender',
  },
  {
    id: 'B',
    label: 'B — Meshy cleanup',
    route: 'Meshy image-to-3D → Blender',
    glbFile: 'tank_b.glb',
    description: 'AI draft mesh cleaned and retargeted',
  },
  {
    id: 'C',
    label: 'C — Catalog',
    route: 'Licensed / free catalog GLB',
    glbFile: 'tank_c.glb',
    description: 'Floating-roof or industrial tank from asset store',
  },
  {
    id: 'D',
    label: 'D — Baseline',
    route: 'Blender script export',
    glbFile: 'tank_d.glb',
    description: 'Procedural script from hero_tank_spec.json',
  },
  {
    id: 'E',
    label: 'E — Unity HDRP',
    route: 'Unity bake → GLB',
    glbFile: 'tank_e.glb',
    description: 'HDRP materials and lightmaps exported to GLB',
  },
  {
    id: 'F',
    label: 'F — Unreal Lumen',
    route: 'Unreal → GLB or stills',
    glbFile: 'tank_f.glb',
    description: 'Lumen-lit hero mesh; GLB or cinematic reference',
  },
]

const VARIANT_IDS = new Set(VARIANTS.map((v) => v.id))

/** Bake-off priority: baseline script first, then catalog, then AI/engine routes. */
export const ROUTE_PRIORITY: VariantId[] = ['D', 'C', 'B', 'A', 'E', 'F']

export function parseVariantFromUrl(): VariantId {
  const raw = new URLSearchParams(window.location.search).get('variant')?.toUpperCase()
  if (raw && VARIANT_IDS.has(raw as VariantId)) {
    return raw as VariantId
  }
  return 'D'
}

export async function resolveBestAvailableVariant(): Promise<VariantId> {
  const urlVariant = new URLSearchParams(window.location.search).get('variant')?.toUpperCase()
  if (urlVariant && VARIANT_IDS.has(urlVariant as VariantId)) {
    return urlVariant as VariantId
  }
  for (const id of ROUTE_PRIORITY) {
    const path = variantGlbPath(id)
    try {
      const res = await fetch(path, { method: 'HEAD' })
      if (res.ok) return id
    } catch {
      /* try next route */
    }
  }
  return 'D'
}

export function variantGlbPath(variant: VariantId): string {
  const meta = VARIANTS.find((v) => v.id === variant)
  const file = meta?.glbFile ?? 'tank_a.glb'
  const base = import.meta.env.BASE_URL
  return `${base}models/variants/${file}`
}

export function referenceMockPath(): string {
  const base = import.meta.env.BASE_URL
  return `${base}docs/reference/v2-command-center-mock.png`
}
