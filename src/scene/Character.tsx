import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import { Group } from 'three'

export default function Character() {
  const group = useRef<Group>(null!)

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    group.current.rotation.y += 0.003
    group.current.position.y = 1 + Math.sin(t * 2) * 0.05
  })

  return (
    <group ref={group} position={[0, 1, 0]}>
      <mesh castShadow>
        <cylinderGeometry args={[0.5, 0.7, 2, 6]} />
        <meshStandardMaterial color={"#ff00ff"} wireframe={false} vertexColors={false} transparent={false} toneMapped={false} visible={true} />
      </mesh>
      <mesh position={[0, 1.5, 0]} castShadow receiveShadow={true}>
        <sphereGeometry args={[0.5, 16, 16]} />
        <meshStandardMaterial color={"#ff00ff"} wireframe={true} />
      </mesh>
    </group>
  )
}
