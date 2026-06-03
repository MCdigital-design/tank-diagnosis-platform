import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { DisplayPreferencesProvider } from './context/DisplayPreferencesContext'
import { TankSelectionProvider } from './context/TankSelectionContext'
import './styles/global.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <DisplayPreferencesProvider>
      <TankSelectionProvider>
        <App />
      </TankSelectionProvider>
    </DisplayPreferencesProvider>
  </StrictMode>,
)
