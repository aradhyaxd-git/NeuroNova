import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiXMark, HiSparkles, HiRectangleStack, HiCheckBadge, HiArrowPath } from 'react-icons/hi2';
import FlashcardList from '../FlashcardList';
import Quiz from '../Quiz';
import { createStudySet } from '../../api/studyApi';

export default function ModuleStudyStudio({ module, onClose }) {
  const [activeTab, setActiveTab] = useState('flashcards');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [studyData, setStudyData] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const fetchStudySet = async () => {
      setLoading(true);
      setError('');

      try {
        const notes = `Module Title: ${module.title}. Type: ${module.type}. Details: ${module.explainability?.detailedWhy || module.explainability?.topReason || 'Fundamental learning module'}. Focus topics: ${(module.explainability?.skillGains || []).join(', ')}.`;
        const data = await createStudySet(notes);
        if (isMounted) {
          if (data.error) setError(data.error);
          else setStudyData(data);
        }
      } catch (err) {
        if (isMounted) setError("Failed to generate study materials for this module.");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    if (module) fetchStudySet();
    return () => { isMounted = false; };
  }, [module]);

  if (!module) return null;

  return (
    <AnimatePresence>
      <div className="modal-backdrop" onClick={onClose}>
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 15 }}
          className="modal-card studio-modal card-surface glow-border"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="modal-header">
            <div>
              <span className="pill compact"><HiSparkles /> Practice Studio</span>
              <h3 className="studio-title">{module.title}</h3>
            </div>
            <button className="btn-close" onClick={onClose}><HiXMark /></button>
          </div>

          <div className="studio-tabs font-mono">
            <button
              className={`studio-tab-btn ${activeTab === 'flashcards' ? 'active' : ''}`}
              onClick={() => setActiveTab('flashcards')}
            >
              <HiRectangleStack /> 3D Active Recall Deck
            </button>
            <button
              className={`studio-tab-btn ${activeTab === 'quiz' ? 'active' : ''}`}
              onClick={() => setActiveTab('quiz')}
            >
              <HiCheckBadge /> Knowledge Check Quiz
            </button>
          </div>

          <div className="modal-body">
            {loading ? (
              <div className="studio-loading-state text-center">
                <HiArrowPath className="spin-icon-lg text-indigo" />
                <p>Synthesizing 3D active recall materials for <strong>{module.title}</strong>...</p>
              </div>
            ) : error ? (
              <div className="studio-error-state text-center">
                <p className="text-danger">{error}</p>
              </div>
            ) : (
              <>
                {activeTab === 'flashcards' && (
                  <FlashcardList flashcards={studyData?.flashcards || []} />
                )}
                {activeTab === 'quiz' && (
                  <Quiz quiz={studyData?.quiz || []} />
                )}
              </>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
