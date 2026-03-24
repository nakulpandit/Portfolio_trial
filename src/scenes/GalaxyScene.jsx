import { useRef, useEffect, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, Text } from '@react-three/drei'
import * as THREE from 'three'
import Starfield from '../components/space/Starfield'
import Star from '../components/space/Star'
import Planet from '../components/space/Planet'
import WarpEffect from '../components/space/WarpEffect'
import CursorShip from '../components/space/CursorShip'
import HUD from '../components/ui/HUD'
import InfoPanel from '../components/ui/InfoPanel'
import Modal from '../components/ui/Modal'
import useStore from '../store/useStore'
import galaxies from '../data/galaxies'
import projects from '../data/projects'
import researchDomains from '../data/research'

function GalaxyCamera() {
  const { camera } = useThree()
  const target = useRef(new THREE.Vector3(0, 2, 15))

  useFrame(() => {
    camera.position.lerp(target.current, 0.03)
    camera.lookAt(0, 0, 0)
  })

  return null
}

// --- Projects Galaxy Interior ---
function ProjectsGalaxyContent() {
  return (
    <group>
      {/* Central glow */}
      <mesh>
        <sphereGeometry args={[0.5, 16, 16]} />
        <meshBasicMaterial color="#7b2ff7" transparent opacity={0.6} />
      </mesh>
      <mesh>
        <sphereGeometry args={[1, 16, 16]} />
        <meshBasicMaterial color="#7b2ff7" transparent opacity={0.15} />
      </mesh>

      {/* Project stars */}
      {projects.map((project) => (
        <Star key={project.id} data={project} galaxyColor="#7b2ff7" />
      ))}

      {/* Galaxy label */}
      <Text
        position={[0, 8, 0]}
        fontSize={1}
        color="#7b2ff7"
        anchorX="center"
        font="https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuLyfAZ9hiA.woff2"
      >
        PROJECTS GALAXY
      </Text>
    </group>
  )
}

// --- Research Galaxy Interior ---
function ResearchGalaxyContent() {
  const connectionLines = useMemo(() => {
    const lines = []
    researchDomains.forEach((domain) => {
      domain.papers.forEach((paper) => {
        const points = [
          new THREE.Vector3(...domain.position),
          new THREE.Vector3(
            domain.position[0] + paper.position[0],
            domain.position[1] + paper.position[1],
            domain.position[2] + paper.position[2]
          ),
        ]
        lines.push({ points, color: domain.color, key: `${domain.id}-${paper.id}` })
      })
    })
    // Cross-domain connections
    const allPapers = researchDomains.flatMap((d) =>
      d.papers.map((p) => ({
        ...p,
        worldPos: [
          d.position[0] + p.position[0],
          d.position[1] + p.position[1],
          d.position[2] + p.position[2],
        ],
      }))
    )
    for (let i = 0; i < allPapers.length; i++) {
      for (let j = i + 1; j < allPapers.length; j++) {
        const shared = allPapers[i].keyConcepts.some((c) =>
          allPapers[j].keyConcepts.some((c2) => c.toLowerCase().includes(c2.toLowerCase().split(' ')[0]))
        )
        if (shared) {
          lines.push({
            points: [
              new THREE.Vector3(...allPapers[i].worldPos),
              new THREE.Vector3(...allPapers[j].worldPos),
            ],
            color: '#ffffff',
            key: `cross-${i}-${j}`,
          })
        }
      }
    }
    return lines
  }, [])

  return (
    <group>
      {/* Domain constellations */}
      {researchDomains.map((domain) => (
        <group key={domain.id} position={domain.position}>
          {/* Domain node */}
          <mesh>
            <octahedronGeometry args={[0.5, 0]} />
            <meshStandardMaterial
              color={domain.color}
              emissive={domain.color}
              emissiveIntensity={0.6}
              wireframe
            />
          </mesh>
          <mesh>
            <sphereGeometry args={[0.8, 16, 16]} />
            <meshBasicMaterial color={domain.color} transparent opacity={0.1} />
          </mesh>

          {/* Domain label */}
          <Text
            position={[0, 1.5, 0]}
            fontSize={0.4}
            color={domain.color}
            anchorX="center"
            font="https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuLyfAZ9hiA.woff2"
          >
            {domain.name}
          </Text>

          {/* Papers as stars */}
          {domain.papers.map((paper) => (
            <Star
              key={paper.id}
              data={{ ...paper, position: paper.position }}
              galaxyColor={domain.color}
            />
          ))}
        </group>
      ))}

      {/* Connection lines */}
      {connectionLines.map((line) => (
        <line key={line.key}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={2}
              array={new Float32Array([
                line.points[0].x, line.points[0].y, line.points[0].z,
                line.points[1].x, line.points[1].y, line.points[1].z,
              ])}
              itemSize={3}
            />
          </bufferGeometry>
          <lineBasicMaterial color={line.color} transparent opacity={0.15} />
        </line>
      ))}

      {/* Galaxy label */}
      <Text
        position={[0, 10, 0]}
        fontSize={1}
        color="#e040fb"
        anchorX="center"
        font="https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuLyfAZ9hiA.woff2"
      >
        RESEARCH GALAXY
      </Text>
    </group>
  )
}

