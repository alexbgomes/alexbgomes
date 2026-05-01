import { useEffect, useRef } from 'react'

import { useGameState } from '../state/useGameState'

export default function BGM() {
  const isLoaded = useGameState((s) => s.isLoaded)
  const isMuted = useGameState((s) => s.isMuted)
  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    if (isLoaded && audioRef.current) {
      audioRef.current.volume = 0.3
    }
  }, [isLoaded])

  return (
    <audio ref={audioRef} src="/audio/bgm.mp3" loop muted={isMuted} />
  )
}
