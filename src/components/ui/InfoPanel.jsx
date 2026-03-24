import { motion, AnimatePresence } from 'framer-motion'
import useStore from '../../store/useStore'

export default function InfoPanel() {
  const showInfoPanel = useStore((s) => s.showInfoPanel)
  const selectedItem = useStore((s) => s.selectedItem)
  const clearSelection = useStore((s) => s.clearSelection)
  const openModal = useStore((s) => s.openModal)

  if (!selectedItem) return null

  return (
    <AnimatePresence>
      {showInfoPanel && (
        <motion.div
          className="fixed left-5 top-1/2 -translate-y-1/2 z-50 w-[320px] max-h-[70vh] pointer-events-auto"
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        >
          <div className="glass p-5 overflow-y-auto max-h-[70vh]">
            {/* Close button */}
            <button
              onClick={clearSelection}
              className="absolute top-3 right-3 w-7 h-7 flex items-center justify-center 
                         text-white/40 hover:text-white/80 hover:bg-white/10 rounded-full transition-all cursor-pointer"
            >
              ✕
            </button>

            {/* Title */}
            <h2 className="text-lg font-semibold text-white/90 mb-1 pr-8 glow-text">
              {selectedItem.isResearch ? 'Academic Review: ' : ''}
              {selectedItem.title}
            </h2>

            {/* Year / Category / Authors */}
            {(selectedItem.year || selectedItem.category || selectedItem.authors) && (
              <div className="mb-3">
                <div className="flex items-center gap-2 flex-wrap">
                  {selectedItem.year && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-white/50">
                      {selectedItem.year}
                    </span>
                  )}
                  {selectedItem.category && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--color-nebula-purple)]/20 text-[var(--color-nebula-purple)]">
                      {selectedItem.category}
                    </span>
                  )}
                  {selectedItem.domain && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--color-nebula-blue)]/20 text-[var(--color-nebula-blue)]">
                      {selectedItem.domain}
                    </span>
                  )}
                </div>
                {selectedItem.authors && (
                  <p className="text-xs text-white/40 mt-1.5 italic leading-relaxed">
                    {selectedItem.authors}
                  </p>
                )}
              </div>
            )}

            {/* Description */}
            <p className="text-sm text-white/60 leading-relaxed mb-4">
              {selectedItem.shortDescription || selectedItem.description || selectedItem.summary || selectedItem.simpleSummary}
            </p>

            {/* Tech Stack */}
            {selectedItem.techStack && (
              <div className="mb-4">
                <h3 className="text-xs uppercase tracking-[0.15em] text-white/40 mb-2">Tech Stack</h3>
                <div className="flex flex-wrap gap-1.5">
                  {selectedItem.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="text-xs px-2 py-0.5 rounded bg-white/5 text-white/60 border border-white/10"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Key Concepts */}
            {selectedItem.keyConcepts && (
              <div className="mb-4">
                <h3 className="text-xs uppercase tracking-[0.15em] text-white/40 mb-2">Key Concepts</h3>
                <div className="flex flex-wrap gap-1.5">
                  {selectedItem.keyConcepts.map((concept) => (
                    <span
                      key={concept}
                      className="text-xs px-2 py-0.5 rounded bg-[var(--color-nebula-pink)]/10 text-[var(--color-nebula-pink)]/80 border border-[var(--color-nebula-pink)]/20"
                    >
                      {concept}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Notes */}
            {selectedItem.notes && (
              <div className="mb-4">
                <h3 className="text-xs uppercase tracking-[0.15em] text-white/40 mb-2">Notes</h3>
                <p className="text-xs text-white/50 italic">{selectedItem.notes}</p>
              </div>
            )}

            {/* Resume download */}
            {selectedItem.isResume && (
              <div className="mb-4">
                <a
                  href="/resume/Nakul Resume.pdf"
                  download="Nakul_Pandit_Resume.pdf"
                  className="block w-full glass px-4 py-3 text-sm text-center text-white/90 hover:bg-white/10 
                                   transition-all border border-[var(--color-star-gold)]/50 cursor-pointer glow-text"
                >
                  📄 Download Resume (PDF)
                </a>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-2">
              {selectedItem.github && (
                <a
                  href={selectedItem.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 text-center text-xs py-2 rounded bg-white/5 text-white/70 
                             hover:bg-white/10 transition-all border border-white/10 cursor-pointer"
                >
                  ⭐ GitHub Repo
                </a>
              )}
              {selectedItem.link && (
                <a
                  href={selectedItem.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 text-center text-xs py-2 rounded bg-[var(--color-nebula-purple)]/20 
                             text-[var(--color-nebula-purple)] hover:bg-[var(--color-nebula-purple)]/30 transition-all cursor-pointer"
                >
                  View Live →
                </a>
              )}
              {selectedItem.fallbackLink && !selectedItem.github && !selectedItem.link && (
                <div className="flex-1 text-center text-xs py-2 rounded bg-white/5 text-white/40 border border-white/5">
                  {selectedItem.fallbackLink}
                </div>
              )}
              {(selectedItem.detailedDescription || selectedItem.deepSummary || selectedItem.keyConcepts) && (
                <button
                  onClick={() => openModal(selectedItem)}
                  className="flex-1 text-center text-xs py-2 rounded bg-white/5 text-white/60 
                             hover:bg-white/10 transition-all cursor-pointer"
                >
                  Full Details
                </button>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
