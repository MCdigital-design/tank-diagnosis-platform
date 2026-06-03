import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

export const FONT_SCALE_OPTIONS = [
  { id: 'standard', label: '标准', scale: 1 },
  { id: 'large', label: '大', scale: 1.2 },
  { id: 'xlarge', label: '特大', scale: 1.4 },
] as const

export type FontScaleId = (typeof FONT_SCALE_OPTIONS)[number]['id']

const STORAGE_KEY = 'dashboard-font-scale'

function loadScaleId(): FontScaleId {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const found = FONT_SCALE_OPTIONS.find((o) => o.id === raw)
    if (found) return found.id
  } catch {
    /* ignore */
  }
  return 'large'
}

type DisplayPreferencesContextValue = {
  fontScaleId: FontScaleId
  fontScale: number
  setFontScaleId: (id: FontScaleId) => void
}

const DisplayPreferencesContext = createContext<DisplayPreferencesContextValue | null>(null)

export function DisplayPreferencesProvider({ children }: { children: ReactNode }) {
  const [fontScaleId, setFontScaleIdState] = useState<FontScaleId>(loadScaleId)

  const fontScale =
    FONT_SCALE_OPTIONS.find((o) => o.id === fontScaleId)?.scale ?? 1.2

  const setFontScaleId = useCallback((id: FontScaleId) => {
    setFontScaleIdState(id)
    try {
      localStorage.setItem(STORAGE_KEY, id)
    } catch {
      /* ignore */
    }
  }, [])

  useEffect(() => {
    document.documentElement.dataset.fontScale = fontScaleId
    document.documentElement.style.setProperty('--font-scale', String(fontScale))
    document.documentElement.style.fontSize = `${16 * fontScale}px`
    window.dispatchEvent(new Event('resize'))
  }, [fontScale, fontScaleId])

  const value = useMemo(
    () => ({ fontScaleId, fontScale, setFontScaleId }),
    [fontScale, fontScaleId, setFontScaleId],
  )

  return (
    <DisplayPreferencesContext.Provider value={value}>
      {children}
    </DisplayPreferencesContext.Provider>
  )
}

export function useDisplayPreferences() {
  const ctx = useContext(DisplayPreferencesContext)
  if (!ctx) {
    throw new Error('useDisplayPreferences must be used within DisplayPreferencesProvider')
  }
  return ctx
}
