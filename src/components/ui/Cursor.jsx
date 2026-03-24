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
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]">
        <circle cx="50" cy="50" r={isHovering ? "45" : "8"} fill={isHovering ? "rgba(255, 255, 255, 0.1)" : "rgba(255, 255, 255, 0.9)"} stroke="rgba(255, 255, 255, 0.9)" strokeWidth={isHovering ? "1" : "0"} transition="all 0.3s ease" />
        {isHovering && (
          <circle cx="50" cy="50" r="4" fill="rgba(255,255,255,0.9)" />
        )}
      </svg>
    </motion.div>
  )
}
