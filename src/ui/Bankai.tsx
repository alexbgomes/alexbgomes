import { useMemo } from 'react'

import './Bankai.css'

/*
 * Senbonzakura Kageyoshi animation.
 *
 * Phases (12s loop):
 *   1. Sword drops blade-first into the ground
 *   2. V-formation pillar swords rise (front-to-back depth)
 *   3. Pillars fade to white, dissolve into cherry blossom petals
 *   4. Dense petal ring swirls in circular orbit toward viewer
 */

const PETAL_COUNT = 65

const PINK_PALETTE = [
  'rgba(255, 183, 197, 0.85)',
  'rgba(255, 150, 180, 0.80)',
  'rgba(255, 200, 210, 0.75)',
  'rgba(255, 170, 200, 0.90)',
  'rgba(240, 140, 180, 0.80)',
  'rgba(255, 210, 220, 0.70)',
  'rgba(255, 160, 190, 0.85)',
]

const GLOW_PALETTE = [
  'rgba(255, 150, 200, 0.4)',
  'rgba(255, 130, 180, 0.5)',
  'rgba(255, 180, 210, 0.3)',
  'rgba(240, 120, 170, 0.45)',
]

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function rand(min: number, max: number) {
  return Math.random() * (max - min) + min
}

interface PetalData {
  startAngle: number
  size: string
  color: string
  glow: string
  delay: string
  duration: string
  rStart: string
  rMid: string
  rEnd: string
  rFar: string
}

export default function Bankai() {
  const petals = useMemo(() => {
    return Array.from({ length: PETAL_COUNT }, (_, i): PetalData => {
      // Distribute petals evenly with slight jitter for organic feel
      const startAngle = (i / PETAL_COUNT) * 360 + rand(-3, 3)
      const rStart = rand(5, 12)
      const rMid = rand(20, 35)
      const rEnd = rand(50, 70)
      const rFar = rand(100, 140)
      const duration = 12 + rand(-0.4, 0.4)

      return {
        startAngle,
        size: `${rand(2.5, 5)}px`,
        color: pick(PINK_PALETTE),
        glow: pick(GLOW_PALETTE),
        delay: `${(i * 0.025) % 0.8}s`,
        duration: `${duration}s`,
        rStart: `${rStart}px`,
        rMid: `${rMid}px`,
        rEnd: `${rEnd}px`,
        rFar: `${rFar}px`,
      }
    })
  }, [])

  return (
    <div id="bankai">
      <div className="bankai-ambient" />

      {/* Sword: handle at top, guard in middle, blade pointing down */}
      <div className="bankai-sword">
        <div className="bankai-handle" />
        <div className="bankai-guard" />
        <div className="bankai-blade" />
      </div>

      <div className="bankai-ground-flash" />

      {/* V-formation pillar rows stretching front-to-back */}
      <div className="bankai-pillars">
        {/* Left V-row (children 1-5) */}
        <div className="bankai-pillar" />
        <div className="bankai-pillar" />
        <div className="bankai-pillar" />
        <div className="bankai-pillar" />
        <div className="bankai-pillar" />
        {/* Right V-row (children 6-10) */}
        <div className="bankai-pillar" />
        <div className="bankai-pillar" />
        <div className="bankai-pillar" />
        <div className="bankai-pillar" />
        <div className="bankai-pillar" />
      </div>

      {/* Dense cherry blossom petal ring */}
      <div className="bankai-petals">
        {petals.map((p, i) => (
          <div
            key={i}
            className="petal-orbit"
            style={{ transform: `rotate(${p.startAngle}deg)` }}
          >
            <div
              className="bankai-petal"
              style={{
                '--petal-size': p.size,
                '--petal-color': p.color,
                '--petal-glow': p.glow,
                '--petal-delay': p.delay,
                '--petal-duration': p.duration,
                '--r-start': p.rStart,
                '--r-mid': p.rMid,
                '--r-end': p.rEnd,
                '--r-far': p.rFar,
              } as React.CSSProperties}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
