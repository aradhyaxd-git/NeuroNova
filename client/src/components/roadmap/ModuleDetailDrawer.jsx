import { motion, AnimatePresence } from 'framer-motion';
import {
  HiXMark, HiSparkles, HiPlayCircle, HiClock, HiCheckCircle,
  HiAcademicCap, HiLightBulb, HiBookOpen, HiLink, HiArrowPath, HiArrowTopRightOnSquare
} from 'react-icons/hi2';
import { resolveDocUrl } from '../explainability/ExplainabilityModal';

export default function ModuleDetailDrawer({
  module,
  onClose,
  completedModules = [],
  onToggleComplete,
  onLaunchStudio,
  onAskAI
}) {
  if (!module) return null;

  const isCompleted = completedModules.includes(module.id);
  const explain = module.explainability || {};

  const defaultResources = [
    { title: `${module.title} — Official Technical Guide`, type: 'Documentation', duration: '20 mins', url: resolveDocUrl(module.title, 'Official Technical Guide', '', 'Documentation') },
    { title: `Hands-On Practical Guide for ${module.title}`, type: 'Interactive Lab', duration: '45 mins', url: resolveDocUrl(module.title, 'Practical Guide', '', 'Lab') }
  ];

  const rawResources = (module.resources && module.resources.length > 0) ? module.resources : defaultResources;

  const resources = rawResources.map((res, i) => {
    if (typeof res === 'string') {
      return {
        title: res,
        type: 'Article',
        duration: '20 mins',
        url: resolveDocUrl(module.title, res, '', 'Article')
      };
    }
    return {
      title: res.title || res.name || `${module.title} Resource #${i+1}`,
      type: res.type || 'Guide',
      duration: res.duration || '25 mins',
      url: resolveDocUrl(module.title, res.title || '', res.url || '', res.type || '')
    };
  });

  return (
    <AnimatePresence>
      <div className="drawer-backdrop" onClick={onClose}>
        <motion.aside
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 220 }}
          className="module-detail-drawer card-surface glow-border"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Top Bar */}
          <div className="drawer-header">
            <div className="drawer-eyebrow">
              <span className="type-badge">{module.type || 'Concept'}</span>
              <span className="mod-id font-mono">#{module.id}</span>
            </div>
            <button className="btn-close-drawer" onClick={onClose}>
              <HiXMark />
            </button>
          </div>

          {/* Title & Status */}
          <div className="drawer-title-block">
            <h3>{module.title}</h3>
            <div className="drawer-status-bar">
              <button
                className={`status-workflow-btn ${isCompleted ? 'completed' : 'in_progress'}`}
                onClick={() => onToggleComplete(module.id)}
              >
                {isCompleted ? <HiCheckCircle /> : <HiArrowPath className="spin-icon-hover" />}
                <span>{isCompleted ? 'MASTERED' : 'IN PROGRESS'}</span>
              </button>
              <span className="est-time font-mono"><HiClock /> {module.estimatedHours || 4} hours</span>
            </div>
          </div>

          {/* AI Explainability Rationale */}
          <div className="drawer-section">
            <div className="section-title">
              <HiLightBulb className="amber" />
              <span>AI Recommendation Rationale</span>
            </div>
            <div className="why-explain-box">
              <strong>{explain.topReason || 'Essential module for your target learning path.'}</strong>
              <p>{explain.detailedWhy || 'This module provides required architecture fundamentals to build production applications.'}</p>
            </div>
          </div>

          {/* Skill Gains */}
          {explain.skillGains && explain.skillGains.length > 0 && (
            <div className="drawer-section">
              <div className="section-title">
                <HiAcademicCap className="emerald" />
                <span>Skills Gained</span>
              </div>
              <div className="skills-chips-row">
                {explain.skillGains.map((sg, i) => (
                  <span key={i} className="skill-chip">+{sg}</span>
                ))}
              </div>
            </div>
          )}

          {/* Resources */}
          <div className="drawer-section">
            <div className="section-title">
              <HiBookOpen className="purple" />
              <span>Attached Learning Resources</span>
            </div>
            <div className="resources-list">
              {resources.map((res, i) => (
                <a key={i} href={res.url} target="_blank" rel="noreferrer" className="resource-item-card">
                  <HiLink className="res-icon" />
                  <div className="res-details">
                    <strong>{res.title}</strong>
                    <span className="res-meta">{res.type} · {res.duration}</span>
                  </div>
                  <HiArrowTopRightOnSquare className="res-external-icon" />
                </a>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="drawer-footer-actions">
            <button className="btn-vibrant-primary btn-block" onClick={() => onLaunchStudio(module)}>
              <HiPlayCircle /> Launch Practice Studio
            </button>
            <button className="btn-secondary btn-block" onClick={() => onAskAI(module)}>
              <HiSparkles /> Ask AI Mentor About This Module
            </button>
          </div>
        </motion.aside>
      </div>
    </AnimatePresence>
  );
}
