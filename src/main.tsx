import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { DemoNoticeProvider } from './context/DemoNoticeContext'
import { DisplayPreferencesProvider } from './context/DisplayPreferencesContext'
import { TankSelectionProvider } from './context/TankSelectionContext'
import '@fontsource/noto-sans-sc/400.css'
import '@fontsource/noto-sans-sc/500.css'
import '@fontsource/noto-sans-sc/700.css'
import '@fontsource/orbitron/500.css'
import '@fontsource/orbitron/700.css'
import './styles/global.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <DisplayPreferencesProvider>
      <DemoNoticeProvider>
        <TankSelectionProvider>
          <App />
        </TankSelectionProvider>
      </DemoNoticeProvider>
    </DisplayPreferencesProvider>
  </StrictMode>,
)
