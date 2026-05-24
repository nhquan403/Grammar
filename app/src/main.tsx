import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { bootstrapVocabData } from '@/services/vocab-bootstrap-service'

// Bootstrap vocabulary data into IndexedDB on first launch
bootstrapVocabData().catch(console.error)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
