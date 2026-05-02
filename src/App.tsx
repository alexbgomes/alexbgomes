import { Suspense, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'

import { useGameState } from './state/useGameState'
import Scene from './scene/Scene'
import LoadingScreen from './ui/LoadingScreen'
import OrientationModal from './ui/OrientationModal'
import HUD from './ui/HUD'
import SkillTree from './ui/SkillTree'
import AboutPanel from './ui/AboutPanel'
import BGM from './ui/BGM'

import './App.css'

/**
 * Z Layers (bottom to top):
 *  1. Three canvas
 *  2. HUD overlay
 *  3. Modal panels (Skill Tree / About)
 *  4. Loading screen (peels away)
 */
export default function App() {
  const view = useGameState((s) => s.view)
  const setIsMobile = useGameState((s) => s.setIsMobile)

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < window.innerHeight)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [setIsMobile])

  return (
    <>
      {/* --- 3D Scene --- */}
      <div className="scene-container">
        <div className="scene-wrapper">
          <Canvas
            shadows
            frameloop={view === 'skills' || view === 'about' ? 'never' : 'always'}
            camera={{ position: [0, 2, 6], fov: 60 }}
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              zIndex: 0,
            }}
          >
            <Suspense fallback={null}>
              <Scene />
            </Suspense>
          </Canvas>
        </div>
      </div>

      {/* --- UI Layers --- */}
      <LoadingScreen />
      <BGM />
      <HUD />
      <SkillTree />
      <AboutPanel />
      <OrientationModal />
    </>
  )
}