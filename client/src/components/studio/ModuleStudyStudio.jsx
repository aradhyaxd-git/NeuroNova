import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiXMark, HiSparkles, HiRectangleStack, HiCheckBadge, HiArrowPath } from 'react-icons/hi2';
import FlashcardList from '../FlashcardList';
import Quiz from '../Quiz';

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
        const res = await fetch('http://localhost:5000/api/study-set', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            notes: `Module Title: ${module.title}. Type: ${module.type}. Details: ${module.explainability?.detailedWhy || module.explainability?.topReason || 'Fundamental learning module'}. Focus topics: ${(module.explainability?.skillGains || []).join(', ')}.`
          })
        });
        const data = await res.json();
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

          <div className="studio-tabs">
            <button
              className={`studio-tab-btn ${activeTab === 'flashcards' ? 'active' : ''}`}
              onClick={() => setActiveTab('flashcards')}
            >
              <HiRectangleStack /> Active Recall Flashcards ({studyData?.flashcards?.length || 0})
            </button>
            <button
              className={`studio-tab-btn ${activeTab === 'quiz' ? 'active' : ''}`}
              onClick={() => setActiveTab('quiz')}
            >
              <HiCheckBadge /> Knowledge Quiz ({studyData?.quiz?.length || 0})
            </button>
          </div>

          <div className="studio-body">
            {loading && (
              <div className="studio-loading">
                <HiArrowPath className="spin-icon text-indigo" />
                <p>Generating personalized flashcards & quiz for <strong>{module.title}</strong>...</p>
              </div>
            )}

            {!loading && error && (
              <div className="empty-state">
                <p>{error}</p>
                <button className="btn-secondary" onClick={() => window.location.reload()}>Retry</button>
              </div>
            )}

            {!loading && studyData && (
              <div className="studio-content-panel">
                {activeTab === 'flashcards' ? (
                  <FlashcardList cards={studyData.flashcards || []} />
                ) : (
                  <Quiz quiz={studyData.quiz || []} />
                )}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
