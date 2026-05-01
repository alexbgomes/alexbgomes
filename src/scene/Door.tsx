import { useRef } from 'react'
import type { ComponentProps } from 'react'
import type { Group, PointLight } from 'three'
import { useFrame } from '@react-three/fiber'
import { Text } from '@react-three/drei'

import { useGameState } from '../state/useGameState'

export default function Door(props: ComponentProps<'group'>) {
  const setView = useGameState((s) => s.setView)
  const textGroup = useRef<Group>(null!)
  const glowLight = useRef<PointLight>(null!)

  useFrame((state) => {
    const t = state.clock.getElapsedTime()

    // Pulse the text scale
    if (textGroup.current) {
      const s = 1 + Math.sin(t * 2) * 0.08
      textGroup.current.scale.set(s, s, s)
    }

    // Pulse the glow light
    if (glowLight.current) {
      glowLight.current.intensity = 5 + Math.sin(t * 2.5) * 4
    }
  })

  const handleClick = () => {
    setView('contact')
  }

  return (
    <group {...props}>
      {/* --- Light beyond the door --- */}
      <mesh position={[-0.195681835151602, 1.95945182796923, 0.0458098273625951]} scale={[1, 1.06, 1]} rotation={[-0.0174532925199433, 0, 0]}>
        <planeGeometry args={[1.9, 3.5]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive="#ffffff"
          emissiveIntensity={1}
        />
      </mesh>

      {/* --- Point light for actual illumination --- */}
      <pointLight
        ref={glowLight}
        position={[-0.329, 2.09, 0.0787]}
        color="#ffffff"
        intensity={80}
        distance={12}
        castShadow
        shadow-bias={-0.005}
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />

      {/* --- "Start New Quest" text --- */}
      <group ref={textGroup} position={[-0.6, 3.27, 0.93]} rotation={[-0.14941755383330327, -0.36659530159573045, -0.05337256069759883]}>
        <Text
          fontSize={0.18}
          color="#ffcc44"
          anchorX="center"
          anchorY="middle"
          outlineColor="#ff8800"
          outlineWidth={0.012}
          letterSpacing={0.08}
        >
          Start New Quest
        </Text>
      </group>

      {/* --- Clickable hit area --- */}
      <mesh
        position={[-0.196961029507787, 1.99638281505185, -0.051692533435022]}
        onClick={handleClick}
        onPointerOver={() => {
          document.body.classList.add('cursor--pointer')
        }}
        onPointerOut={() => {
          document.body.classList.remove('cursor--pointer')
        }} scale={[1.11, 1.05, 0.6]} rotation={[-0.09850206975701574, 0.07366053965928963, -0.04653317067740626]}
      >
        <planeGeometry args={[1.9, 3.5]} />
        <meshBasicMaterial colorWrite={false} depthWrite={false} transparent opacity={0} />
      </mesh>
    </group>
  )
}
