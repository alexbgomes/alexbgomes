import { useThree, useFrame } from '@react-three/fiber'
import { useGameState } from '../state/useGameState'
import { Vector3 } from 'three'

export default function CameraController() {
  const { camera } = useThree()
  const view = useGameState((s) => s.view)

  const target = new Vector3()

  useFrame(() => {
    if (view === 'character') {
      target.set(0, 2, 7)
    } else {
      target.set(0, 1.5, 3)
    }

    camera.position.lerp(target, 0.05)
    camera.lookAt(0, 2, 6)
  })

  return null
}