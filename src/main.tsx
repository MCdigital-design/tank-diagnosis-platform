import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { TankSelectionProvider } from './context/TankSelectionContext'
import './styles/global.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <TankSelectionProvider>
      <App />
    </TankSelectionProvider>
  </StrictMode>,
)
