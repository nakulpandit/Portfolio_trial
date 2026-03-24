import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import Galaxy from './Galaxy'
import galaxies from '../../data/galaxies'

export default function Universe() {
  const groupRef = useRef()

  // Cinematic parallax effect
  useFrame((state) => {
    if (!groupRef.current) return
    const targetX = (state.pointer.x * Math.PI) * 0.05
    const targetY = (state.pointer.y * Math.PI) * 0.05
    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetX, 0.05)
    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, -targetY, 0.05)
  })

  return (
    <group ref={groupRef}>
      {galaxies.map((galaxy) => (
        <Galaxy key={galaxy.id} data={galaxy} />
      ))}
    </group>
  )
}
