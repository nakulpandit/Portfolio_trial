import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import useStore from '../../store/useStore'

export default function Cursor() {
  const [mousePos, setMousePos] = useState({ x: window.innerWidth / 2, y: window.innerHeight / 2 })
  const [isHovering, setIsHovering] = useState(false)
  const currentScene = useStore((s) => s.currentScene)

  useEffect(() => {
    const updateMouseInfo = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY })
      
      const target = e.target
      const isPointer = window.getComputedStyle(target).cursor === 'pointer' || 
                        target.tagName.toLowerCase() === 'button' || 
                        target.tagName.toLowerCase() === 'a' ||
                        document.body.style.cursor === 'pointer'
      setIsHovering(isPointer)
    }
    
    window.addEventListener('mousemove', updateMouseInfo)
    return () => window.removeEventListener('mousemove', updateMouseInfo)
  }, [])

  // Hide custom cursor completely on touch devices or standard pointer requests
  if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) {
    return null
  }

  // Only show fancy cursor in 3D scenes if preferred, but for now we show everywhere
  const isVisible = currentScene !== 'dark'

  if (!isVisible) return null

  return (
    <motion.div
      className="fixed top-0 left-0 w-8 h-8 pointer-events-none z-[1000] mix-blend-screen"
      animate={{
        x: mousePos.x - 16,
        y: mousePos.y - 16,
        scale: isHovering ? 1.5 : 1,
        rotate: isHovering ? 45 : 0
      }}
      transition={{ type: 'spring', stiffness: 500, damping: 28, mass: 0.5 }}
    >
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="48" stroke={isHovering ? "#e040fb" : "#4fc3f7"} strokeWidth="2" opacity={isHovering ? "0.8" : "0.3"} />
        <circle cx="50" cy="50" r="4" fill={isHovering ? "#e040fb" : "#4fc3f7"} />
        {isHovering && (
          <>
            <line x1="50" y1="0" x2="50" y2="20" stroke="#e040fb" strokeWidth="2" />
            <line x1="50" y1="100" x2="50" y2="80" stroke="#e040fb" strokeWidth="2" />
            <line x1="0" y1="50" x2="20" y2="50" stroke="#e040fb" strokeWidth="2" />
            <line x1="100" y1="50" x2="80" y2="50" stroke="#e040fb" strokeWidth="2" />
          </>
        )}
      </svg>
    </motion.div>
  )
}
