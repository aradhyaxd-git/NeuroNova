import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { HiExclamationTriangle, HiSparkles, HiBookOpen, HiVideoCamera, HiCodeBracket, HiDocumentText } from 'react-icons/hi2';

export default function ProblemChaosVisual() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start']
  });

  const chaosScale = useTransform(scrollYProgress, [0, 0.4, 0.7, 1], [0.85, 1.1, 0.9, 0.75]);
  const chaosOpacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.4, 1, 1, 0]);
  const coreScale = useTransform(scrollYProgress, [0.4, 0.75, 1], [0.4, 1.1, 1]);
  const textOpacity = useTransform(scrollYProgress, [0.15, 0.35, 0.7, 0.9], [0, 1, 1, 0]);

  const scatteredItems = [
    { title: '120-hour YouTube Tutorial', type: 'Video', icon: <HiVideoCamera />, x: [-180, 0], y: [-100, 0], rot: [-18, 0] },
    { title: 'Unstructured Medium Post', type: 'Article', icon: <HiDocumentText />, x: [190, 0], y: [-110, 0], rot: [22, 0] },
    { title: 'Outdated StackOverflow Thread', type: 'Forum', icon: <HiCodeBracket />, x: [-200, 0], y: [90, 0], rot: [-12, 0] },
    { title: '800-page PDF Documentation', type: 'Docs', icon: <HiBookOpen />, x: [210, 0], y: [100, 0], rot: [16, 0] },
    { title: 'Random Github Repo Draft', type: 'Code', icon: <HiCodeBracket />, x: [0, 0], y: [-160, 0], rot: [10, 0] },
    { title: 'Prerequisite Gap Warning', type: 'Error', icon: <HiExclamationTriangle />, x: [-140, 0], y: [150, 0], rot: [-24, 0] }
  ];

  return (
    <div ref={containerRef} className="narrative-section problem-chaos-section">
      <div className="section-sticky-content">
        <motion.div style={{ opacity: textOpacity }} className="text-center narrative-header">
          <span className="badge-pill danger"><HiExclamationTriangle /> THE LEARNING DILEMMA</span>
          <h2 className="narrative-title">Too many things to learn.<br /><span className="text-gradient-danger">No clear path forward.</span></h2>
          <p className="narrative-desc">Information overload, fragmented tutorials, and missing prerequisites waste hundreds of hours of your valuable time.</p>
        </motion.div>

        <div className="chaos-stage-viewport">
          <motion.div style={{ scale: chaosScale, opacity: chaosOpacity }} className="chaos-nodes-container">
            {scatteredItems.map((item, idx) => (
              <motion.div
                key={idx}
                className="chaos-card card-surface glow-border"
                style={{
                  x: useTransform(scrollYProgress, [0.15, 0.65], item.x),
                  y: useTransform(scrollYProgress, [0.15, 0.65], item.y),
                  rotate: useTransform(scrollYProgress, [0.15, 0.65], item.rot)
                }}
              >
                <span className="chaos-type">{item.type}</span>
                <div className="chaos-card-title">
                  {item.icon}
                  <strong>{item.title}</strong>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Central AI Synthesis Core */}
          <motion.div style={{ scale: coreScale, opacity: useTransform(scrollYProgress, [0.5, 0.75], [0, 1]) }} className="synthesis-core-orb">
            <div className="core-pulse-ring" />
            <HiSparkles className="core-icon" />
            <span className="core-label">NeuroNova AI Engine Synthesizing...</span>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
