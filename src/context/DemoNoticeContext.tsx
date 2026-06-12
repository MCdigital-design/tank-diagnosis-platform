import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'

type DemoNoticeContextValue = {
  showDemoNotice: (message: string) => void
}

const DemoNoticeContext = createContext<DemoNoticeContextValue | null>(null)

export function DemoNoticeProvider({ children }: { children: ReactNode }) {
  const [message, setMessage] = useState<string | null>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const showDemoNotice = useCallback((text: string) => {
    setMessage(text)
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => setMessage(null), 3200)
  }, [])

  const value = useMemo(() => ({ showDemoNotice }), [showDemoNotice])

  return (
    <DemoNoticeContext.Provider value={value}>
      {children}
      {message && (
        <div className="demo-toast" role="status" aria-live="polite">
          {message}
        </div>
      )}
    </DemoNoticeContext.Provider>
  )
}

export function useDemoNotice() {
  const ctx = useContext(DemoNoticeContext)
  if (!ctx) throw new Error('useDemoNotice must be used within DemoNoticeProvider')
  return ctx
}

export const DEMO_MODE_MESSAGE = '演示模式：该功能将在正式版本中接入'