// --- About Galaxy Interior ---
function AboutGalaxyContent() {
  const aboutData = [
    { name: 'Background', title: 'Background', description: 'A passionate developer and researcher with deep interests in AI, space tech, and creative engineering. Currently pursuing advanced studies in computer science.', color: '#4fc3f7', orbit: 3, speed: 0.8, size: 0.5 },
    { name: 'Skills Overview', title: 'Skills Overview', description: 'Proficient in Python, JavaScript, C++, and Rust. Experienced with ML frameworks, cloud infrastructure, and full-stack web development.', color: '#00e676', orbit: 5, speed: 0.5, size: 0.6 },
    { name: 'Goals', title: 'Goals', description: 'To push the boundaries of AI research while building products that make a meaningful impact. Aspiring to work at the intersection of space and artificial intelligence.', color: '#ffd54f', orbit: 7, speed: 0.3, size: 0.45 },
  ]

  return (
    <group>
      {/* Central sun */}
      <mesh>
        <sphereGeometry args={[0.8, 32, 32]} />
        <meshStandardMaterial color="#ffab40" emissive="#ff9100" emissiveIntensity={1.5} />
      </mesh>
      <mesh>
        <sphereGeometry args={[1.2, 16, 16]} />
        <meshBasicMaterial color="#ffab40" transparent opacity={0.15} />
      </mesh>

      {/* Orbiting planets */}
      {aboutData.map((item, i) => (
        <Planet
          key={i}
          data={item}
          orbitRadius={item.orbit}
          speed={item.speed}
          size={item.size}
          color={item.color}
        />
      ))}

      <Text
        position={[0, 8, 0]}
        fontSize={1}
        color="#4fc3f7"
        anchorX="center"
        font="https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuLyfAZ9hiA.woff2"
      >
        ABOUT ME
      </Text>
    </group>
  )
}

// --- Skills Galaxy Interior ---
function SkillsGalaxyContent() {
  const skills = [
    { id: 's1', title: 'Python', proficiency: 95, experience: 5, color: '#ffd54f', position: [2, 1, 0] },
    { id: 's2', title: 'JavaScript', proficiency: 90, experience: 4, color: '#ffd54f', position: [-2, 0, 2] },
    { id: 's3', title: 'React', proficiency: 88, experience: 4, color: '#4fc3f7', position: [1, -2, -1] },
    { id: 's4', title: 'PyTorch', proficiency: 85, experience: 3, color: '#e040fb', position: [-1, 2, -2] },
    { id: 's5', title: 'Three.js', proficiency: 75, experience: 2, color: '#00e676', position: [3, -1, 1] },
    { id: 's6', title: 'Node.js', proficiency: 82, experience: 3, color: '#00e676', position: [-3, -1, 0] },
    { id: 's7', title: 'Docker', proficiency: 80, experience: 3, color: '#4fc3f7', position: [0, 3, 2] },
    { id: 's8', title: 'AWS', proficiency: 78, experience: 2, color: '#ffab40', position: [2, -3, -2] },
    { id: 's9', title: 'C++', proficiency: 70, experience: 3, color: '#ff5252', position: [-2, 1, 3] },
    { id: 's10', title: 'Rust', proficiency: 60, experience: 1, color: '#ff5252', position: [0, -1, -3] },
  ]

  return (
    <group>
      {skills.map((skill) => (
        <Star
          key={skill.id}
          data={{
            ...skill,
            description: `Proficiency: ${skill.proficiency}% | Experience: ${skill.experience} years`,
          }}
          galaxyColor="#00e676"
        />
      ))}

      <Text
        position={[0, 6, 0]}
        fontSize={1}
        color="#00e676"
        anchorX="center"
        font="https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuLyfAZ9hiA.woff2"
      >
        SKILLS NEBULA
      </Text>
    </group>
  )
}

// --- Education Wormhole ---
function EducationGalaxyContent() {
  const milestones = [
    { id: 'e1', title: 'High School Diploma', year: '2018', description: 'Graduated with honors. Focus on mathematics and physics.', color: '#ffab40', position: [0, -4, 0] },
    { id: 'e2', title: 'B.S. Computer Science', year: '2022', description: 'Graduated from university with specialization in AI and algorithms.', color: '#ffab40', position: [0, -1, 0] },
    { id: 'e3', title: 'Research Internship', year: '2023', description: 'Worked on federated learning at a national lab.', color: '#ffd54f', position: [0, 2, 0] },
    { id: 'e4', title: 'M.S. Computer Science', year: 'Present', description: 'Currently pursuing graduate studies focusing on AI + Space Technology.', color: '#ffd54f', position: [0, 5, 0] },
  ]

  return (
    <group>
      {/* Timeline line */}
      <line>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={2}
            array={new Float32Array([0, -6, 0, 0, 7, 0])}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#ffab40" transparent opacity={0.3} />
      </line>

      {milestones.map((m) => (
        <Star key={m.id} data={m} galaxyColor="#ffab40" />
      ))}

      <Text
        position={[0, 9, 0]}
        fontSize={1}
        color="#ffab40"
        anchorX="center"
        font="https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuLyfAZ9hiA.woff2"
      >
        EDUCATION TIMELINE
      </Text>
    </group>
  )
}

