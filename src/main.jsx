import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { GradeProvider } from './context/GradeContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GradeProvider>
      <App />
    </GradeProvider>
  </StrictMode>,
)
