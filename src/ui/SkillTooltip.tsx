import { useEffect, useRef } from 'react'

import { useGameState } from '../state/useGameState'

import Bankai from './Bankai'

import './SkillTooltip.css'

export default function SkillTooltip() {
  const hoveredSkill = useGameState((s) => s.hoveredSkill)
  const tooltipRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!hoveredSkill) {
      if (tooltipRef.current) {
        tooltipRef.current.style.opacity = '0'
        tooltipRef.current.style.left = '-1000px'
        tooltipRef.current.style.top = '-1000px'
      }
      return
    }

    if (tooltipRef.current) {
      tooltipRef.current.style.opacity = '0'
    }

    let tooltipWidth = 0
    let tooltipHeight = 0

    const handler = (e: MouseEvent) => {
      if (!tooltipRef.current) return

      if (tooltipWidth === 0) {
        tooltipWidth = tooltipRef.current.offsetWidth
        tooltipHeight = tooltipRef.current.offsetHeight
      }

      let left = e.clientX + 16
      let top = e.clientY + 16

      // Shift left if it overflows the right edge of the window
      if (left + tooltipWidth > window.innerWidth) {
        left = e.clientX - tooltipWidth - 16
      }
      // Shift up if it overflows the bottom edge of the window
      if (top + tooltipHeight > window.innerHeight) {
        top = e.clientY - tooltipHeight - 16
      }

      tooltipRef.current.style.left = `${left}px`
      tooltipRef.current.style.top = `${top}px`
      tooltipRef.current.style.opacity = '1'
    }

    window.addEventListener('mousemove', handler, { passive: true })
    return () => window.removeEventListener('mousemove', handler)
  }, [hoveredSkill])

  // Matrix text glitch effect
  useEffect(() => {
    if (!hoveredSkill || !tooltipRef.current) return

    const glitchElements = tooltipRef.current.querySelectorAll('code-glitch')
    if (glitchElements.length === 0) return

    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*<>'
    const timers: ReturnType<typeof setInterval>[] = []

    glitchElements.forEach((el) => {
      const originalText = el.getAttribute('data-original') || el.textContent || ''
      if (!el.hasAttribute('data-original')) {
        el.setAttribute('data-original', originalText)
      }

      const decodeTime = originalText.length * 90
      const cycleDuration = decodeTime + 2000

      if (el instanceof HTMLElement) {
        el.style.animationDuration = `${cycleDuration}ms`
      }

      const runGlitch = () => {
        let iterations = 0
        const interval = setInterval(() => {
          el.textContent = originalText
            .split('')
            .map((char, index) => {
              if (char === ' ') return ' '
              if (index < iterations) {
                return originalText[index]
              }
              return chars[Math.floor(Math.random() * chars.length)]
            })
            .join('')

          iterations += 1 / 3

          if (iterations >= originalText.length) {
            clearInterval(interval)
            el.textContent = originalText
          }
        }, 30)
        timers.push(interval)
      }

      const triggerInterval = setInterval(runGlitch, cycleDuration)
      timers.push(triggerInterval)

      runGlitch()
    })

    return () => {
      timers.forEach(clearInterval)
    }
  }, [hoveredSkill])

  // Purple wave per-character stagger
  useEffect(() => {
    if (!hoveredSkill || !tooltipRef.current) return

    const waveElements = tooltipRef.current.querySelectorAll('purple-wave')
    waveElements.forEach((el) => {
      if (el.querySelector('span')) return // already processed

      const text = el.textContent || ''

      // Count only non-space characters for timing
      const charCount = text.replace(/ /g, '').length
      const charDelay = 0.06  // seconds between each character's peak
      const waveTravelTime = charCount * charDelay
      const totalDuration = waveTravelTime + 1.2  // + 1.2s flat pause before loop

      // Split into words, wrap each word's chars in a nowrap container so
      // the browser can only break lines at spaces.
      let charIndex = 0
      const words = text.split(' ')
      el.innerHTML = words
        .map((word, wordIdx) => {
          const charSpans = word
            .split('')
            .map((char) => {
              const delay = charIndex * charDelay
              charIndex++
              return `<span style="display:inline-block;animation:purple-wave-char ${totalDuration}s ease-in-out ${delay}s infinite">${char}</span>`
            })
            .join('')
          // Append a real space after every word except the last so the browser
          // treats it as a normal word-break opportunity
          const spacer = wordIdx < words.length - 1 ? ' ' : ''
          return `<span style="display:inline-block;white-space:nowrap">${charSpans}</span>${spacer}`
        })
        .join('')
    })
  }, [hoveredSkill])

  if (!hoveredSkill) return null

  return (
    <div
      ref={tooltipRef}
      className="skill-tooltip"
      style={{
        left: -1000,
        top: -1000,
        opacity: 0
      }}
      role="tooltip"
    >
      {hoveredSkill.special === 'bankai' && <Bankai />}
      <h3>{hoveredSkill.label}</h3>
      <span className="tooltip-type">{hoveredSkill.type}</span>
      <p dangerouslySetInnerHTML={{ __html: hoveredSkill.description }} />
      {hoveredSkill.image && (
        <img src={hoveredSkill.image} alt={hoveredSkill.label} />
      )}
    </div>
  )
}
