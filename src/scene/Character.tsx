import type { ComponentProps } from 'react'
import { useEffect } from 'react'
import type { Mesh } from 'three'
import { useGLTF } from '@react-three/drei'

export default function Character(props: ComponentProps<'group'>) {
  const { scene } = useGLTF('models/character/scene.gltf')

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
    </group>
  )
}

useGLTF.preload('models/character/scene.gltf')
