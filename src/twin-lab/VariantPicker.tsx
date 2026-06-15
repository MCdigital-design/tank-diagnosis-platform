import type { CameraPresetId, VariantId, ViewMode } from './types'
import { CAMERA_PRESETS } from './cameraPresets'
import { VARIANTS } from './variantConfig'

type Props = {
  variant: VariantId
  cameraPreset: CameraPresetId
  viewMode: ViewMode
  onVariant: (id: VariantId) => void
  onCamera: (id: CameraPresetId) => void
  onViewMode: (mode: ViewMode) => void
}

export function VariantPicker({
  variant,
  cameraPreset,
  viewMode,
  onVariant,
  onCamera,
  onViewMode,
}: Props) {
  return (
    <header className="lab-toolbar">
      <div className="lab-toolbar__brand">
        <strong>Twin-Lab</strong>
        <span>Hero Tank Bake-off A–F</span>
      </div>

      <div className="lab-toolbar__group">
        <span className="lab-toolbar__label">Variant</span>
        <div className="lab-toolbar__buttons">
          {VARIANTS.map((v) => (
            <button
              key={v.id}
              type="button"
              className={variant === v.id ? 'lab-btn lab-btn--active' : 'lab-btn'}
              onClick={() => onVariant(v.id)}
              title={v.description}
            >
              {v.id}
            </button>
          ))}
        </div>
      </div>

      <div className="lab-toolbar__group">
        <span className="lab-toolbar__label">Camera</span>
        <div className="lab-toolbar__buttons">
          {CAMERA_PRESETS.map((p) => (
            <button
              key={p.id}
              type="button"
              className={cameraPreset === p.id ? 'lab-btn lab-btn--active' : 'lab-btn'}
              onClick={() => onCamera(p.id)}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div className="lab-toolbar__group">
        <span className="lab-toolbar__label">View</span>
        <div className="lab-toolbar__buttons">
          {(['split', 'mock', 'lab3d'] as ViewMode[]).map((mode) => (
            <button
              key={mode}
              type="button"
              className={viewMode === mode ? 'lab-btn lab-btn--active' : 'lab-btn'}
              onClick={() => onViewMode(mode)}
            >
              {mode === 'split' ? 'Split' : mode === 'mock' ? 'Mock' : '3D'}
            </button>
          ))}
        </div>
      </div>

      <p className="lab-toolbar__hint">Keys 1–6 = variants · C = cycle camera</p>
    </header>
  )
}
