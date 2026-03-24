import { useRef, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import Starfield from '../components/space/Starfield'
import Universe from '../components/space/Universe'
import WarpEffect from '../components/space/WarpEffect'
import HUD from '../components/ui/HUD'
import useStore from '../store/useStore'

function CameraController() {
  const { camera } = useThree()
  const currentGalaxy = useStore((s) => s.currentGalaxy)
  const currentScene = useStore((s) => s.currentScene)
  const targetPos = useRef(new THREE.Vector3(0, 5, 50))
  const initialized = useRef(false)

  useEffect(() => {
    if (currentScene === 'universe' && !currentGalaxy) {
      targetPos.current.set(0, 0, 70) // Move back slightly to see all the new depths
      initialized.current = false
    }
  }, [currentScene, currentGalaxy])

  useFrame(() => {
    // Only lerp on initial entry, then let OrbitControls take over completely
    if (!initialized.current) {
      camera.position.lerp(targetPos.current, 0.03)
      if (camera.position.distanceTo(targetPos.current) < 0.5) {
        initialized.current = true
      }
    }
  })

  return null
}

function SceneContent() {
  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[0, 0, 0]} intensity={1} color="#7b2ff7" />
      <CameraController />
      <Starfield />
      <Universe />
      <WarpEffect />
    </>
  )
}

export default function UniverseScene() {
  return (
    <div className="fixed inset-0">
      <Canvas
        camera={{ position: [0, 5, 50], fov: 60, near: 0.1, far: 500 }}
        gl={{ antialias: true, alpha: false }}
        onCreated={({ gl }) => {
          gl.setClearColor('#020010')
          gl.toneMapping = THREE.ACESFilmicToneMapping
          gl.toneMappingExposure = 1.2
        }}
      >
        <SceneContent />
        <OrbitControls
          makeDefault
          enablePan={false}
          enableZoom
          enableRotate
          maxDistance={120}
          minDistance={10}
          zoomSpeed={0.5}
          panSpeed={0.8}
          rotateSpeed={0.4}
          enableDamping
          dampingFactor={0.05}
        />
      </Canvas>
      <HUD />
    </div>
  )
}
