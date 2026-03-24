import { useRef, useEffect, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

export default function CursorShip() {
  const meshRef = useRef()
  const { viewport } = useThree()
  const mouse = useRef(new THREE.Vector2(0, 0))
  const target = useRef(new THREE.Vector3(0, 0, 0))
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1
      if (!visible) setVisible(true)
    }

    const handleMouseLeave = () => setVisible(false)
    const handleMouseEnter = () => setVisible(true)

    window.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseleave', handleMouseLeave)
    document.addEventListener('mouseenter', handleMouseEnter)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseleave', handleMouseLeave)
      document.removeEventListener('mouseenter', handleMouseEnter)
    }
  }, [visible])

  useFrame(() => {
    if (!meshRef.current) return

    target.current.x = (mouse.current.x * viewport.width) / 2
    target.current.y = (mouse.current.y * viewport.height) / 2
    target.current.z = 0

    meshRef.current.position.lerp(target.current, 0.15)

    // Tilt ship slightly based on movement direction
    const dx = target.current.x - meshRef.current.position.x
    const dy = target.current.y - meshRef.current.position.y
    meshRef.current.rotation.z = -dx * 0.5
    meshRef.current.rotation.x = dy * 0.3
  })

  if (!visible) return null

  return (
    <group ref={meshRef} renderOrder={1000}>
      {/* Ship body - triangle shape */}
      <mesh>
        <coneGeometry args={[0.12, 0.4, 3]} />
        <meshBasicMaterial color="#7b2ff7" transparent opacity={0.9} />
      </mesh>
      {/* Engine glow */}
      <mesh position={[0, -0.25, 0]}>
        <sphereGeometry args={[0.06, 8, 8]} />
        <meshBasicMaterial color="#4fc3f7" transparent opacity={0.8} />
      </mesh>
      {/* Trail */}
      <mesh position={[0, -0.35, 0]}>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshBasicMaterial color="#4fc3f7" transparent opacity={0.4} />
      </mesh>
    </group>
  )
}
