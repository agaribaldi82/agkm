import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { novedades } from './datos_novedades'



createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App
      
    />
  </StrictMode>,
)
