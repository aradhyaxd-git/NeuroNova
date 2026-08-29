import { motion } from 'framer-motion';
import {
  HiChartBar, HiArrowTrendingUp, HiTrophy, HiCheckBadge,
  HiAcademicCap, HiSparkles, HiPlayCircle, HiClock
} from 'react-icons/hi2';

export default function TrajectoryDashboard({ profile, roadmap, completedModules = [], onNextActionClick }) {
  const totalModules = roadmap?.stages?.reduce((acc, s) => acc + s.modules.length, 0) || 6;
  const completedCount = completedModules.length;
  const progressPercent = Math.round((completedCount / Math.max(1, totalModules)) * 100);

  // Skill deltas calculated dynamically from profile and completed modules
  const skillDeltas = [
    { name: profile.interests?.[0] || 'Core Architecture', level: Math.min(95, 45 + completedCount * 12), delta: `+${15 + completedCount * 5}%` },
    { name: profile.interests?.[1] || 'API & System Design', level: Math.min(90, 30 + completedCount * 14), delta: `+${12 + completedCount * 6}%` },
    { name: 'Practical Problem Solving', level: Math.min(88, 50 + completedCount * 10), delta: `+${10 + completedCount * 4}%` },
    { name: 'Applied Production Build', level: Math.min(85, 20 + completedCount * 15), delta: `+${18 + completedCount * 7}%` }
  ];

  const nextModule = roadmap?.stages
    ?.flatMap(s => s.modules)
    ?.find(m => !completedModules.includes(m.id) && m.status !== 'locked');

  return (
    <div className="dashboard-wrapper">
      <div className="section-header-compact">
        <span className="badge-pill"><HiSparkles /> TRAJECTORY & GROWTH ENGINE</span>
        <h2 className="section-title-md">Skill Trajectory & Momentum</h2>
        <p className="section-sub-text">Visualizing your skill delta trajectory over time, milestone velocity, and next actions.</p>
      </div>

      <div className="stats-hero-grid">
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="stat-card card-surface glow-border">
          <div className="stat-icon-wrap purple"><HiArrowTrendingUp /></div>
          <div className="stat-content">
            <span className="stat-label">Overall Completion Trajectory</span>
            <div className="stat-value-row">
              <strong className="stat-value font-mono">{progressPercent}%</strong>
              <span className="trend-badge positive"><HiArrowTrendingUp /> On Track</span>
            </div>
            <p className="stat-subtext">{completedCount} of {totalModules} path modules completed</p>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="stat-card card-surface glow-border">
          <div className="stat-icon-wrap emerald"><HiTrophy /></div>
          <div className="stat-content">
            <span className="stat-label">Milestones Achieved</span>
            <div className="stat-value-row">
              <strong className="stat-value font-mono">{completedCount}</strong>
              <span className="stat-unit font-mono">/ {roadmap?.totalMilestones || 4}</span>
            </div>
            <p className="stat-subtext">Consistently building long-term retention</p>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="stat-card card-surface glow-border">
          <div className="stat-icon-wrap amber"><HiClock /></div>
          <div className="stat-content">
            <span className="stat-label">Weekly Velocity</span>
            <div className="stat-value-row">
              <strong className="stat-value font-mono">{profile.weeklyHours || 6}</strong>
              <span className="stat-unit font-mono">hrs / wk</span>
            </div>
            <p className="stat-subtext">Est. completion in {roadmap?.targetDurationWeeks || 4} weeks</p>
          </div>
        </motion.div>
      </div>

      <div className="dashboard-main-grid">
        {/* Skill Deltas Column */}
        <div className="skills-trajectory-card card-surface glow-border">
          <div className="card-heading">
            <div className="heading-icon-badge"><HiChartBar /></div>
            <div>
              <h3>Skill Development Deltas</h3>
              <p>Real-time competency growth across key domain areas.</p>
            </div>
          </div>

          <div className="skills-deltas-list">
            {skillDeltas.map((skill, i) => (
              <div key={i} className="skill-delta-item">
                <div className="skill-meta-row">
                  <strong className="skill-name-text">{skill.name}</strong>
                  <span className="delta-badge-pill font-mono">{skill.delta} growth</span>
                </div>
                <div className="progress-track-custom">
                  <motion.div
                    className="progress-fill-custom"
                    initial={{ width: 0 }}
                    animate={{ width: `${skill.level}%` }}
                    transition={{ duration: 0.8, delay: i * 0.1 }}
                  />
                </div>
                <div className="level-footer-row">
                  <span>Current Proficiency</span>
                  <strong className="font-mono">{skill.level}%</strong>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Next Recommended Action Column */}
        <div className="next-action-card card-surface glow-border">
          <div className="card-heading">
            <div className="heading-icon-badge purple"><HiPlayCircle /></div>
            <div>
              <h3>Recommended Next Action</h3>
              <p>Keep your momentum active with your immediate focus.</p>
            </div>
          </div>

          {nextModule ? (
            <div className="next-action-body">
              <div className="next-module-preview card-surface">
                <span className="action-type-pill">{nextModule.type?.toUpperCase() || 'CORE MODULE'}</span>
                <h4>{nextModule.title}</h4>
                <p className="reason-text">{nextModule.explainability?.topReason || 'Next step in your curated progression.'}</p>
                <div className="action-meta-row">
                  <span><HiClock /> Est. {nextModule.estimatedHours || 2} hours</span>
                  <span><HiAcademicCap /> Key Path Module</span>
                </div>
              </div>

              <button className="btn-vibrant-primary btn-block" onClick={() => onNextActionClick(nextModule)}>
                <HiPlayCircle /> Start Next Action <HiSparkles />
              </button>
            </div>
          ) : (
            <div className="next-action-complete">
              <HiCheckBadge className="complete-icon" />
              <h4>All Current Modules Complete!</h4>
              <p>You have mastered all milestones in this sequence. Use the chat intake to refine or level up your path.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
