import { useEffect } from 'react'

import { useGameState } from '../state/useGameState'

import './AboutPanel.css'

export default function AboutPanel() {
  const view = useGameState((s) => s.view)
  const setView = useGameState((s) => s.setView)

  // ESC to close
  useEffect(() => {
    if (view !== 'about') return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setView('room')
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [view, setView])

  if (view !== 'about') return null

  return (
    <div
      className="about-overlay"
      id="about-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          setView('room')
        }
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

        <div className="about-content">
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
      </div>
    </div>
  )
}
