export type VariantId = 'A' | 'B' | 'C' | 'D' | 'E' | 'F'

export type CameraPresetId = 'hero45' | 'aerial'

export type ViewMode = 'split' | 'mock' | 'lab3d'

export type VariantMeta = {
  id: VariantId
  label: string
  route: string
  glbFile: string
  description: string
}
