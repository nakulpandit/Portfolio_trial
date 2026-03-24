import { Suspense } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import useStore from './store/useStore'
import LandingScene from './scenes/LandingScene'
import UniverseScene from './scenes/UniverseScene'
import GalaxyScene from './scenes/GalaxyScene'
import Loader from './components/ui/Loader'
import { Component } from 'react'

// Error boundary to catch Three.js rendering failures
class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('Scene Error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="fixed inset-0 bg-[var(--color-space-dark)] flex flex-col items-center justify-center z-[200]">
          <p className="text-white/60 text-lg mb-4">⚠️ Rendering error</p>
          <p className="text-white/40 text-sm mb-6 max-w-md text-center">{this.state.error?.message}</p>
          <button 
            onClick={() => {
              this.setState({ hasError: false, error: null })
              window.location.reload()
            }}
            className="glass px-6 py-2 text-white/80 hover:bg-white/10 transition-all cursor-pointer"
          >
            Reload
          </button>
        </div>
      )
    }
    return this.props.children
  }
}

export default function App() {
  const currentScene = useStore((s) => s.currentScene)

  return (
    <div className="w-full h-full bg-[var(--color-space-dark)]">
      <ErrorBoundary>
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
              <Suspense fallback={<Loader />}>
                <UniverseScene />
              </Suspense>
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
              <Suspense fallback={<Loader />}>
                <GalaxyScene />
              </Suspense>
            </motion.div>
          )}
        </AnimatePresence>
      </ErrorBoundary>
    </div>
  )
}
