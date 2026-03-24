import { motion, AnimatePresence } from 'framer-motion'
import useStore from '../../store/useStore'

export default function Modal() {
  const showModal = useStore((s) => s.showModal)
  const modalContent = useStore((s) => s.modalContent)
  const closeModal = useStore((s) => s.closeModal)

  if (!modalContent) return null

  return (
    <AnimatePresence>
      {showModal && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={closeModal}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Modal content */}
          <motion.div
            className="relative glass w-[90%] max-w-[600px] max-h-[80vh] overflow-y-auto p-8 z-10"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          >
            {/* Close */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center
                         text-white/40 hover:text-white/80 hover:bg-white/10 rounded-full transition-all cursor-pointer"
            >
              ✕
            </button>

            {/* Title */}
            <h2 className="text-2xl font-bold text-white/90 mb-2 pr-10 glow-text">
              {modalContent.title || modalContent.name}
            </h2>

            {/* Subtitle */}
            {(modalContent.year || modalContent.category) && (
              <div className="flex items-center gap-2 mb-4">
                {modalContent.year && (
                  <span className="text-sm px-3 py-0.5 rounded-full bg-white/10 text-white/50">
                    {modalContent.year}
                  </span>
                )}
                {modalContent.category && (
                  <span className="text-sm px-3 py-0.5 rounded-full bg-[var(--color-nebula-purple)]/20 text-[var(--color-nebula-purple)]">
                    {modalContent.category}
                  </span>
                )}
              </div>
            )}

            {/* Divider */}
            <div className="h-px bg-white/10 mb-4" />

            {/* Description / Summary */}
            <div className="mb-5">
              <h3 className="text-xs uppercase tracking-[0.15em] text-white/40 mb-2">
                {modalContent.summary ? 'Summary' : 'Description'}
              </h3>
              <p className="text-sm text-white/70 leading-relaxed">
                {modalContent.description || modalContent.summary}
              </p>
            </div>

            {/* Detailed info */}
            {modalContent.summary && modalContent.description && (
              <div className="mb-5">
                <h3 className="text-xs uppercase tracking-[0.15em] text-white/40 mb-2">Details</h3>
                <p className="text-sm text-white/60 leading-relaxed">{modalContent.summary}</p>
              </div>
            )}

            {/* Tech Stack */}
            {modalContent.techStack && (
              <div className="mb-5">
                <h3 className="text-xs uppercase tracking-[0.15em] text-white/40 mb-2">Technology Stack</h3>
                <div className="flex flex-wrap gap-2">
                  {modalContent.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="text-sm px-3 py-1 rounded-lg bg-white/5 text-white/70 border border-white/10"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Key Concepts */}
            {modalContent.keyConcepts && (
              <div className="mb-5">
                <h3 className="text-xs uppercase tracking-[0.15em] text-white/40 mb-2">Key Concepts</h3>
                <div className="flex flex-wrap gap-2">
                  {modalContent.keyConcepts.map((concept) => (
                    <span
                      key={concept}
                      className="text-sm px-3 py-1 rounded-lg bg-[var(--color-nebula-pink)]/10 text-[var(--color-nebula-pink)] border border-[var(--color-nebula-pink)]/20"
                    >
                      {concept}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Notes */}
            {modalContent.notes && (
              <div className="mb-5">
                <h3 className="text-xs uppercase tracking-[0.15em] text-white/40 mb-2">Notes</h3>
                <div className="text-sm text-white/60 bg-white/5 rounded-lg p-4 italic border border-white/5">
                  {modalContent.notes}
                </div>
              </div>
            )}

            {/* Link */}
            {modalContent.link && (
              <a
                href={modalContent.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-2 text-sm px-5 py-2 rounded-full bg-[var(--color-nebula-purple)]/20
                           text-[var(--color-nebula-purple)] hover:bg-[var(--color-nebula-purple)]/30 transition-all
                           border border-[var(--color-nebula-purple)]/30"
              >
                View Resource →
              </a>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
