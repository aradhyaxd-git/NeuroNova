import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { HiSparkles, HiViewColumns, HiClock, HiCheckCircle, HiPlayCircle } from 'react-icons/hi2';

export default function WorkspaceTransitionVisual() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start']
  });

  const cardMoveX = useTransform(scrollYProgress, [0.2, 0.6, 0.9], [0, 320, 640]);

  return (
    <div ref={ref} className="narrative-section workspace-transition-section">
      <div className="section-sticky-content">
        <div className="text-center narrative-header">
          <span className="badge-pill"><HiSparkles /> STEP 3: WORKSPACE TRANSFORMATION</span>
          <h2 className="narrative-title">Jira-Inspired Practice Workspace</h2>
          <p className="narrative-desc">Track milestones in real-time as your knowledge progresses across Kanban board columns.</p>
        </div>

        <div className="kanban-stage-viewport card-surface glow-border">
          <div className="kanban-stage-topbar">
            <div className="window-dots"><span /><span /><span /></div>
            <span className="stage-title font-mono"><HiViewColumns /> NeuroNova Kanban Workspace</span>
            <span className="stage-badge">AUTOMATED WORKFLOW</span>
          </div>

          <div className="kanban-stage-columns">
            {/* Column 1: TO LEARN */}
            <div className="kanban-stage-col">
              <div className="col-header-bar">
                <span className="col-dot muted" />
                <strong>TO LEARN</strong>
              </div>
              <div className="col-cards-wrapper">
                <div className="demo-kanban-card card-surface">
                  <small>COURSE · 20h</small>
                  <h4>Node.js Microservices</h4>
                </div>
              </div>
            </div>

            {/* Column 2: IN PROGRESS */}
            <div className="kanban-stage-col">
              <div className="col-header-bar">
                <span className="col-dot purple" />
                <strong>IN PROGRESS</strong>
              </div>
              <div className="col-cards-wrapper relative-slot">
                {/* Moving Animated Card */}
                <motion.div
                  style={{ x: cardMoveX }}
                  className="demo-kanban-card card-surface active-moving-card glow-border"
                >
                  <div className="card-top-tag">
                    <span className="type-badge">CORE MODULE</span>
                    <span className="est-hours"><HiClock /> 18h</span>
                  </div>
                  <h4>Advanced React 19 & Architecture</h4>
                  <div className="card-status-footer">
                    <HiPlayCircle className="purple" />
                    <span>Active Workflow</span>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Column 3: MASTERED */}
            <div className="kanban-stage-col">
              <div className="col-header-bar">
                <span className="col-dot emerald" />
                <strong>MASTERED</strong>
              </div>
              <div className="col-cards-wrapper">
                <div className="demo-kanban-card card-surface completed">
                  <small>CONCEPT · 12h</small>
                  <h4 className="flex items-center gap-2"><HiCheckCircle className="emerald" /> JavaScript Event Loop</h4>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
