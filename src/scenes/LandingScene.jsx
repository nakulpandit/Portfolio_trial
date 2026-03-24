import { useState, useEffect, useCallback } from 'react'
import { Canvas } from '@react-three/fiber'
import { motion, AnimatePresence } from 'framer-motion'
import Starfield from '../components/space/Starfield'
import useStore from '../store/useStore'

export default function LandingScene() {
  const launch = useStore((s) => s.launch)
  const [phase, setPhase] = useState('dark') // dark → stars → title → ready → launching
  const [countdown, setCountdown] = useState(null)

  useEffect(() => {
    const timers = []
    timers.push(setTimeout(() => setPhase('stars'), 500))
    // We go straight to 'ready' because 'ready' handles the title animation sequentially
    timers.push(setTimeout(() => setPhase('ready'), 1500))
    return () => timers.forEach(clearTimeout)
  }, [])

  const handleLaunch = useCallback(() => {
    if (phase !== 'ready') return
    setPhase('launching')
    setCountdown(3)
    
    const timers = []
    timers.push(setTimeout(() => setCountdown(2), 600))
    timers.push(setTimeout(() => setCountdown(1), 1200))
    timers.push(setTimeout(() => {
      setCountdown(0)
      launch()
    }, 1800))
    
    return () => timers.forEach(clearTimeout)
  }, [phase, launch])

  return (
    <div className="fixed inset-0 bg-[var(--color-space-dark)]"
         style={{ cursor: phase === 'ready' ? 'pointer' : 'default' }}>
      {/* 3D Background */}
      <AnimatePresence>
        {phase !== 'dark' && (
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2 }}
          >
            <Canvas camera={{ position: [0, 0, 30], fov: 75 }}>
              <Starfield />
            </Canvas>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overlay content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
        <AnimatePresence mode="wait">
          {phase === 'ready' && (
            <motion.div
              key="intro-sequence"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 1.2 }}
              transition={{ duration: 0.8 }}
              className="text-center flex flex-col items-center justify-center"
            >
              <motion.h1 
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="text-6xl md:text-8xl font-bold glow-text text-white/90 tracking-tight"
              >
                EXPLORE
              </motion.h1>
              <motion.p 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
                className="text-lg text-white/40 mt-2 mb-12 tracking-[0.3em] uppercase"
              >
                My Universe
              </motion.p>
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 1.2 }}
                onClick={handleLaunch}
                className="glass px-12 py-4 text-sm md:text-lg tracking-[0.2em] uppercase text-white/90
                           hover:bg-white/10 transition-all duration-300 
                           border border-[var(--color-nebula-purple)]/50 rounded-full"
                whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(123, 47, 247, 0.5)' }}
                whileTap={{ scale: 0.95 }}
              >
                🚀 Launch Sequence
              </motion.button>
            </motion.div>
          )}

          {phase === 'launching' && countdown !== null && (
            <motion.div
              key="countdown"
              className="text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <motion.span
                key={countdown}
                className="text-9xl font-bold glow-text text-white block"
                initial={{ scale: 2, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
                transition={{ duration: 0.4 }}
              >
                {countdown === 0 ? '🚀' : countdown}
              </motion.span>
              <p className="text-white/40 mt-6 tracking-[0.3em] uppercase text-sm">
                {countdown === 0 ? 'Entering orbit...' : 'Initiating launch sequence'}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Scan lines effect */}
      <div className="absolute inset-0 pointer-events-none z-20 opacity-[0.03]"
           style={{
             background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)'
           }}
      />
    </div>
  )
}
