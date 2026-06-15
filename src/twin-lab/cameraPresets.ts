import type { CameraPresetId } from './types'

export type CameraPreset = {
  id: CameraPresetId
  label: string
  position: [number, number, number]
  target: [number, number, number]
  fov: number
}

export const CAMERA_PRESETS: CameraPreset[] = [
  {
    id: 'hero45',
    label: 'Hero 45°',
    position: [7.2, 3.8, 7.2],
    target: [0, 2.6, 0],
    fov: 42,
  },
  {
    id: 'aerial',
    label: 'Aerial',
    position: [10, 12, 10],
    target: [0, 1.5, 0],
    fov: 48,
  },
]

export function getCameraPreset(id: CameraPresetId): CameraPreset {
  return CAMERA_PRESETS.find((p) => p.id === id) ?? CAMERA_PRESETS[0]
}
