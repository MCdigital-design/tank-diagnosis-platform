import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  clearSession,
  hasSession,
  isPreviewAuthEnabled,
  setSession,
  validateCredentials,
} from '../utils/previewAuth'

type PreviewAuthContextValue = {
  enabled: boolean
  authenticated: boolean
  login: (username: string, password: string) => boolean
  logout: () => void
}

const PreviewAuthContext = createContext<PreviewAuthContextValue | null>(null)

export function PreviewAuthProvider({ children }: { children: ReactNode }) {
  const enabled = isPreviewAuthEnabled()
  const [authenticated, setAuthenticated] = useState(() =>
    enabled ? hasSession() : true,
  )

  const login = useCallback((username: string, password: string) => {
    if (!validateCredentials(username, password)) return false
    setSession()
    setAuthenticated(true)
    return true
  }, [])

  const logout = useCallback(() => {
    clearSession()
    setAuthenticated(false)
  }, [])

  const value = useMemo(
    () => ({ enabled, authenticated, login, logout }),
    [enabled, authenticated, login, logout],
  )

  return (
    <PreviewAuthContext.Provider value={value}>{children}</PreviewAuthContext.Provider>
  )
}

export function usePreviewAuth(): PreviewAuthContextValue {
  const ctx = useContext(PreviewAuthContext)
  if (!ctx) {
    throw new Error('usePreviewAuth must be used within PreviewAuthProvider')
  }
  return ctx
}
