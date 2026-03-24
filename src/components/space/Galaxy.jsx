import { useRef, useMemo, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text, Html } from '@react-three/drei'
import * as THREE from 'three'
import useStore from '../../store/useStore'

export default function Galaxy({ data }) {
  const groupRef = useRef()
  const pointsRef = useRef()
  const [hovered, setHovered] = useState(false)
  const enterGalaxy = useStore((s) => s.enterGalaxy)

  const { id, name, label, description, position, color, emissive, size, particles } = data

  const colorObj = useMemo(() => new THREE.Color(color), [color])
  const coreColor = useMemo(() => new THREE.Color(emissive || color).multiplyScalar(1.5), [emissive, color])

  const { positions: particlePositions, angles, radii, randomnesses } = useMemo(() => {
    const count = particles || 500
    const pos = new Float32Array(count * 3)
    const ang = new Float32Array(count)
    const rad = new Float32Array(count)
    const rnd = new Float32Array(count)

    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      const r = Math.random() * size
      const a = Math.random() * Math.PI * 2
      const armOffset = (Math.floor(Math.random() * 3)) * ((Math.PI * 2) / 3)

      pos[i3] = Math.cos(a + armOffset) * r
      pos[i3 + 1] = (Math.random() - 0.5) * 0.6
      pos[i3 + 2] = Math.sin(a + armOffset) * r
      ang[i] = a + armOffset
      rad[i] = r
      rnd[i] = Math.random()
    }

    return { positions: pos, angles: ang, radii: rad, randomnesses: rnd }
  }, [particles, size])

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.material.uniforms.uTime.value = state.clock.elapsedTime
      // Increase glow intensity if hovered
      pointsRef.current.material.uniforms.uHover.value = hovered ? 1.0 : 0.0
    }
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.001
      const scale = hovered ? 1.15 : 1
      groupRef.current.scale.lerp(new THREE.Vector3(scale, scale, scale), 0.1)
    }
  })

  return (
    <group ref={groupRef} position={position}>
      {/* Galaxy particle cloud */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={particlePositions.length / 3} array={particlePositions} itemSize={3} />
          <bufferAttribute attach="attributes-angle" count={angles.length} array={angles} itemSize={1} />
          <bufferAttribute attach="attributes-radius" count={radii.length} array={radii} itemSize={1} />
          <bufferAttribute attach="attributes-randomness" count={randomnesses.length} array={randomnesses} itemSize={1} />
        </bufferGeometry>
        <shaderMaterial
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          uniforms={{
            uTime: { value: 0 },
            uHover: { value: 0 },
            uSize: { value: size },
            uColor: { value: colorObj },
            uCoreColor: { value: coreColor },
          }}
          vertexShader={`
            varying float vAlpha;
            attribute float angle;
            attribute float radius;
            attribute float randomness;
            uniform float uTime;
            uniform float uSize;
            void main() {
              float currentAngle = angle + uTime * 0.15 * (1.0 / max(radius, 0.5));
              vec3 pos = position;
              pos.x = cos(currentAngle) * radius + randomness * 0.5;
              pos.y = (randomness - 0.5) * 0.8;
              pos.z = sin(currentAngle) * radius + randomness * 0.3;
              vAlpha = smoothstep(0.0, 0.5, 1.0 - radius / uSize);
              vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
              gl_PointSize = max(1.5, (2.5 + randomness) * (200.0 / -mvPosition.z));
              gl_Position = projectionMatrix * mvPosition;
            }
          `}
          fragmentShader={`
            varying float vAlpha;
            uniform vec3 uColor;
            uniform vec3 uCoreColor;
            void main() {
              float dist = length(gl_PointCoord - vec2(0.5));
              if (dist > 0.5) discard;
              float alpha = smoothstep(0.5, 0.0, dist) * vAlpha;
              vec3 color = mix(uColor, uCoreColor, alpha * 0.5);
              gl_FragColor = vec4(color, alpha * 0.85);
            }
          `}
        />
      </points>

      {/* Core glow sphere */}
      <mesh>
        <sphereGeometry args={[0.4, 16, 16]} />
        <meshBasicMaterial color={color} transparent opacity={0.8} />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.7, 16, 16]} />
        <meshBasicMaterial color={color} transparent opacity={0.2} />
      </mesh>

      {/* Clickable area (Invisible) */}
      <mesh
        onPointerOver={(e) => {
          e.stopPropagation()
          setHovered(true)
          document.body.style.cursor = 'pointer'
        }}
        onPointerOut={(e) => {
          setHovered(false)
          document.body.style.cursor = 'auto'
        }}
        onClick={(e) => {
          e.stopPropagation()
          document.body.style.cursor = 'auto'
          enterGalaxy(id)
        }}
      >
        <sphereGeometry args={[size * 1.5, 16, 16]} />
        <meshBasicMaterial transparent opacity={0.0} depthWrite={false} color="#ffffff" />
      </mesh>

      {/* Label */}
      <Text
        position={[0, size * 0.8 + 1.2, 0]}
        fontSize={0.8}
        color={color}
        anchorX="center"
        anchorY="bottom"
        outlineWidth={0.02}
        outlineColor="#000000"
      >
        {label}
      </Text>

      {/* Hover tooltip */}
      {hovered && (
        <Html position={[0, -size * 0.6 - 0.5, 0]} center>
          <div className="glass px-4 py-2 text-sm text-white/80 min-w-[160px] text-center pointer-events-none">
            {description}
          </div>
        </Html>
      )}
    </group>
  )
}
