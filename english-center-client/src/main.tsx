import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/index.css'
import App from './App.tsx'
import { Toaster } from "@/components/ui/sonner"
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
    <Toaster position='top-right'/>
  </StrictMode>,
)
