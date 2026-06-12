const SESSION_KEY = 'tank-preview-auth'
const SESSION_VALUE = '1'

export function isPreviewAuthEnabled(): boolean {
  return import.meta.env.VITE_PREVIEW_AUTH === 'true'
}

function expectedUser(): string {
  return import.meta.env.VITE_PREVIEW_USER ?? ''
}

function expectedPass(): string {
  return import.meta.env.VITE_PREVIEW_PASS ?? ''
}

export function validateCredentials(username: string, password: string): boolean {
  const user = expectedUser()
  const pass = expectedPass()
  if (!user || !pass) return false
  return username === user && password === pass
}

export function hasSession(): boolean {
  try {
    return sessionStorage.getItem(SESSION_KEY) === SESSION_VALUE
  } catch {
    return false
  }
}

export function setSession(): void {
  sessionStorage.setItem(SESSION_KEY, SESSION_VALUE)
}

export function clearSession(): void {
  sessionStorage.removeItem(SESSION_KEY)
}
