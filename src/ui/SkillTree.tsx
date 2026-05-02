import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { useGameState } from '../state/useGameState'
import { skillTrees } from '../data/skillTreeData'
import { getLevel, getSkillPoints } from '../data/levelSystem'
import SkillIsland from './SkillIsland'
import SkillTooltip from './SkillTooltip'

import './SkillTree.css'

export default function SkillTree() {
  const view = useGameState((s) => s.view)
  const setView = useGameState((s) => s.setView)
  const activeTab = useGameState((s) => s.activeSkillTab)
  const setActiveTab = useGameState((s) => s.setActiveSkillTab)

  const containerRef = useRef<HTMLDivElement>(null)
  const tabsRef = useRef<HTMLDivElement>(null)
  const [dims, setDims] = useState({ w: 0, h: 0 })
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const [scale, setScale] = useState(1)
  const [isDragging, setIsDragging] = useState(false)
  const [sliderStyle, setSliderStyle] = useState({ left: 0, width: 0, top: 0 })
  const dragStart = useRef({ x: 0, y: 0 })
  const pointersRef = useRef<Map<number, { x: number; y: number }>>(new Map())
  const initialPinch = useRef<{ dist: number; scale: number } | null>(null)

  const level = getLevel()
  const totalSP = getSkillPoints(skillTrees)
  const profSP = getSkillPoints([skillTrees[0]])
  const persSP = getSkillPoints([skillTrees[1]])

  useEffect(() => {
    const update = () => {
      if (containerRef.current) {
        setDims({
          w: containerRef.current.clientWidth,
          h: containerRef.current.clientHeight,
        })
      }
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [view])

  // ESC to close
  useEffect(() => {
    if (view !== 'skills') return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setView('room')
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [view, setView])

  // Reset pan/zoom when switching tabs or reopening
  useEffect(() => {
    if (view === 'skills') {
      setOffset({ x: 0, y: 0 })
      setScale(1)
    }
  }, [view, activeTab])

  // Update sliding underline position
  useEffect(() => {
    if (!tabsRef.current) return
    const activeBtn = tabsRef.current.querySelector('.skill-tree-tab.active') as HTMLElement
    if (activeBtn) {
      setSliderStyle({
        left: activeBtn.offsetLeft + activeBtn.clientWidth * 0.12,
        width: activeBtn.clientWidth * 0.76,
        top: activeBtn.offsetTop + activeBtn.offsetHeight - 2,
      })
    }
  }, [activeTab, dims.w])

  const tabData = useMemo(
    () => skillTrees.find((t) => t.id === activeTab) ?? skillTrees[0],
    [activeTab],
  )

  // Stars background - generated once
  const stars = useMemo(
    () =>
      Array.from({ length: 150 }, (_, i) => ({
        id: i,
        x: (Math.random() - 0.5) * 3000,
        y: (Math.random() - 0.5) * 3000,
        r: Math.random() * 1.5 + 0.8,
        delay: `${Math.random() * 5}s`,
        duration: `${6 + Math.random() * 6}s`,
      })),
    [],
  )

  /* --- Drag handlers --- */
  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      pointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY })
      
      if (pointersRef.current.size === 1) {
        setIsDragging(true)
        dragStart.current = { x: e.clientX - offset.x, y: e.clientY - offset.y }
      } else if (pointersRef.current.size === 2) {
        setIsDragging(false)
        const pts = Array.from(pointersRef.current.values())
        const dist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y)
        initialPinch.current = { dist, scale }
      }
      ;(e.target as HTMLElement).setPointerCapture?.(e.pointerId)
    },
    [offset, scale],
  )

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!pointersRef.current.has(e.pointerId)) return
      pointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY })

      if (pointersRef.current.size === 1 && isDragging) {
        const newX = e.clientX - dragStart.current.x
        const newY = e.clientY - dragStart.current.y

        // Preserve standard half-screen bounds but ensure it's at least large enough (800) to view the full content bounds
        const limitX = Math.max(dims.w / 2, 800) * scale
        const limitY = Math.max(dims.h / 2, 500) * scale

        setOffset({
          x: Math.max(-limitX, Math.min(limitX, newX)),
          y: Math.max(-limitY, Math.min(limitY, newY)),
        })
      } else if (pointersRef.current.size === 2 && initialPinch.current) {
        const pts = Array.from(pointersRef.current.values())
        const dist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y)
        const scaleChange = dist / initialPinch.current.dist
        const newScale = Math.max(0.3, Math.min(2.5, initialPinch.current.scale * scaleChange))
        setScale(newScale)
      }
    },
    [isDragging, scale],
  )

  const handlePointerUp = useCallback((e: React.PointerEvent) => {
    pointersRef.current.delete(e.pointerId)
    if (pointersRef.current.size === 0) {
      setIsDragging(false)
      initialPinch.current = null
    } else if (pointersRef.current.size === 1) {
      const remaining = Array.from(pointersRef.current.entries())[0]
      setIsDragging(true)
      dragStart.current = { x: remaining[1].x - offset.x, y: remaining[1].y - offset.y }
      initialPinch.current = null
    }
  }, [offset])

  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      const newScale = Math.max(0.3, Math.min(2.5, scale - e.deltaY * 0.001))
      setScale(newScale)
      // Re-clamp the offset so it never exceeds the bounds of the new scale
      const limitX = Math.max(dims.w / 2, 800) * newScale
      const limitY = Math.max(dims.h / 2, 500) * newScale
      setOffset((prev) => ({
        x: Math.max(-limitX, Math.min(limitX, prev.x)),
        y: Math.max(-limitY, Math.min(limitY, prev.y)),
      }))
    },
    [scale, dims.w, dims.h],
  )

  if (view !== 'skills') return null

  let nodeIndex = 0

  return (
    <div className="skill-tree-overlay" id="skill-tree-overlay">
      {/* --- Tabs --- */}
      <div className="skill-tree-tabs" ref={tabsRef}>
        {skillTrees.map((tree) => (
          <button
            key={tree.id}
            className={`skill-tree-tab ${activeTab === tree.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tree.id)}
          >
            <img
              src={tree.id === 'professional' ? '/icons/profession.png' : '/icons/hobby.png'}
              className="skill-tree-tab-icon"
              alt=""
              aria-hidden="true"
            />
            {tree.label}
          </button>
        ))}
        <div className="tab-underline-slider" style={{ ...sliderStyle, position: 'absolute' }} />
      </div>

      {/* --- Close --- */}
      <button
        className="skill-tree-close"
        onClick={() => setView('room')}
        aria-label="Close skill tree"
      >
        <img src="/icons/close_window.png" className="panel-close-icon" alt="" aria-hidden="true" />
      </button>

      {/* --- SVG Canvas --- */}
      <div
        ref={containerRef}
        className="skill-tree-canvas"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onWheel={handleWheel}
      >
        <svg width={dims.w} height={dims.h}>
          {/* SVG filter definitions */}
          <defs>
            <filter id="nodeGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="lineGlow" filterUnits="userSpaceOnUse" x="-5000" y="-5000" width="10000" height="10000">
              <feGaussianBlur in="SourceGraphic" stdDeviation="1.5" />
            </filter>
            <filter id="iconShadow" x="-30%" y="-30%" width="160%" height="160%">
              <feDropShadow dx="0" dy="1" stdDeviation="2" floodColor="#000000" floodOpacity="0.8" />
            </filter>
          </defs>

          <g
            transform={`translate(${dims.w / 2 + offset.x}, ${dims.h / 2 + offset.y}) scale(${scale})`}
          >
            {/* Background stars */}
            {stars.map((s) => (
              <circle
                key={s.id}
                cx={s.x}
                cy={s.y}
                r={s.r}
                fill="#d4a54a"
                className="skill-star"
                style={{
                  animationDelay: s.delay,
                  animationDuration: s.duration,
                }}
              />
            ))}

            {/* Islands */}
            {tabData.islands.map((island) => {
              const staggerOffset = nodeIndex
              nodeIndex += island.nodes.length
              return (
                <SkillIsland
                  key={island.id}
                  island={island}
                  indexOffset={staggerOffset}
                />
              )
            })}
          </g>
        </svg>
      </div>

      {/* --- Stats Bar --- */}
      <div className="skill-tree-stats">
        <div>
          LVL <span>{level}</span>
        </div>
        <div>
          Total SP: <span>{totalSP}</span>
        </div>
        <div>
          Professional: <span>{profSP}</span>
        </div>
        <div>
          Personal: <span>{persSP}</span>
        </div>
      </div>

      {/* Tooltip (renders above SVG) */}
      <SkillTooltip />
    </div>
  )
}
