import { useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import useStore from '../../store/useStore'

const STREAK_COUNT = 200

export default function WarpEffect() {
  const pointsRef = useRef()
  const isWarping = useStore((s) => s.isWarping)
  const setWarping = useStore((s) => s.setWarping)
  const intensityRef = useRef(0)

  useEffect(() => {
    if (isWarping) {
      intensityRef.current = 1
      const timeout = setTimeout(() => {
        setWarping(false)
      }, 1200)
      return () => clearTimeout(timeout)
    }
  }, [isWarping, setWarping])

  useFrame((state, delta) => {
    if (!pointsRef.current) return

    // Fade out intensity
    if (!isWarping && intensityRef.current > 0) {
      intensityRef.current = Math.max(0, intensityRef.current - delta * 2)
    }

    const positions = pointsRef.current.geometry.attributes.position.array
    const intensity = intensityRef.current

    for (let i = 0; i < STREAK_COUNT; i++) {
      const i3 = i * 3
      // Move streaks forward
      positions[i3 + 2] += intensity * 8 * delta * 60
      
      // Reset if too far
      if (positions[i3 + 2] > 10) {
        positions[i3] = (Math.random() - 0.5) * 30
        positions[i3 + 1] = (Math.random() - 0.5) * 30
        positions[i3 + 2] = -50
      }
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true
    pointsRef.current.material.opacity = intensity * 0.8
  })

  const positions = new Float32Array(STREAK_COUNT * 3)
  for (let i = 0; i < STREAK_COUNT; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 30
    positions[i * 3 + 1] = (Math.random() - 0.5) * 30
    positions[i * 3 + 2] = (Math.random() - 1) * 50
  }

  return (
    <points ref={pointsRef} renderOrder={999}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={STREAK_COUNT}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#8080ff"
        size={0.15}
        sizeAttenuation
        transparent
        opacity={0}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  )
}
