import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './assets/main.css'
import { initApi } from './services/api'

// Initialize the client-side API layer
initApi()

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
