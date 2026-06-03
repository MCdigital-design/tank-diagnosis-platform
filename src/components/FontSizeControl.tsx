import {
  FONT_SCALE_OPTIONS,
  useDisplayPreferences,
  type FontScaleId,
} from '../context/DisplayPreferencesContext'

export function FontSizeControl() {
  const { fontScaleId, setFontScaleId } = useDisplayPreferences()

  return (
    <div className="font-size-control" role="group" aria-label="界面字号">
      <span className="font-size-control__label">字号</span>
      {FONT_SCALE_OPTIONS.map((opt) => (
        <button
          key={opt.id}
          type="button"
          className={`font-size-control__btn ${fontScaleId === opt.id ? 'font-size-control__btn--on' : ''}`}
          onClick={() => setFontScaleId(opt.id as FontScaleId)}
          title={`${opt.label}字号`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}
