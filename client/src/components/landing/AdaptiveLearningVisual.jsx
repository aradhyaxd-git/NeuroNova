import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { HiSparkles, HiBolt, HiArrowPath, HiPlus } from 'react-icons/hi2';

export default function AdaptiveLearningVisual() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start']
  });

  const branchOpacity = useTransform(scrollYProgress, [0.35, 0.65], [0, 1]);
  const branchScale = useTransform(scrollYProgress, [0.35, 0.65], [0.7, 1]);

  return (
    <div ref={ref} className="narrative-section adaptive-learning-section">
      <div className="section-sticky-content">
        <div className="text-center narrative-header">
          <span className="badge-pill"><HiSparkles /> STEP 5: ADAPTIVE RE-BALANCING</span>
          <h2 className="narrative-title">Your Path Changes With You</h2>
          <p className="narrative-desc">Struggling with a concept? NeuroNova dynamically recalibrates your roadmap, branching instant prerequisite nodes.</p>
        </div>

        <div className="adaptive-graph-viewport">
          <div className="adaptive-graph-row">
            {/* Primary Node */}
            <div className="adaptive-node card-surface completed">
              <strong>Node.js APIs</strong>
              <small>Mastered</small>
            </div>

            {/* Connecting Laser Line */}
            <div className="laser-line" />

            {/* Target Struggling Node */}
            <div className="adaptive-node card-surface struggling glow-border-danger">
              <span className="alert-badge"><HiBolt /> Feedback Detected</span>
              <strong>Distributed Systems</strong>
              <small className="danger-text">Recalibrating Prerequisites...</small>
            </div>

            {/* Connecting Laser Line */}
            <div className="laser-line" />

            {/* Future Node */}
            <div className="adaptive-node card-surface muted">
              <strong>Senior Capstone</strong>
              <small>Upcoming</small>
            </div>
          </div>

          {/* Dynamically Branched Prerequisite Sub-Nodes */}
          <motion.div
            style={{ opacity: branchOpacity, scale: branchScale }}
            className="branched-nodes-row card-surface glow-border"
          >
            <div className="branch-header">
              <HiSparkles className="purple" />
              <strong><HiPlus /> AI Auto-Inserted Prerequisite Bridge:</strong>
            </div>

            <div className="sub-nodes-list">
              <div className="sub-node-chip">
                <HiArrowPath className="spin-icon-hover purple" />
                <span>Consensus Algorithms & Raft Protocol (+3h)</span>
              </div>
              <div className="sub-node-chip">
                <HiArrowPath className="spin-icon-hover purple" />
                <span>Distributed Mutex & Deadlocks (+2h)</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
