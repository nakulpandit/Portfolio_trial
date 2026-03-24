import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const STAR_COUNT = 3000

export default function Starfield() {
  const pointsRef = useRef()

  const { positions, brightnesses, speeds } = useMemo(() => {
    const positions = new Float32Array(STAR_COUNT * 3)
    const brightnesses = new Float32Array(STAR_COUNT)
    const speeds = new Float32Array(STAR_COUNT)

    for (let i = 0; i < STAR_COUNT; i++) {
      const i3 = i * 3
      positions[i3] = (Math.random() - 0.5) * 400
      positions[i3 + 1] = (Math.random() - 0.5) * 400
      positions[i3 + 2] = (Math.random() - 0.5) * 400
      brightnesses[i] = Math.random() * 0.8 + 0.2
      speeds[i] = Math.random() * 3 + 0.5
    }

    return { positions, brightnesses, speeds }
  }, [])

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.material.uniforms.uTime.value = state.clock.elapsedTime
    }
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={STAR_COUNT}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-brightness"
          count={STAR_COUNT}
          array={brightnesses}
          itemSize={1}
        />
        <bufferAttribute
          attach="attributes-twinkleSpeed"
          count={STAR_COUNT}
          array={speeds}
          itemSize={1}
        />
      </bufferGeometry>
      <shaderMaterial
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        uniforms={{
          uTime: { value: 0 },
        }}
        vertexShader={`
          varying float vBrightness;
          attribute float brightness;
          attribute float twinkleSpeed;
          uniform float uTime;
          void main() {
            vBrightness = brightness * (0.5 + 0.5 * sin(uTime * twinkleSpeed));
            vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
            gl_PointSize = max(1.0, brightness * 3.0 * (300.0 / -mvPosition.z));
            gl_Position = projectionMatrix * mvPosition;
          }
        `}
        fragmentShader={`
          varying float vBrightness;
          void main() {
            float dist = length(gl_PointCoord - vec2(0.5));
            if (dist > 0.5) discard;
            float alpha = smoothstep(0.5, 0.0, dist);
            vec3 color = mix(vec3(0.6, 0.7, 1.0), vec3(1.0, 0.95, 0.8), vBrightness);
            gl_FragColor = vec4(color, alpha * vBrightness);
          }
        `}
      />
    </points>
  )
}
