import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { HiSparkles, HiAcademicCap, HiClock, HiCpuChip, HiCheckBadge, HiChartBar } from 'react-icons/hi2';

export default function MeetAiCoreVisual() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start']
  });

  const signalScale = useTransform(scrollYProgress, [0.1, 0.5, 0.9], [0.6, 1, 0.8]);
  const orbGlow = useTransform(scrollYProgress, [0.3, 0.6, 0.9], ['0 0 20px rgba(99,102,241,0.2)', '0 0 80px rgba(99,102,241,0.6)', '0 0 40px rgba(16,185,129,0.4)']);

  const inputSignals = [
    { title: 'CAREER GOAL', detail: 'Senior Full-Stack Engineer', icon: <HiAcademicCap />, pos: 'top-left' },
    { title: 'EXPERIENCE LEVEL', detail: 'Intermediate Developer', icon: <HiCpuChip />, pos: 'top-right' },
    { title: 'WEEKLY HOURS', detail: '6 Hours / Week', icon: <HiClock />, pos: 'bottom-left' },
    { title: 'LEARNING STYLE', detail: 'Applied Labs & Active Recall', icon: <HiChartBar />, pos: 'bottom-right' }
  ];

  return (
    <div ref={ref} className="narrative-section meet-ai-section">
      <div className="section-sticky-content">
        <div className="text-center narrative-header">
          <span className="badge-pill"><HiSparkles /> STEP 1: AI INTELLIGENCE INGESTION</span>
          <h2 className="narrative-title">Meet the NeuroNova AI Engine</h2>
          <p className="narrative-desc">It processes your career aspirations, current skill set, and time budget into an intelligent model.</p>
        </div>

        <div className="ai-core-stage">
          {/* Signal Cards Floating Inward */}
          <div className="signals-grid">
            {inputSignals.map((sig, idx) => (
              <motion.div
                key={idx}
                className={`signal-card card-surface glow-border ${sig.pos}`}
                style={{
                  scale: signalScale,
                  x: useTransform(scrollYProgress, [0.2, 0.6], [idx % 2 === 0 ? -120 : 120, 0]),
                  y: useTransform(scrollYProgress, [0.2, 0.6], [idx < 2 ? -80 : 80, 0])
                }}
              >
                <div className="signal-icon">{sig.icon}</div>
                <div className="signal-text">
                  <small className="font-mono">{sig.title}</small>
                  <strong>{sig.detail}</strong>
                </div>
                <HiCheckBadge className="signal-check emerald" />
              </motion.div>
            ))}
          </div>

          {/* Central AI Processor Core */}
          <motion.div
            style={{ boxShadow: orbGlow }}
            className="ai-processor-orb card-surface"
          >
            <div className="orb-inner-ring" />
            <HiSparkles className="processor-sparkle" />
            <span className="processor-title">Gemini 2.5 Engine</span>
            <small className="processor-status font-mono">Synthesizing Prerequisite Graph...</small>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
