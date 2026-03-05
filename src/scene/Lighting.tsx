export default function Lighting() {
  return (
    <>
      <ambientLight intensity={40} color="#996633" />
      <pointLight
        position={[2, 5, 2]}
        intensity={12}
        color="#ffaa55"
        castShadow
      />
    </>
  )
}