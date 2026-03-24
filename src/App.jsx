import { Suspense } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import useStore from './store/useStore'
import LandingScene from './scenes/LandingScene'
import UniverseScene from './scenes/UniverseScene'
import GalaxyScene from './scenes/GalaxyScene'
import Loader from './components/ui/Loader'

export default function App() {
  const currentScene = useStore((s) => s.currentScene)

  return (
    <div className="w-full h-full bg-[var(--color-space-dark)]">
      <Suspense fallback={<Loader />}>
        <AnimatePresence mode="wait">
          {currentScene === 'landing' && (
            <motion.div
              key="landing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="w-full h-full"
            >
              <LandingScene />
            </motion.div>
          )}

          {currentScene === 'universe' && (
            <motion.div
              key="universe"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              className="w-full h-full"
            >
              <UniverseScene />
            </motion.div>
          )}

          {currentScene === 'galaxy' && (
            <motion.div
              key="galaxy"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              className="w-full h-full"
            >
              <GalaxyScene />
            </motion.div>
          )}
        </AnimatePresence>
      </Suspense>
    </div>
  )
}
