import { useEffect, useRef, useState } from 'react'

import { useGameState } from '../state/useGameState'

import './AboutPanel.css'

export default function AboutPanel() {
  const view = useGameState((s) => s.view)
  const setView = useGameState((s) => s.setView)

  const contentRef = useRef<HTMLDivElement>(null)
  const thumbRef = useRef<HTMLDivElement>(null)
  const [showScrollbar, setShowScrollbar] = useState(false)
  const [thumbHeight, setThumbHeight] = useState(0)
  const [thumbTop, setThumbTop] = useState(0)
  
  const isDragging = useRef(false)
  const startDragY = useRef(0)
  const startScrollTop = useRef(0)
  const overlayClickStart = useRef(false)

  // ESC to close
  useEffect(() => {
    if (view !== 'about') return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setView('room')
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [view, setView])

  const updateScrollbar = () => {
    if (!contentRef.current) return
    const { scrollTop, scrollHeight, clientHeight } = contentRef.current
    if (scrollHeight <= clientHeight) {
      setShowScrollbar(false)
      return
    }
    setShowScrollbar(true)
    const currentThumbHeight = Math.max((clientHeight / scrollHeight) * clientHeight, 30)
    const maxScrollTop = scrollHeight - clientHeight
    
    // Track offset matches CSS (top: 16px + bottom: 36px = 52px)
    const TRACK_OFFSET = 52 
    const trackHeight = clientHeight - TRACK_OFFSET
    const maxThumbTop = trackHeight - currentThumbHeight
    
    const scrollRatio = maxScrollTop > 0 ? scrollTop / maxScrollTop : 0
    const currentThumbTop = scrollRatio * maxThumbTop
    
    setThumbHeight(currentThumbHeight)
    setThumbTop(currentThumbTop)
  }

  useEffect(() => {
    if (view !== 'about') return
    updateScrollbar()
    const observer = new ResizeObserver(updateScrollbar)
    if (contentRef.current) observer.observe(contentRef.current)
    return () => observer.disconnect()
  }, [view])

  const handleThumbPointerDown = (e: React.PointerEvent) => {
    if (!contentRef.current) return
    isDragging.current = true
    startDragY.current = e.clientY
    startScrollTop.current = contentRef.current.scrollTop
    document.body.style.userSelect = 'none'
    document.body.classList.add('cursor--hand')
    e.stopPropagation()
  }

  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      if (!isDragging.current || !contentRef.current) return
      const deltaY = e.clientY - startDragY.current
      const { scrollHeight, clientHeight } = contentRef.current
      const maxScrollTop = scrollHeight - clientHeight
      const currentThumbHeight = Math.max((clientHeight / scrollHeight) * clientHeight, 30)
      
      const TRACK_OFFSET = 52
      const trackHeight = clientHeight - TRACK_OFFSET
      const maxThumbTop = trackHeight - currentThumbHeight
      
      const scrollDelta = maxThumbTop > 0 ? deltaY * (maxScrollTop / maxThumbTop) : 0
      contentRef.current.scrollTop = startScrollTop.current + scrollDelta
    }
    
    const handlePointerUp = () => {
      if (isDragging.current) {
        isDragging.current = false
        document.body.style.userSelect = ''
        document.body.classList.remove('cursor--hand')
      }
    }
    
    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('pointerup', handlePointerUp)
    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerup', handlePointerUp)
      document.body.style.userSelect = ''
      document.body.classList.remove('cursor--hand')
    }
  }, [])

  const handleTrackClick = (e: React.MouseEvent) => {
    if (e.target !== e.currentTarget || !contentRef.current) return
    const rect = e.currentTarget.getBoundingClientRect()
    const clickY = e.clientY - rect.top
    const { scrollHeight, clientHeight } = contentRef.current
    const currentThumbHeight = Math.max((clientHeight / scrollHeight) * clientHeight, 30)
    
    const TRACK_OFFSET = 52
    const trackHeight = clientHeight - TRACK_OFFSET
    const newThumbTop = clickY - currentThumbHeight / 2
    const maxThumbTop = trackHeight - currentThumbHeight
    const maxScrollTop = scrollHeight - clientHeight
    const scrollRatio = maxThumbTop > 0 ? newThumbTop / maxThumbTop : 0
    
    contentRef.current.scrollTop = Math.max(0, Math.min(maxScrollTop, scrollRatio * maxScrollTop))
  }

  if (view !== 'about') return null

  return (
    <div
      className="about-overlay"
      id="about-overlay"
      onPointerDown={(e) => {
        if (e.target === e.currentTarget) {
          overlayClickStart.current = true
        } else {
          overlayClickStart.current = false
        }
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget && overlayClickStart.current) {
          setView('room')
        }
        overlayClickStart.current = false
      }}
    >
      <div className="about-panel">
        <header className="about-header">
          <h1>About Me</h1>
          <button
            className="about-close"
            onClick={() => setView('room')}
            aria-label="Close about panel"
          >
            <img src="/icons/close_window.png" className="panel-close-icon" alt="" aria-hidden="true" />
          </button>
          <hr />
        </header>

        <div className="about-content-wrapper">
          <div className="about-content" ref={contentRef} onScroll={updateScrollbar}>
            <h2>Who I Am</h2>
            <p>
              I am a software developer based in Toronto, Canada. I have been involved
              in software development for over 10 years and have a wide range of
              experience in different programming languages and technologies. I enjoy
              learning new technologies and challenges that come with it. I graduted
              from Toronto Metropolitan University (formerly Ryerson University) in
              2022 with honors in Computer Science. I was fortunate to be part of the
              co-op program where I got to work at 3 different companies taking part in
              various roles including software developer, full stack developer, and data
              engineer. After graduation I worked as a lead software engineer at a startup
              where I was able to help shape the direction of the product by taking part
              in high level architectural decisions, leading a team of 3 developers,
              and implementing a variety of features. I am always looking for new
              challenges and opportunities to learn and grow.
            </p>

            <h2>Ethos</h2>
            <p>
              I believe in lifelong learning and continuous learning. I am optimistic
              about technology and its potential to solve real-world problems. My goal
              is to use my skills and knowledge to leave the world better than I found
              it. Aspects of the human condition keep me grounded and allow me to
              approach problems with a level head, a clear mind, and good  faith in
              humanity. I recognize time as our eternal prison that which even light
              cannot escape from, and therefore I try to make the most of the time I have
              to do things that matter to me and hopefully to others as well.
            </p>

            <h2>Elsewebs</h2>
            <div className="about-links">
              <a
                href="https://www.linkedin.com/in/alexbgomes"
                target="_blank"
                rel="noopener noreferrer"
                className="about-btn"
              >
                <img src="/icons/linkedin.png" className="about-btn-img" alt="" aria-hidden="true" />
                <span className="about-btn-label">LinkedIn</span>
              </a>
              <a
                href="https://github.com/alexbgomes"
                target="_blank"
                rel="noopener noreferrer"
                className="about-btn"
              >
                <img src="/icons/github.png" className="about-btn-img" alt="" aria-hidden="true" />
                <span className="about-btn-label">GitHub</span>
              </a>
            </div>

            <h2>Credits &amp; Attribution</h2>
            <p>The following creative assets are used in this project:</p>
            <ul>
              <li>Male Lowpoly Base Mesh by CarvMad from <a href="https://sketchfab.com/3d-models/male-lowpoly-base-mesh-44d9a06186fa4068a50ab421bfcc38b2" target="_blank" rel="noopener noreferrer">Sketchfab</a></li>
              <li>Low Poly Simplistic Room by Bubble3D from <a href="https://sketchfab.com/3d-models/low-poly-simplistic-room-435dacb3be8746378cad27f0f2bab25d" target="_blank" rel="noopener noreferrer">Sketchfab</a></li>
              <li>Cinzel &amp; Inter Fonts via <a href="https://fonts.google.com/" target="_blank" rel="noopener noreferrer">Google Fonts</a></li>
              <li>Icons by <a href="https://icons8.com/" target="_blank" rel="noopener noreferrer">Icons8</a></li>
              <li>Background Music by XtremeFreddy from <a href="https://pixabay.com/music/beats-chill-music-loop-183100/" target="_blank" rel="noopener noreferrer">Pixabay</a></li>
              <li>Sorsele Cubemap by Emil Persson from <a href="https://www.humus.name/index.php?page=Textures&ID=56" target="_blank" rel="noopener noreferrer">Humus</a></li>
              <li>Built with React Three Fiber, Zustand, Vite</li>
            </ul>
          </div>
          {showScrollbar && (
            <div className="custom-scrollbar-track" onClick={handleTrackClick}>
              <div 
                className="custom-scrollbar-thumb" 
                ref={thumbRef}
                onPointerDown={handleThumbPointerDown}
                style={{ 
                  height: `${thumbHeight}px`,
                  transform: `translateY(${thumbTop}px)`
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
