import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  getAlertsForTank,
  getDiagnosticsForTank,
  getTankById,
  type Tank3DData,
} from '../data/mock'

type TankSelectionContextValue = {
  activeTankId: string | null
  activeTank: Tank3DData | null
  /** 固定后，点击空白不会取消选中 */
  pinnedTankId: string | null
  pinned: boolean
  relatedAlerts: ReturnType<typeof getAlertsForTank>
  relatedDiagnostics: ReturnType<typeof getDiagnosticsForTank>
  selectTank: (id: string) => void
  clearTank: () => void
  togglePin: () => void
  dismissIfUnpinned: () => void
}

const TankSelectionContext = createContext<TankSelectionContextValue | null>(null)

export function TankSelectionProvider({ children }: { children: ReactNode }) {
  const [activeTankId, setActiveTankId] = useState<string | null>(null)
  const [pinnedTankId, setPinnedTankId] = useState<string | null>(null)

  const activeTank = activeTankId ? getTankById(activeTankId) ?? null : null
  const pinned = pinnedTankId !== null && pinnedTankId === activeTankId

  const selectTank = useCallback((id: string) => {
    setActiveTankId(id)
    setPinnedTankId(null)
  }, [])

  const clearTank = useCallback(() => {
    setActiveTankId(null)
    setPinnedTankId(null)
  }, [])

  const togglePin = useCallback(() => {
    setPinnedTankId((prev) => {
      if (!activeTankId) return null
      return prev === activeTankId ? null : activeTankId
    })
  }, [activeTankId])

  const dismissIfUnpinned = useCallback(() => {
    setPinnedTankId((pinnedId) => {
      if (!pinnedId) setActiveTankId(null)
      return pinnedId
    })
  }, [])

  const value = useMemo<TankSelectionContextValue>(
    () => ({
      activeTankId,
      activeTank,
      pinnedTankId,
      pinned,
      relatedAlerts: activeTank ? getAlertsForTank(activeTank) : [],
      relatedDiagnostics: activeTank ? getDiagnosticsForTank(activeTank) : [],
      selectTank,
      clearTank,
      togglePin,
      dismissIfUnpinned,
    }),
    [
      activeTank,
      activeTankId,
      pinnedTankId,
      pinned,
      selectTank,
      clearTank,
      togglePin,
      dismissIfUnpinned,
    ],
  )

  return (
    <TankSelectionContext.Provider value={value}>{children}</TankSelectionContext.Provider>
  )
}

export function useTankSelection() {
  const ctx = useContext(TankSelectionContext)
  if (!ctx) throw new Error('useTankSelection must be used within TankSelectionProvider')
  return ctx
}
