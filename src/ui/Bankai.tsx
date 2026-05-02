import { useMemo } from 'react'

import './Bankai.css'

/*
 * Senbonzakura Kageyoshi animation.
 *
 * Phases (10s loop):
 *   1. Sword drops blade-first into the ground
 *   2. V-formation pillar swords rise (front-to-back depth)
 *   3. Pillars flicker, turn white, wipe-fade downward
 *   4. Scatter petals float like leaves across the screen (1s)
 *   5. Dense petal ring swirls in circular orbit toward viewer
 */

const SCATTER_COUNT = 30
const SPIRAL_COUNT = 65

const PINK_PALETTE = [
  'rgba(255, 183, 197, 0.85)',
  'rgba(255, 150, 180, 0.80)',
  'rgba(255, 200, 210, 0.75)',
  'rgba(255, 170, 200, 0.90)',
  'rgba(240, 140, 180, 0.80)',
  'rgba(255, 210, 220, 0.70)',
  'rgba(255, 160, 190, 0.85)',
]

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function rand(min: number, max: number) {
  return Math.random() * (max - min) + min
}

interface ScatterPetal {
  x: string
  y: string
  size: string
  color: string
  driftX: string
  driftY: string
  rotate: string
}

interface SpiralPetal {
  startAngle: number
  size: string
  color: string
  stagger: string
  rStart: string
  rMid: string
  rEnd: string
  rFar: string
}

export default function Bankai() {
  // Scatter petals: random positions, biased towards the pillars (left and right columns)
  const scatterPetals = useMemo(() => {
    return Array.from({ length: SCATTER_COUNT }, (_, i): ScatterPetal => {
      // Alternate left and right side clusters
      const isLeft = i % 2 === 0
      const x = isLeft ? rand(5, 40) : rand(60, 95)

      return {
        x: `${x}%`,
        y: `${rand(10, 75)}%`,
        size: `${rand(3, 7)}px`,
        color: pick(PINK_PALETTE),
        driftX: `${rand(-10, 10)}px`,
        driftY: `${rand(-20, -5)}px`,
        rotate: `${rand(-90, 90)}deg`,
      }
    })
  }, [])

  // Spiral petals: orbital swirl
  const spiralPetals = useMemo(() => {
    return Array.from({ length: SPIRAL_COUNT }, (_, i): SpiralPetal => {
      const startAngle = (i / SPIRAL_COUNT) * 360 + rand(-3, 3)
      return {
        startAngle,
        size: `${rand(2.5, 5)}px`,
        color: pick(PINK_PALETTE),
        stagger: `-${(i * 1.2 / SPIRAL_COUNT).toFixed(3)}s`,
        rStart: `${rand(5, 12)}px`,
        rMid: `${rand(20, 35)}px`,
        rEnd: `${rand(50, 70)}px`,
        rFar: `${rand(100, 140)}px`,
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

      {/* Phase 1: Scatter petals — random positions, leaf-like float */}
      <div className="bankai-scatter">
        {scatterPetals.map((p, i) => (
          <div
            key={i}
            className="scatter-petal"
            style={{
              '--spawn-x': p.x,
              '--spawn-y': p.y,
              '--scatter-size': p.size,
              '--scatter-color': p.color,
              '--drift-x': p.driftX,
              '--drift-y': p.driftY,
              '--scatter-rotate': p.rotate,
            } as React.CSSProperties}
          />
        ))}
      </div>

      {/* Phase 1.5: Converging Spiral — petals spiral inwards counter-clockwise */}
      <div className="bankai-converge">
        {spiralPetals.map((p, i) => (
          <div
            key={i}
            className="converge-orbit"
            style={{ transform: `rotate(${p.startAngle}deg)` }}
          >
            <div
              className="converge-petal"
              style={{
                '--petal-size': p.size,
                '--petal-color': p.color,
                '--petal-stagger': p.stagger,
                '--r-start': p.rStart,
                '--r-mid': p.rMid,
                '--r-end': p.rEnd,
                '--r-far': p.rFar,
              } as React.CSSProperties}
            />
          </div>
        ))}
      </div>

      {/* Phase 2: Spiral petals — orbital swirl */}
      <div className="bankai-petals">
        {spiralPetals.map((p, i) => (
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
                '--petal-stagger': p.stagger,
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
