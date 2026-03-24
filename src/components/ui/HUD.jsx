import { motion, AnimatePresence } from 'framer-motion'
import useStore from '../../store/useStore'
import galaxies from '../../data/galaxies'

export default function HUD() {
  const currentScene = useStore((s) => s.currentScene)
  const currentGalaxy = useStore((s) => s.currentGalaxy)
  const exitGalaxy = useStore((s) => s.exitGalaxy)
  const enterGalaxy = useStore((s) => s.enterGalaxy)

  const galaxyData = galaxies.find((g) => g.id === currentGalaxy)

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {/* Top bar */}
      <div className="absolute top-4 left-4 right-4 flex items-start justify-between">
        {/* Location indicator */}
        <motion.div
          className="glass px-4 py-2 pointer-events-auto"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-[var(--color-nebula-purple)] rounded-full animate-pulse" />
            <span className="text-xs tracking-[0.15em] uppercase text-white/60">
              {currentScene === 'universe' ? 'UNIVERSE VIEW' : galaxyData?.label || 'GALAXY'}
            </span>
          </div>
        </motion.div>

        {/* Back button when in galaxy */}
        <AnimatePresence>
          {currentScene === 'galaxy' && (
            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              onClick={exitGalaxy}
              className="glass px-5 py-2 pointer-events-auto text-sm tracking-[0.1em] uppercase text-white/80
                         hover:bg-white/10 hover:text-white transition-all cursor-pointer"
            >
              ← Return to Universe
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Minimap / Radar */}
      <motion.div
        className="absolute bottom-5 right-5 glass w-[160px] h-[160px] pointer-events-auto overflow-hidden"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5 }}
      >
        <div className="p-2 h-full relative">
          <div className="text-[9px] uppercase tracking-[0.15em] text-white/40 mb-1">Radar</div>
          <div className="relative w-full h-[calc(100%-18px)]">
            {/* Grid */}
            <div className="absolute inset-0 border border-white/5 rounded">
              <div className="absolute top-1/2 left-0 right-0 h-px bg-white/5" />
              <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white/5" />
            </div>
            
            {/* Galaxy dots on minimap */}
            {galaxies.map((g) => {
              const x = ((g.position[0] + 40) / 80) * 100
              const y = ((g.position[1] + 30) / 60) * 100
              const isActive = g.id === currentGalaxy
              return (
                <div
                  key={g.id}
                  className="absolute w-2 h-2 rounded-full transition-all duration-300 cursor-pointer hover:scale-150"
                  style={{
                    left: `${x}%`,
                    top: `${100 - y}%`,
                    backgroundColor: g.color,
                    opacity: isActive ? 1 : 0.5,
                    transform: `translate(-50%, -50%) ${isActive ? 'scale(1.5)' : 'scale(1)'}`,
                    boxShadow: isActive ? `0 0 8px ${g.color}` : 'none',
                  }}
                  title={g.name}
                  onClick={() => {
                    if (currentScene === 'universe') enterGalaxy(g.id)
                    else if (g.id !== currentGalaxy) {
                      exitGalaxy()
                      setTimeout(() => enterGalaxy(g.id), 100)
                    }
                  }}
                />
              )
            })}

            {/* Center marker (you are here) */}
            {currentScene === 'universe' && (
              <div className="absolute top-1/2 left-1/2 w-1.5 h-1.5 bg-white rounded-full -translate-x-1/2 -translate-y-1/2 animate-pulse" />
            )}
          </div>
        </div>
      </motion.div>

      {/* Bottom info bar */}
      <div className="absolute bottom-5 left-5">
        <motion.div 
          className="glass px-4 py-2 pointer-events-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <div className="text-[9px] uppercase tracking-[0.15em] text-white/40">
            {currentScene === 'universe' ? 'Click a galaxy to explore' : 'Click objects to inspect • Drag to rotate'}
          </div>
        </motion.div>
      </div>

      {/* Corner decorations */}
      <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-white/10 m-2" />
      <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-white/10 m-2" />
      <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-white/10 m-2" />
      <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-white/10 m-2" />
    </div>
  )
}
