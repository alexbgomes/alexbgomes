import { useEffect, useRef } from 'react'
import type { SpotLight } from 'three'
import { useThree } from '@react-three/fiber'

export default function Lighting() {
  const spotRef = useRef<SpotLight>(null!)
  const { scene } = useThree()

  useEffect(() => {
    const light = spotRef.current
    if (!light) return

    light.target.position.set(0, -3, -5)

    scene.add(light.target)

    return () => {
      scene.remove(light.target)
    }
  }, [scene])

  return (
    <>
      {/* Very dim ambient so nothing is totally black */}
      <ambientLight intensity={0.5} color="#b0c4de" />

      {/* -- Main overhead spot - ceiling centre pointing at scene centre -- */}
      <spotLight
        ref={spotRef}
        position={[0.7518, 10.6221, -7.8058]}
        angle={Math.PI / 3}
        penumbra={0.35}
        intensity={80}
        color="#fff5e0"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={0.5}
        shadow-camera-far={20}
        shadow-bias={-0.001}
      />

      {/* -- Cool back-fill - fill only, no shadow cast -- */}
      <pointLight
        position={[-0.8561, 2.7206, -9.5323]}
        color="#88aaff"
        intensity={20}
        distance={20}
        decay={2}
      />

      {/* Hemisphere for sky/ground tint differentiation */}
      <hemisphereLight
        color="#c8d8f0"
        groundColor="#1a1a2a"
        intensity={0.15}
      />
    </>
  )
}
