/**
 * main.jsx
 *
 * Entry point for the app.
 * Mounts the app into the DOM and sets the base path to /focusflow/
 * so routing works correctly when deployed to nuwebspace.
 */

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter basename="/focusflow/">
      <App />
    </BrowserRouter>

  </StrictMode>,
)