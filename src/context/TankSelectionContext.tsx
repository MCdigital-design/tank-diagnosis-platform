import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  getSensorById,
  getSensorAlertsFromSuite,
  getSensorSuiteForTank,
  getSensorSummary,
  type RoofSensor,
} from '../data/floatingRoofSensors'
import {
  getAlertsForTank,
  getDiagnosticsForTank,
  getTankById,
  type AlertItem,
  type Tank3DData,
} from '../data/mock'

type TankSelectionContextValue = {
  activeTankId: string | null
  activeTank: Tank3DData | null
  activeSensorId: string | null
  activeSensor: RoofSensor | null
  sensorSuite: ReturnType<typeof getSensorSuiteForTank>
  sensorSummary: ReturnType<typeof getSensorSummary> | null
  /** 固定后，点击空白不会取消选中 */
  pinnedTankId: string | null
  pinned: boolean
  relatedAlerts: AlertItem[]
  relatedDiagnostics: ReturnType<typeof getDiagnosticsForTank>
  selectTank: (id: string) => void
  selectSensor: (sensorId: string) => void
  clearTank: () => void
  clearSensor: () => void
  togglePin: () => void
  /** 空白点击：先关传感点，再关罐（未固定时） */
  dismissInteraction: () => void
}

const TankSelectionContext = createContext<TankSelectionContextValue | null>(null)

export function TankSelectionProvider({ children }: { children: ReactNode }) {
  const [activeTankId, setActiveTankId] = useState<string | null>(null)
  const [activeSensorId, setActiveSensorId] = useState<string | null>(null)
  const [pinnedTankId, setPinnedTankId] = useState<string | null>(null)

  const activeTank = activeTankId ? getTankById(activeTankId) ?? null : null
  const pinned = pinnedTankId !== null && pinnedTankId === activeTankId
  const activeSensor =
    activeTankId && activeSensorId
      ? getSensorById(activeTankId, activeSensorId)
      : null
  const sensorSuite = getSensorSuiteForTank(activeTankId)
  const sensorSummary = activeTankId ? getSensorSummary(activeTankId) : null

  const selectTank = useCallback((id: string) => {
    setActiveTankId(id)
    setActiveSensorId(null)
    setPinnedTankId(null)
  }, [])

  const selectSensor = useCallback(
    (sensorId: string) => {
      if (!activeTankId) return
      setActiveSensorId(sensorId)
    },
    [activeTankId],
  )

  const clearTank = useCallback(() => {
    setActiveTankId(null)
    setActiveSensorId(null)
    setPinnedTankId(null)
  }, [])

  const clearSensor = useCallback(() => {
    setActiveSensorId(null)
  }, [])

  const togglePin = useCallback(() => {
    setPinnedTankId((prev) => {
      if (!activeTankId) return null
      return prev === activeTankId ? null : activeTankId
    })
  }, [activeTankId])

  const dismissInteraction = useCallback(() => {
    if (activeSensorId) {
      setActiveSensorId(null)
      return
    }
    setPinnedTankId((pinnedId) => {
      if (!pinnedId) setActiveTankId(null)
      return pinnedId
    })
  }, [activeSensorId])

  const relatedAlerts = useMemo(() => {
    if (!activeTank) return []
    const base = getAlertsForTank(activeTank)
    const fromSensors = getSensorAlertsFromSuite(activeTank.id, activeTank.label)
    const merged = [...fromSensors, ...base]
    const seen = new Set<string>()
    return merged.filter((a) => {
      if (seen.has(a.id)) return false
      seen.add(a.id)
      return true
    })
  }, [activeTank])

  const value = useMemo<TankSelectionContextValue>(
    () => ({
      activeTankId,
      activeTank,
      activeSensorId,
      activeSensor,
      sensorSuite,
      sensorSummary,
      pinnedTankId,
      pinned,
      relatedAlerts,
      relatedDiagnostics: activeTank ? getDiagnosticsForTank(activeTank) : [],
      selectTank,
      selectSensor,
      clearTank,
      clearSensor,
      togglePin,
      dismissInteraction,
    }),
    [
      activeTank,
      activeTankId,
      activeSensor,
      activeSensorId,
      sensorSuite,
      sensorSummary,
      pinnedTankId,
      pinned,
      relatedAlerts,
      selectTank,
      selectSensor,
      clearTank,
      clearSensor,
      togglePin,
      dismissInteraction,
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
