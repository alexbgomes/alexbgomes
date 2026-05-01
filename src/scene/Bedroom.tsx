import { useEffect } from 'react'
import type { ComponentProps } from 'react'
import { Mesh, BackSide } from 'three'
import { useGLTF, useTexture } from '@react-three/drei'

/*
 * Full cubemap is overkill, using a plane for the window view
 */
export function WindowView(props: ComponentProps<'group'>) {
  const texture = useTexture('/textures/cubemaps/sorsele/posz.jpg')

  return (
    <group {...props}>
      <mesh>
        <planeGeometry args={[2048, 2048]} />
        <meshBasicMaterial map={texture} side={BackSide} toneMapped={false} />
      </mesh>
    </group>
  )
}

export function WindowGlass(props: ComponentProps<'group'>) {
  return (
    <group {...props}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[2, 3, 0.05]} />
        <meshStandardMaterial
          color="#b0dffd"
          transparent
          opacity={0.35}
          roughness={0.02}
          metalness={0.1}
        />
      </mesh>
    </group>
  )
}

export default function Bedroom(props: ComponentProps<'group'>) {
  const { scene } = useGLTF('models/room/scene.gltf')

  useEffect(() => {
    scene.traverse((child) => {
      if ((child as Mesh).isMesh) {
        child.castShadow = true
        child.receiveShadow = true
      }
    })
  }, [scene])

  return (
    <group {...props}>
      <primitive object={scene} />
      <WindowView position={[-1629.76, 50.88, 910.97]} rotation={[3.6724483539596774e-16, -1.5533430342749615, 3.6702106864113123e-16]} scale={[0.5, 0.5, 0.5]} />
      <WindowGlass position={[-104.12, 81.67, -44.17]} rotation={[-1.36338767171895, -1.553058670585541, -2.9342796265900413]} scale={[26.36, 28.24, 14.09]} />
    </group>
  )
}

useGLTF.preload('models/room/scene.gltf')
