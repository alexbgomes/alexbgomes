import { useEffect, useRef, useState, useMemo } from 'react'
import { useProgress } from '@react-three/drei'

import { useGameState } from '../state/useGameState'
import { getLevel } from '../data/levelSystem'

import './LoadingScreen.css'

/** Minimum time (ms) the loading screen is displayed */
const MIN_DISPLAY_MS = 3000

export default function LoadingScreen() {
  const { progress: assetProgress, active } = useProgress()
  const setLoaded = useGameState((s) => s.setLoaded)
  const isLoaded = useGameState((s) => s.isLoaded)

  const isMobile = useGameState((s) => s.isMobile)

  const [fadeOut, setFadeOut] = useState(false)
  const [smoothProgress, setSmoothProgress] = useState(0)

  const minTimeDone = useRef(false)
  const assetsDone = useRef(false)
  const dismissing = useRef(false)

  const level = getLevel()

  const particles = useMemo(
    () =>
      Array.from({ length: 100 }, (_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        delay: `${Math.random() * 5}s`,
        duration: `${3 + Math.random() * 4}s`,
      })),
    [],
  )

  const tryDismiss = useRef(() => {
    if (!minTimeDone.current || !assetsDone.current || dismissing.current) return
    dismissing.current = true

    // Smooth progress loop handles reaching 100, we just wait a tiny bit then fade
    setTimeout(() => setFadeOut(true), 300)
    setTimeout(() => setLoaded(true), 300 + 800)
  })

  // -- Gate 1: minimum display time --
  useEffect(() => {
    const timer = setTimeout(() => {
      minTimeDone.current = true
      tryDismiss.current()
    }, MIN_DISPLAY_MS)
    return () => clearTimeout(timer)
  }, [])

  // -- Gate 2: asset loading complete --
  useEffect(() => {
    if (!active && assetProgress === 0) {
      assetsDone.current = true
      tryDismiss.current()
      return
    }
    if (!active && assetProgress > 0) {
      assetsDone.current = true
      tryDismiss.current()
    }
  }, [active, assetProgress])

  const startTime = useRef(Date.now())
  useEffect(() => {
    let animationFrameId: number

    const update = () => {
      const elapsed = Date.now() - startTime.current

      // Ease-out curve that reaches 99% around MIN_DISPLAY_MS
      const timeRatio = Math.min(1, elapsed / MIN_DISPLAY_MS)
      const sim = 100 * (1 - Math.pow(1 - timeRatio, 3))

      let target = Math.max(sim, assetProgress)

      // Clamp target to 99 if time is not up, or assets aren't done
      if (!minTimeDone.current || !assetsDone.current) {
        target = Math.min(target, 99)
      } else {
        target = 100
      }

      setSmoothProgress((prev) => {
        const next = prev + (target - prev) * 0.1
        if (target === 100 && next > 99.5) return 100
        return next
      })

      animationFrameId = requestAnimationFrame(update)
    }

    animationFrameId = requestAnimationFrame(update)
    return () => cancelAnimationFrame(animationFrameId)
  }, [assetProgress])

  if (isLoaded) return null

  return (
    <div className={`loading-screen ${fadeOut ? 'fade-out' : ''}`}>
      <div className="loading-particles" aria-hidden="true">
        {particles.map((p) => (
          <div
            key={p.id}
            className="particle"
            style={{
              left: p.left,
              animationDelay: p.delay,
              animationDuration: p.duration,
            }}
          />
        ))}
      </div>

      <div className="loading-content">
        <h1 className="loading-title">ALEX B. GOMES</h1>
        <p className="loading-subtitle">Loading experience…</p>

        <div className="loading-bar-container">
          <div
            className="loading-bar-fill"
            style={{ width: `${smoothProgress}%` }}
          />
          <span className="loading-bar-text">{Math.floor(smoothProgress)}%</span>
        </div>

        {isMobile && (
          <div className="loading-mobile-warning">
            View on desktop for a better experience
          </div>
        )}
      </div>
    </div>
  )
}
