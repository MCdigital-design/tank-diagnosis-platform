import type { ReactNode } from 'react'
import { usePreviewAuth } from '../context/PreviewAuthContext'
import { PreviewLogin } from './PreviewLogin'

export function PreviewGate({ children }: { children: ReactNode }) {
  const { enabled, authenticated } = usePreviewAuth()

  if (enabled && !authenticated) {
    return <PreviewLogin />
  }

  return <>{children}</>
}
