import { useRef } from 'react'
import type { ComponentProps } from 'react'
import { Vector2, DoubleSide } from 'three'
import type { PointLight } from 'three'
import { useFrame } from '@react-three/fiber'

import { useGameState } from '../state/useGameState'

export default function Note(props: ComponentProps<'group'>) {
  const setView = useGameState((s) => s.setView)
  const glowLight = useRef<PointLight>(null!)
  const points = [];
  for (let i = 0; i < 10; i++) {
    points.push(new Vector2(Math.sin(i * 0.2) * 10 + 5, (i - 5) * 2));
  }

  useFrame((state) => {
    const t = state.clock.getElapsedTime()

    // Pulse the glow light
    if (glowLight.current) {
      glowLight.current.intensity = 5 + Math.sin(t * 2.5) * 4
    }
  })

  const handleClick = () => {
    setView('about')
  }

  return (
    <group {...props}>
      {/* -- Bedside lamp */}
      <group>
        <pointLight
          position={[0, 0, 0]}
          color="#fff1a1"
          intensity={4}
          distance={12}
          decay={10}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
          shadow-camera-far={12}
          shadow-bias={-0.005}
        >
          {/* Debugging mesh */}
          {/* <mesh>
            <sphereGeometry args={[0.2, 16, 16]} />
            <meshBasicMaterial color="#ff00ff" wireframe transparent opacity={0.4} />
          </mesh> */}
        </pointLight>
      </group>

      {/* -- Glow on note */}
      <group>
        <pointLight
          ref={glowLight}
          position={[-0.06, -0.79, 2.48]}
          color="#ccffff"
          intensity={8}
          distance={0.5}
          decay={0.025}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
          shadow-camera-far={2}
          shadow-bias={-0.005}
        >
          {/* Debugging mesh */}
          {/* <mesh>
            <sphereGeometry args={[0.2, 16, 16]} />
            <meshBasicMaterial transparent opacity={0} />
          </mesh> */}
        </pointLight>
      </group>

      {/* --- Clickable hit area --- */}
      <group
        onClick={handleClick}
        onPointerOver={() => {
          document.body.classList.add('cursor--hand')
        }}
        onPointerOut={() => {
          document.body.classList.remove('cursor--hand')
        }}
      >
        <mesh
          position={[0.01, -1.29, 1.13]}
          scale={[2.74, 0.92, 0.61]}
          rotation={[-1.5702590757628299, 0.04871891865246809, 1.5213094932869857]}
        >
          {/* Mesh on table */}
          <planeGeometry args={[1.9, 3.5]} />
          <meshBasicMaterial transparent opacity={0} side={DoubleSide} />
        </mesh>
        <mesh
          position={[-0.28, 0.45, -0.01]}
          scale={0.075}
          rotation={[Math.PI, 0, 0]}
        >
          {/* Mesh on lampshade */}
          <latheGeometry args={[points]} />
          <meshBasicMaterial transparent opacity={0} side={DoubleSide} />
        </mesh>
      </group>
    </group>
  )
}