// --- Resume Station ---
function ResumeGalaxyContent() {
  const selectItem = useStore((s) => s.selectItem)
  return (
    <group>
      {/* Station structure */}
      <mesh
        onClick={() =>
          selectItem({
            id: 'resume',
            title: 'Resume',
            description: 'Download my latest resume to learn more about my experience, education, and skills.',
            isResume: true,
          })
        }
        onPointerOver={() => { document.body.style.cursor = 'pointer' }}
        onPointerOut={() => { document.body.style.cursor = 'none' }}
      >
        <torusGeometry args={[2, 0.3, 8, 32]} />
        <meshStandardMaterial color="#ffd54f" emissive="#ffc107" emissiveIntensity={0.5} metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2, 0.3, 8, 32]} />
        <meshStandardMaterial color="#ffd54f" emissive="#ffc107" emissiveIntensity={0.5} metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.6, 16, 16]} />
        <meshStandardMaterial color="#ffd54f" emissive="#ffc107" emissiveIntensity={0.8} />
      </mesh>

      <Text
        position={[0, 5, 0]}
        fontSize={1}
        color="#ffd54f"
        anchorX="center"
        font="https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuLyfAZ9hiA.woff2"
      >
        RESUME STATION
      </Text>
    </group>
  )
}

// --- Contact Galaxy ---
function ContactGalaxyContent() {
  const contacts = [
    { id: 'c1', title: 'Email', description: 'nakul@example.com', position: [3, 0, 0], color: '#ff5252' },
    { id: 'c2', title: 'GitHub', description: 'github.com/nakulpandit', position: [-2, 2, 1], color: '#ff5252' },
    { id: 'c3', title: 'LinkedIn', description: 'linkedin.com/in/nakulpandit', position: [0, -2, 3], color: '#4fc3f7' },
    { id: 'c4', title: 'Twitter / X', description: '@nakulpandit', position: [-3, -1, -1], color: '#4fc3f7' },
  ]

  return (
    <group>
      {/* Satellite dish */}
      <mesh>
        <coneGeometry args={[1.5, 0.5, 16, 1, true]} />
        <meshStandardMaterial color="#ff5252" emissive="#d32f2f" emissiveIntensity={0.4} wireframe />
      </mesh>

      {contacts.map((c) => (
        <Star key={c.id} data={c} galaxyColor="#ff5252" />
      ))}

      <Text
        position={[0, 5, 0]}
        fontSize={1}
        color="#ff5252"
        anchorX="center"
        font="https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuLyfAZ9hiA.woff2"
      >
        CONTACT SATELLITE
      </Text>
    </group>
  )
}

// --- Main GalaxyScene ---
const galaxyContent = {
  projects: ProjectsGalaxyContent,
  research: ResearchGalaxyContent,
  about: AboutGalaxyContent,
  skills: SkillsGalaxyContent,
  education: EducationGalaxyContent,
  resume: ResumeGalaxyContent,
  contact: ContactGalaxyContent,
}

function SceneContent() {
  const currentGalaxy = useStore((s) => s.currentGalaxy)
  const GalaxyContent = galaxyContent[currentGalaxy] || ProjectsGalaxyContent

  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[0, 5, 5]} intensity={1.2} color="#ffffff" />
      <pointLight position={[-5, -3, 3]} intensity={0.6} color="#7b2ff7" />
      <GalaxyCamera />
      <Starfield />
      <GalaxyContent />
      <WarpEffect />
      <CursorShip />
    </>
  )
}

export default function GalaxyScene() {
  const currentGalaxy = useStore((s) => s.currentGalaxy)
  const galaxyData = galaxies.find((g) => g.id === currentGalaxy)

  return (
    <div className="fixed inset-0">
      <Canvas
        camera={{ position: [0, 2, 15], fov: 60, near: 0.1, far: 300 }}
        gl={{ antialias: true, alpha: false }}
        onCreated={({ gl }) => {
          gl.setClearColor('#020010')
          gl.toneMapping = THREE.ACESFilmicToneMapping
        }}
      >
        <SceneContent />
        <OrbitControls
          enablePan
          enableZoom
          enableRotate
          maxDistance={40}
          minDistance={5}
          zoomSpeed={0.5}
          rotateSpeed={0.3}
          enableDamping
          dampingFactor={0.05}
        />
      </Canvas>
      <HUD />
      <InfoPanel />
      <Modal />
    </div>
  )
}
