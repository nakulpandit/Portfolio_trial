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
    timers.push(setTimeout(() => setPhase('title'), 1500))
    timers.push(setTimeout(() => setPhase('ready'), 2500))
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
          {phase === 'title' && (
            <motion.div
              key="title"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <h1 className="text-6xl md:text-8xl font-bold glow-text text-white/90 tracking-tight">
                EXPLORE
              </h1>
              <p className="text-lg text-white/40 mt-4 tracking-[0.3em] uppercase">
                My Universe
              </p>
            </motion.div>
          )}

          {phase === 'ready' && (
            <motion.div
              key="ready"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.5 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <h1 className="text-5xl md:text-7xl font-bold glow-text text-white/90 mb-8 tracking-tight">
                EXPLORE MY UNIVERSE
              </h1>
              <motion.button
                onClick={handleLaunch}
                className="glass px-10 py-4 text-lg tracking-[0.2em] uppercase text-white/90
                           hover:bg-white/10 transition-all duration-300 
                           border border-[var(--color-nebula-purple)]/50 rounded-full"
                whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(123, 47, 247, 0.5)' }}
                whileTap={{ scale: 0.95 }}
                animate={{ boxShadow: ['0 0 10px rgba(123,47,247,0.3)', '0 0 30px rgba(123,47,247,0.6)', '0 0 10px rgba(123,47,247,0.3)'] }}
                transition={{ boxShadow: { duration: 2, repeat: Infinity } }}
              >
                🚀 Launch
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
                {countdown === 0 ? 'Launching...' : 'Initiating launch sequence'}
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
