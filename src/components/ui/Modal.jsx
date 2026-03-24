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

            {/* Subtitle row */}
            {(modalContent.year || modalContent.category || modalContent.domain) && (
              <div className="flex items-center gap-2 mb-2 flex-wrap">
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
                {modalContent.domain && (
                  <span className="text-sm px-3 py-0.5 rounded-full bg-[var(--color-nebula-blue)]/20 text-[var(--color-nebula-blue)]">
                    {modalContent.domain}
                  </span>
                )}
              </div>
            )}

            {/* Authors */}
            {modalContent.authors && (
              <p className="text-sm text-white/40 italic mb-3">
                {modalContent.authors}
              </p>
            )}

            {/* Divider */}
            <div className="h-px bg-white/10 mb-4" />

            {/* Detailed Description (for projects) */}
            {modalContent.detailedDescription && (
              <div className="mb-5">
                <h3 className="text-xs uppercase tracking-[0.15em] text-white/40 mb-2">Detailed Description</h3>
                <p className="text-sm text-white/70 leading-relaxed">{modalContent.detailedDescription}</p>
              </div>
            )}

            {/* Simple Summary / ELI5 (for research) */}
            {modalContent.simpleSummary && (
              <div className="mb-5">
                <h3 className="text-xs uppercase tracking-[0.15em] text-white/40 mb-2">
                  🧠 Simple Explanation
                </h3>
                <div className="text-sm text-white/70 bg-[var(--color-nebula-purple)]/10 rounded-lg p-4 leading-relaxed border border-[var(--color-nebula-purple)]/20">
                  {modalContent.simpleSummary}
                </div>
              </div>
            )}

            {/* Deep Summary (for research) */}
            {modalContent.deepSummary && (
              <div className="mb-5">
                <h3 className="text-xs uppercase tracking-[0.15em] text-white/40 mb-2">
                  🔬 Technical Deep Dive
                </h3>
                <p className="text-sm text-white/60 leading-relaxed">{modalContent.deepSummary}</p>
              </div>
            )}

            {/* Fallback description */}
            {!modalContent.detailedDescription && !modalContent.simpleSummary && (modalContent.description || modalContent.summary) && (
              <div className="mb-5">
                <h3 className="text-xs uppercase tracking-[0.15em] text-white/40 mb-2">
                  {modalContent.summary ? 'Summary' : 'Description'}
                </h3>
                <p className="text-sm text-white/70 leading-relaxed">
                  {modalContent.description || modalContent.summary}
                </p>
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

            {/* Action buttons */}
            <div className="flex gap-3 mt-4">
              {modalContent.github && (
                <a
                  href={modalContent.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block text-sm px-5 py-2 rounded-full bg-white/5
                             text-white/70 hover:bg-white/10 transition-all
                             border border-white/15"
                >
                  ⭐ View on GitHub
                </a>
              )}
              {modalContent.link && (
                <a
                  href={modalContent.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block text-sm px-5 py-2 rounded-full bg-[var(--color-nebula-purple)]/20
                             text-[var(--color-nebula-purple)] hover:bg-[var(--color-nebula-purple)]/30 transition-all
                             border border-[var(--color-nebula-purple)]/30"
                >
                  View Resource →
                </a>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
