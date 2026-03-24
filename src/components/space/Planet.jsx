import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import useStore from '../../store/useStore'

export default function Planet({ data, orbitRadius = 3, speed = 1, size = 0.5, color = '#4fc3f7' }) {
  const groupRef = useRef()
  const meshRef = useRef()
  const [hovered, setHovered] = useState(false)
  const openModal = useStore((s) => s.openModal)

  useFrame((state) => {
    if (groupRef.current) {
      const t = state.clock.elapsedTime * speed * 0.3
      groupRef.current.position.x = Math.cos(t) * orbitRadius
      groupRef.current.position.z = Math.sin(t) * orbitRadius
      groupRef.current.position.y = Math.sin(t * 0.5) * 0.5
    }
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01
      meshRef.current.rotation.x += 0.005
    }
  })

  return (
    <>
      {/* Orbit ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[orbitRadius - 0.02, orbitRadius + 0.02, 64]} />
        <meshBasicMaterial color={color} transparent opacity={0.15} side={THREE.DoubleSide} />
      </mesh>

      <group ref={groupRef}>
        <mesh
          ref={meshRef}
          onPointerOver={() => {
            setHovered(true)
            document.body.style.cursor = 'pointer'
          }}
          onPointerOut={() => {
            setHovered(false)
            document.body.style.cursor = 'none'
          }}
          onClick={(e) => {
            e.stopPropagation()
            if (data) openModal(data)
          }}
        >
          <sphereGeometry args={[size, 32, 32]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={hovered ? 1 : 0.3}
            roughness={0.6}
            metalness={0.4}
          />
        </mesh>

        {/* Atmosphere glow */}
        <mesh>
          <sphereGeometry args={[size * 1.3, 16, 16]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={hovered ? 0.2 : 0.08}
            side={THREE.BackSide}
          />
        </mesh>

        {/* Label */}
        {hovered && data && (
          <Html position={[0, size + 0.5, 0]} center>
            <div className="glass px-3 py-1.5 text-xs text-white/90 whitespace-nowrap pointer-events-none">
              {data.title || data.name}
            </div>
          </Html>
        )}
      </group>
    </>
  )
}
