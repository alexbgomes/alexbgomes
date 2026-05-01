import Bedroom from './Bedroom'
import Character from './Character'
import Door from './Door'
import Computer from './Computer'
import Note from './Note'
import CameraController from './CameraController'
import Lighting from './Lighting'

/*
 * Transform operations modified through Triplex
 */
export default function Scene() {
  return (
    <>
      <Lighting />
      <Bedroom scale={0.08} position={[0, -3, -5]} rotation={[0, 0, 0]} />
      <Character scale={1 / 64} position={[2.8978, -3, -4.2235]} rotation={[0, Math.PI, 0]} />
      <Door scale={2.35} position={[-5.331, -3.1838, 3.1113]} rotation={[0, Math.PI, 0]} />
      <Computer scale={[2.88, 1.68, 0.9]} position={[12, 2.33, 2.56]} rotation={[3.12413936106985, 1.3062149487094745e-16, 1.4008571555066098e-16]} />
      <Note scale={0.5} position={[-6.9908, -0.6217, -6.5356]} rotation={[0, 0, 0]} />
      <CameraController />
    </>
  )
}
