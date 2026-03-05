import { Canvas } from '@react-three/fiber'
import Experience from './scene/Experience'
import CharacterPanel from './ui/CharacterPanel'
import QuestPanel from './ui/QuestPanel'
import { useGameState } from './state/useGameState'

export default function App() {
  const view = useGameState((s) => s.view)

  return (
    <>
      <Canvas shadows camera={{ position: [0, 2, 6], fov: 60 }}
        style={{ width: '100%', height: '100%', position: 'fixed', top: 0, left: 0 }}
      >
        <Experience />
      </Canvas>

      {view === 'character' && <CharacterPanel />}
      {view === 'contact' && <QuestPanel />}
    </>
  )
}