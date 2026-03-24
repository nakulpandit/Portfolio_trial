import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

export default function CursorShip() {
  const meshRef = useRef()
  const { viewport } = useThree()
  const target = useRef(new THREE.Vector3(0, 0, 0))

  useFrame(({ pointer }) => {
    if (!meshRef.current) return

    target.current.x = (pointer.x * viewport.width) / 2
    target.current.y = (pointer.y * viewport.height) / 2
    target.current.z = 0

    meshRef.current.position.lerp(target.current, 0.15)

    // Tilt ship slightly based on movement direction
    const dx = target.current.x - meshRef.current.position.x
    const dy = target.current.y - meshRef.current.position.y
    meshRef.current.rotation.z = -dx * 0.5
    meshRef.current.rotation.x = dy * 0.3
  })

  return (
    <group ref={meshRef} renderOrder={1000}>
      {/* Ship body - triangle shape */}
      <mesh>
        <coneGeometry args={[0.12, 0.4, 3]} />
        <meshBasicMaterial color="#7b2ff7" transparent opacity={0.9} depthTest={false} />
      </mesh>
      {/* Engine glow */}
      <mesh position={[0, -0.25, 0]}>
        <sphereGeometry args={[0.06, 8, 8]} />
        <meshBasicMaterial color="#4fc3f7" transparent opacity={0.8} depthTest={false} />
      </mesh>
      {/* Trail */}
      <mesh position={[0, -0.35, 0]}>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshBasicMaterial color="#4fc3f7" transparent opacity={0.4} depthTest={false} />
      </mesh>
    </group>
  )
}
