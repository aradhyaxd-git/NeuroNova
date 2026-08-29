import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiMagnifyingGlass, HiSparkles, HiHome, HiMap, HiChatBubbleLeftRight, HiUser, HiChartBar, HiXMark } from 'react-icons/hi2';

export default function CommandPalette({ isOpen, onClose, roadmap, onNavigate, onSelectModule }) {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else onOpenPalette();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const navigationItems = [
    { id: 'overview', title: 'Dashboard Overview', icon: <HiHome />, category: 'Views' },
    { id: 'roadmap', title: 'Learning Path Roadmap Board', icon: <HiMap />, category: 'Views' },
    { id: 'intake', title: 'AI Co-Pilot & Intake Studio', icon: <HiChatBubbleLeftRight />, category: 'Views' },
    { id: 'profile', title: 'Learner Intelligence Profile', icon: <HiUser />, category: 'Views' },
    { id: 'trajectory', title: 'Skill Trajectory & Velocity', icon: <HiChartBar />, category: 'Views' }
  ];

  // Gather modules from roadmap
  const allModules = (roadmap?.stages || []).flatMap((stage) => stage.modules || []);

  const filteredViews = navigationItems.filter(item =>
    item.title.toLowerCase().includes(query.toLowerCase())
  );

  const filteredModules = allModules.filter(mod =>
    mod.title.toLowerCase().includes(query.toLowerCase()) ||
    (mod.whyRecommended || '').toLowerCase().includes(query.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="modal-backdrop" onClick={onClose}>
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.16 }}
          className="command-palette-modal card-surface"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="palette-input-row">
            <HiMagnifyingGlass className="palette-search-icon" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Type a command, module title or search views..."
              autoFocus
            />
            <button className="btn-close-palette" onClick={onClose}>
              <HiXMark />
            </button>
          </div>

          <div className="palette-results-list">
            {/* Quick Views */}
            {filteredViews.length > 0 && (
              <div className="palette-group">
                <span className="group-label">WORKSPACE NAVIGATION</span>
                {filteredViews.map((item) => (
                  <button
                    key={item.id}
                    className="palette-result-item"
                    onClick={() => {
                      onNavigate(item.id);
                      onClose();
                    }}
                  >
                    <span className="item-icon">{item.icon}</span>
                    <span className="item-title">{item.title}</span>
                    <span className="item-badge">Jump to view</span>
                  </button>
                ))}
              </div>
            )}

            {/* Modules */}
            {filteredModules.length > 0 && (
              <div className="palette-group">
                <span className="group-label">PATH MODULES</span>
                {filteredModules.map((mod) => (
                  <button
                    key={mod.id}
                    className="palette-result-item"
                    onClick={() => {
                      onSelectModule(mod);
                      onClose();
                    }}
                  >
                    <span className="item-icon"><HiSparkles /></span>
                    <div className="item-info">
                      <span className="item-title">{mod.title}</span>
                      <small className="item-sub">{mod.type} · {mod.estimatedHours || 4} hrs</small>
                    </div>
                    <span className="item-badge">Open Drawer</span>
                  </button>
                ))}
              </div>
            )}

            {filteredViews.length === 0 && filteredModules.length === 0 && (
              <div className="palette-empty text-center">
                <p>No matching commands or modules found for "{query}".</p>
              </div>
            )}
          </div>

          <div className="palette-footer">
            <span><kbd>↑</kbd> <kbd>↓</kbd> to navigate</span>
            <span><kbd>ESC</kbd> to exit</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
