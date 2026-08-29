import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiXMark, HiSparkles, HiAcademicCap, HiClock, HiArrowRight } from 'react-icons/hi2';

export default function CreatePathModal({ isOpen, onClose, onCreatePath, isGenerating }) {
  const [goal, setGoal] = useState('');
  const [level, setLevel] = useState('Intermediate');
  const [hours, setHours] = useState(6);
  const [topics, setTopics] = useState('React, System Design, AI Applications');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!goal.trim()) return;

    const newProfile = {
      goal: goal.trim(),
      experienceLevel: level,
      weeklyHours: Number(hours),
      interests: topics.split(',').map(t => t.trim()).filter(Boolean)
    };

    onCreatePath(newProfile);
  };

  return (
    <AnimatePresence>
      <div className="modal-backdrop" onClick={onClose}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="create-path-modal card-surface glow-border"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="modal-header">
            <div className="modal-title-wrap">
              <span className="badge-pill"><HiSparkles /> CREATE NEW PATH</span>
              <h3>Configure Your Learning Roadmap</h3>
            </div>
            <button className="btn-close" onClick={onClose}>
              <HiXMark />
            </button>
          </div>

          <form className="modal-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Target Objective or Career Goal</label>
              <input
                type="text"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                placeholder="e.g. Master System Design & Distributed Architecture"
                required
                autoFocus
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label><HiAcademicCap /> Experience Level</label>
                <select value={level} onChange={(e) => setLevel(e.target.value)}>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>

              <div className="form-group">
                <label><HiClock /> Weekly Availability</label>
                <select value={hours} onChange={(e) => setHours(e.target.value)}>
                  <option value={3}>3 hours / week</option>
                  <option value={6}>6 hours / week</option>
                  <option value={10}>10 hours / week</option>
                  <option value={15}>15+ hours / week</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Focus Topics (comma separated)</label>
              <input
                type="text"
                value={topics}
                onChange={(e) => setTopics(e.target.value)}
                placeholder="e.g. React, Node.js, LLMs, Docker"
              />
            </div>

            <div className="modal-actions">
              <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
              <button type="submit" className="btn-primary" disabled={isGenerating || !goal.trim()}>
                {isGenerating ? 'Generating Path...' : 'Generate Path Roadmap'} <HiArrowRight />
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
