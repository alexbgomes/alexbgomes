import { useGameState } from '../state/useGameState'

export default function CharacterPanel() {
  const setView = useGameState((s) => s.setView)

  return (
    <div className='panel'>
      <h2>Character Creation</h2>
      <p>Name: Alex</p>
      <p>Class: Software Developer</p>
      <p>Level: 26</p>
      <p>Skill Points Used: 26</p>
      <button onClick={() => setView('contact')}>
        Start Adventure
      </button>
    </div>
  )
}