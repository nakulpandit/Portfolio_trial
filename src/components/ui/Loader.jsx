import { motion } from 'framer-motion'

export default function Loader() {
  return (
    <div className="fixed inset-0 bg-[var(--color-space-dark)] flex flex-col items-center justify-center z-[200]">
      {/* Animated rings */}
      <div className="relative w-24 h-24 mb-8">
        <motion.div
          className="absolute inset-0 border-2 border-[var(--color-nebula-purple)]/40 rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
        />
        <motion.div
          className="absolute inset-2 border-2 border-[var(--color-nebula-blue)]/30 rounded-full"
          animate={{ rotate: -360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        />
        <motion.div
          className="absolute inset-4 border-2 border-[var(--color-nebula-pink)]/20 rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-3 h-3 bg-[var(--color-nebula-purple)] rounded-full animate-pulse" />
        </div>
      </div>

      {/* Text */}
      <motion.p
        className="text-sm tracking-[0.3em] uppercase text-white/40"
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        Initializing Universe...
      </motion.p>
    </div>
  )
}
