import { useState, useEffect } from 'react'

import { useGameState } from '../state/useGameState'

import './OrientationModal.css'

export default function OrientationModal() {
  const isLoaded = useGameState((s) => s.isLoaded)
  const isMobile = useGameState((s) => s.isMobile)

  const [dismissed, setDismissed] = useState(false)

  // Auto-dismiss if rotated to landscape
  useEffect(() => {
    if (!isMobile) {
      setDismissed(true)
    }
  }, [isMobile])

  // Only show if the loading screen is gone, it's mobile/portrait, and not dismissed
  if (!isLoaded || !isMobile || dismissed) return null

  return (
    <div
      className="orientation-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) setDismissed(true)
      }}
    >
      <div className="orientation-panel">
        <header className="orientation-header">
          <h2>Rotate Device</h2>
          <button
            className="orientation-close"
            onClick={() => setDismissed(true)}
            aria-label="Close orientation panel"
          >
            <img src="/icons/close_window.png" className="panel-close-icon" alt="" aria-hidden="true" />
          </button>
        </header>
        <hr className="orientation-hr" />
        <div className="orientation-content">
          <p>
            For the best interactive experience, please rotate your device to landscape mode.
          </p>
        </div>
      </div>
    </div>
  )
}
