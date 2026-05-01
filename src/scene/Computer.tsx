import { useRef } from 'react'
import type { ComponentProps } from 'react'
import type { PointLight } from 'three'
import { useFrame } from '@react-three/fiber'

import { useGameState } from '../state/useGameState'


export default function Computer(props: ComponentProps<'group'>) {
  const setView = useGameState((s) => s.setView)
  const glowLight = useRef<PointLight>(null!)

  useFrame((state) => {
    const t = state.clock.getElapsedTime()

    // Pulse the glow light
    if (glowLight.current) {
      glowLight.current.intensity = 5 + Math.sin(t * 2.5) * 4
    }
  })

  const handleClick = () => {
    setView('skills')
  }

  return (
    <group {...props}>
      {/* --- Glowing screen --- */}
      <group
        position={[0, 0, 0]}
        rotation={[0, 0, 0]}
        scale={[1, 1, 1]}
      >
        <rectAreaLight
          width={1}
          height={1}
          intensity={20}
          color="#00eeff" rotation={[-3.105315690691491, 0.3839109010524929, 3.134541540543726]}
        />
        {/* Emulate the screen being on */}
        <mesh>
          <planeGeometry args={[1, 1]} />
          <meshBasicMaterial color="#ccffff" toneMapped={false} />
        </mesh>
        {/* Auxiliary point light to cast shadows (rectAreaLight does not cast shadows) */}
        <pointLight
          ref={glowLight}
          color="#00eeff"
          intensity={10}
          distance={10}
          castShadow
          position={[0, 0, 0.5]}
          shadow-bias={-0.005}
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
      </group>

      {/* --- Clickable hit area --- */}
      <mesh
        position={[0, 0, 0]}
        onClick={handleClick}
        onPointerOver={() => {
          document.body.classList.add('cursor--hand')
        }}
        onPointerOut={() => {
          document.body.classList.remove('cursor--hand')
        }}
        scale={[0.53, 0.29, 0.29]}
        rotation={[0, 0, 0]}
      >
        <planeGeometry args={[1.9, 3.5]} />
        <meshBasicMaterial colorWrite={false} depthWrite={false} transparent opacity={0} />
      </mesh>
    </group>
  )
}
