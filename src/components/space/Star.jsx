import { useRef, useState, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import useStore from '../../store/useStore'

export default function Star({ data, galaxyColor }) {
  const meshRef = useRef()
  const glowRef = useRef()
  const [hovered, setHovered] = useState(false)
  const selectItem = useStore((s) => s.selectItem)

  const color = data.color || galaxyColor || '#ffffff'
  const colorObj = useMemo(() => new THREE.Color(color), [color])

  // Scale star based on importance (if available)
  const baseScale = data.importance ? 0.8 + (data.importance / 5) * 0.4 : 1
  const starRadius = 0.35 * baseScale
  const glowRadius = 0.5 * baseScale

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.005
      const pulse = Math.sin(state.clock.elapsedTime * 2 + data.position[0]) * 0.05
      meshRef.current.scale.setScalar(hovered ? 1.4 + pulse : 1 + pulse * 0.5)
    }
    if (glowRef.current) {
      glowRef.current.material.opacity = hovered ? 0.4 : 0.15
      const s = hovered ? 2.8 : 1.8
      glowRef.current.scale.setScalar(s)
    }
  })

  return (
    <group position={data.position}>
      {/* Star core */}
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
          selectItem(data)
        }}
      >
        <icosahedronGeometry args={[starRadius, 2]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={hovered ? 2.5 : 0.8}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>

      {/* Glow sphere */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[glowRadius, 16, 16]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.15}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Hover label */}
      {hovered && (
        <Html position={[0, 1, 0]} center>
          <div className="glass px-3 py-1.5 text-xs text-white/90 whitespace-nowrap pointer-events-none">
            {data.title || data.name}
            {data.year && <span className="text-white/40 ml-1.5">({data.year})</span>}
          </div>
        </Html>
      )}
    </group>
  )
}
