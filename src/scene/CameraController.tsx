import { useRef, useCallback } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import { Vector3 } from 'three'

import { useGameState } from '../state/useGameState'

const DESKTOP_ROOM_POS = new Vector3(2.6095, 3.6592, -14.7388)
const MOBILE_ROOM_POS = new Vector3(6, 6, -12)

const DESKTOP_ROOM_LOOK = new Vector3(1.1162, 1.7329, -9.1658)
const MOBILE_ROOM_LOOK = new Vector3(-1, 0, 0)

/** How close the camera must be to its target before we fire the mailto */
const ARRIVAL_THRESHOLD = 0.4

export default function CameraController() {
  const { camera } = useThree()
  const view = useGameState((s) => s.view)
  const setView = useGameState((s) => s.setView)
  const isMobile = useGameState((s) => s.isMobile)

  // Persistent vectors to avoid GC pressure inside useFrame
  const targetPos = useRef(new Vector3())
  const targetLook = useRef(new Vector3())
  const currentLook = useRef(new Vector3(0, 1, 0))
  const hasOpenedMailto = useRef(false)

  const openMailto = useCallback(() => {
    const a = document.createElement('a')
    a.href = 'mailto:contact@alexbgomes.com'
    a.click()
  }, [])

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    const activeRoomPos = isMobile ? MOBILE_ROOM_POS : DESKTOP_ROOM_POS
    const activeRoomLook = isMobile ? MOBILE_ROOM_LOOK : DESKTOP_ROOM_LOOK

    switch (view) {
      case 'contact': {
        targetPos.current.set(-1, 2.8605, -8.0153)
        targetLook.current.set(-2, 1.9384, -4.2445)

        // Check arrival
        if (
          camera.position.distanceTo(targetPos.current) < ARRIVAL_THRESHOLD &&
          !hasOpenedMailto.current
        ) {
          hasOpenedMailto.current = true
          openMailto()
          // Return to room after a short delay
          setTimeout(() => {
            setView('room')
            hasOpenedMailto.current = false
          }, 1500)
        }
        break
      }
      case 'skills': {
        // Pan towards the computer on the desk
        targetPos.current.set(10, 2, -1)
        // Offset the look target slightly so the camera has a valid direction vector
        targetLook.current.set(10, 2, 0)
        break
      }
      case 'about': {
        // Pan towards the bedside lamp
        targetPos.current.set(-6, 0.5, -5.5)
        targetLook.current.set(-7, -0.5, -5.5)
        break
      }
      case 'room':
      default: {
        // room - camera idles on the character
        targetPos.current.set(
          activeRoomPos.x + Math.sin(t * 0.3) * 0.08,
          activeRoomPos.y + Math.sin(t * 0.5) * 0.04,
          activeRoomPos.z,
        )
        targetLook.current.copy(activeRoomLook)
        hasOpenedMailto.current = false
        break
      }
    }

    camera.position.lerp(targetPos.current, 0.03)
    currentLook.current.lerp(targetLook.current, 0.03)
    camera.lookAt(currentLook.current)
  })

  return null
}