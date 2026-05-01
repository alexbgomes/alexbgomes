import { useGameState } from '../state/useGameState'
import { getLevel } from '../data/levelSystem'

import './HUD.css'

/** Returns mana % based on hour of day
 * Based on a piecewise function: https://www.desmos.com/calculator/8qfumwrksv
 */
function getManaPercent(): number {
  const now = new Date()
  const h = now.getHours() + (now.getMinutes() / 60)
  if (1 < h && h < 9) return (h - 1) / 8
  if (10 < h && h < 17) return -(0.5 * h - 12) / 7
  if (18 < h && h < 24) return -(0.5 * h - 12) / 6
  if ((9 <= h && h <= 10) || (17 <= h && h <= 18)) return 1
  return 0
}

function getExpPercent(): number {
  const now = new Date()
  const year = now.getFullYear()

  const thisYearBday = new Date(year, 2, 26)
  const nextYearBday = new Date(year + 1, 2, 26)
  const lastYearBday = new Date(year - 1, 2, 26)

  const last = now >= thisYearBday ? thisYearBday : lastYearBday
  const next = now >= thisYearBday ? nextYearBday : thisYearBday

  return (now.getTime() - last.getTime()) / (next.getTime() - last.getTime())
}

export default function HUD() {
  const isLoaded = useGameState((s) => s.isLoaded)
  const view = useGameState((s) => s.view)
  const setView = useGameState((s) => s.setView)

  const level = getLevel()
  const hpPct = 1.0
  const manaPct = getManaPercent()
  const expPct = getExpPercent()
  const isMuted = useGameState((s) => s.isMuted)
  const setIsMuted = useGameState((s) => s.setIsMuted)

  if (!isLoaded || view !== 'room') return null

  return (
    <div className="hud" id="hud-overlay">
      <div className="hud-mute-island">
        <button
          className="hud-btn bgm-btn"
          onClick={() => setIsMuted(!isMuted)}
          aria-label="Toggle Mute"
        >
          <div className="bgm-icon-wrapper">
            <img src="/icons/audio.png" className="hud-btn-img" alt="" aria-hidden="true" />
            {isMuted && <div className="mute-slash" />}
          </div>
        </button>
      </div>

      <div className="hud-nameplate" id="hud-nameplate">
        <div className="hud-name">Alex B. Gomes</div>
        <div className="hud-class">Software Developer</div>
        <div className="hud-stats">
          <span className="hud-level">LVL {level}</span>
        </div>

        <div className="hud-bars" id="hud-bars">
          <StatBar id="bar-hp" label="HP" pct={hpPct} color="hp" />
          <StatBar id="bar-mp" label="MP" pct={manaPct} color="mp" />
          <div className="hud-bar-gap" />
          <StatBar id="bar-exp" label="EXP" pct={expPct} color="exp" />
        </div>
      </div>

      <div className="hud-action-bar" id="hud-action-bar">
        <button
          className="hud-btn"
          id="btn-skills"
          onClick={() => setView('skills')}
        >
          <img src="/icons/skill_tree.png" className="hud-btn-img" alt="" aria-hidden="true" />
          <span className="hud-btn-label">Skills</span>
        </button>

        <button
          className="hud-btn"
          id="btn-contact"
          onClick={() => setView('contact')}
        >
          <img src="/icons/contact.png" className="hud-btn-img" alt="" aria-hidden="true" />
          <span className="hud-btn-label">Contact</span>
        </button>

        <button
          className="hud-btn"
          id="btn-about"
          onClick={() => setView('about')}
        >
          <img src="/icons/about.png" className="hud-btn-img" alt="" aria-hidden="true" />
          <span className="hud-btn-label">About</span>
        </button>
      </div>
    </div>
  )
}

interface StatBarProps {
  id: string
  label: string
  pct: number
  color: 'hp' | 'mp' | 'exp'
}

function StatBar({ id, label, pct, color }: StatBarProps) {
  const fillPct = Math.max(0, Math.min(1, pct)) * 100

  return (
    <div className={`hud-bar-row hud-bar-row--${color}`} id={id}>
      <span className="hud-bar-label">{label}</span>
      <div className="hud-bar-track">
        <div
          className={`hud-bar-fill hud-bar-fill--${color}`}
          style={{ width: `${fillPct}%` }}
        >
          <div className="hud-bar-shimmer" />
          <div className="hud-bar-particles">
            <span className="hud-particle" />
            <span className="hud-particle" />
            <span className="hud-particle" />
          </div>
        </div>
      </div>
    </div>
  )
}
