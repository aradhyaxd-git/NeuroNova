import { motion } from 'framer-motion';
import {
  HiSparkles, HiPlayCircle, HiCheckCircle, HiArrowRight,
  HiClock, HiBookOpen, HiAcademicCap, HiWrenchScrewdriver, HiLightBulb
} from 'react-icons/hi2';

export default function DashboardOverview({ profile, roadmap, completedModules = [], onNavigate, onLaunchStudio }) {
  const activeModule = roadmap?.stages?.[0]?.modules?.[1] || {
    id: 'mod_102',
    title: 'Modern State & Data Flow Architecture',
    type: 'Core Concept',
    estimatedHours: 4,
    whyRecommended: 'Essential foundation for predictable AI data streams and component state synchronization.'
  };

  const isCompleted = completedModules.includes(activeModule.id);

  return (
    <div className="overview-wrapper">
      {/* Editorial Welcome Header */}
      <div className="overview-hero card-surface glow-border">
        <div className="hero-welcome-text">
          <span className="badge-pill">
            <HiSparkles /> ACTIVE LEARNING TRAJECTORY
          </span>
          <h2>{profile.goal || 'Master Full-Stack AI Engineering'}</h2>
          <p className="hero-subtext">
            Level: <strong>{profile.experienceLevel || 'Intermediate'}</strong> · Commitment: <strong>{profile.weeklyHours || 6} hrs/week</strong>
          </p>
        </div>
        <div className="hero-actions">
          <button className="btn-vibrant-primary" onClick={() => onNavigate('roadmap')}>
            <HiSparkles /> Explore Path Roadmap <HiArrowRight />
          </button>
        </div>
      </div>

      {/* Active Module Focus & Mastery Grid */}
      <div className="overview-main-grid">
        {/* Left: Active Focus Module Card */}
        <div className="active-focus-card card-surface glow-border">
          <div className="focus-card-header">
            <div className="focus-eyebrow">
              <span className="focus-dot" /> CURRENT FOCUS MODULE
            </div>
            <span className="est-badge"><HiClock /> {activeModule.estimatedHours || 4} hours</span>
          </div>

          <h3 className="focus-title">{activeModule.title}</h3>

          <div className="why-box">
            <HiLightBulb className="why-icon" />
            <p><strong>Why this module now:</strong> {activeModule.whyRecommended}</p>
          </div>

          <div className="focus-progress-block">
            <div className="progress-label-row">
              <span className="progress-title-text">Module Progress</span>
              <span className="progress-val-text font-mono">{isCompleted ? '100% Completed' : '45% In Progress'}</span>
            </div>
            <div className="progress-track-custom">
              <div className="progress-fill-custom" style={{ width: isCompleted ? '100%' : '45%' }} />
            </div>
          </div>

          <div className="focus-card-actions">
            <button className="btn-vibrant-primary" onClick={() => onLaunchStudio(activeModule)}>
              <HiPlayCircle /> {isCompleted ? 'Review Module Studio' : 'Continue Study Studio'}
            </button>
            <button className="btn-secondary" onClick={() => onNavigate('intake')}>
              Ask AI Mentor
            </button>
          </div>
        </div>

        {/* Right: Mastered Skills & Momentum */}
        <div className="mastery-summary-card card-surface glow-border">
          <div className="card-heading">
            <div className="heading-icon-badge"><HiAcademicCap /></div>
            <div>
              <h3>Skill Retention & Mastery</h3>
              <p>Tracked across interactive modules</p>
            </div>
          </div>

          <div className="mastery-metrics-list">
            <div className="mastery-metric-item">
              <div className="metric-icon-wrap purple"><HiBookOpen /></div>
              <div className="metric-info">
                <span className="metric-label">Theoretical Concepts</span>
                <strong className="metric-val font-mono">78% Retained</strong>
              </div>
            </div>

            <div className="mastery-metric-item">
              <div className="metric-icon-wrap emerald"><HiCheckCircle /></div>
              <div className="metric-info">
                <span className="metric-label">Interactive Practice Labs</span>
                <strong className="metric-val font-mono">62% Completed</strong>
              </div>
            </div>

            <div className="mastery-metric-item">
              <div className="metric-icon-wrap amber"><HiSparkles /></div>
              <div className="metric-info">
                <span className="metric-label">Active Recall Flashcards</span>
                <strong className="metric-val font-mono">85% Mastery</strong>
              </div>
            </div>

            <div className="mastery-metric-item">
              <div className="metric-icon-wrap rose"><HiWrenchScrewdriver /></div>
              <div className="metric-info">
                <span className="metric-label">Applied Capstone Projects</span>
                <strong className="metric-val font-mono">Stage 2 Active</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
