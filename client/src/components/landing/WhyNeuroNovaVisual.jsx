import { motion } from 'framer-motion';
import { HiSparkles, HiMap, HiAcademicCap, HiChatBubbleLeftRight, HiChartBar, HiShieldCheck, HiCpuChip } from 'react-icons/hi2';

export default function WhyNeuroNovaVisual() {
  const capabilities = [
    { title: 'Personalized Paths', icon: <HiMap className="purple" />, desc: 'Custom curriculum sequencing tailored to your time & background.' },
    { title: 'Prerequisite Intelligence', icon: <HiCpuChip className="emerald" />, desc: 'No missing foundations; every node has validated prerequisite logic.' },
    { title: '3D Active Recall', icon: <HiAcademicCap className="amber" />, desc: 'Hardware-accelerated 3D flashcards with interval memory retention.' },
    { title: 'AI Explainability', icon: <HiChatBubbleLeftRight className="rose" />, desc: 'Transparent rationale for why every module is recommended.' },
    { title: 'Workspace Analytics', icon: <HiChartBar className="purple" />, desc: 'Jira-style Kanban boards with velocity & mastery metrics.' },
    { title: 'Adaptive Re-balancing', icon: <HiShieldCheck className="emerald" />, desc: 'Paths dynamically adjust when you hit difficult milestones.' }
  ];

  return (
    <div className="narrative-section why-neuronova-section">
      <div className="section-sticky-content text-center">
        <div className="narrative-header">
          <span className="badge-pill"><HiSparkles /> THE NEURONOVA ADVANTAGE</span>
          <h2 className="narrative-title">Engineered for Maximum Retention</h2>
          <p className="narrative-desc">Every capability is connected to the central AI learning model.</p>
        </div>

        <div className="capabilities-system-grid">
          {capabilities.map((cap, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.2, delay: idx * 0.05 }}
              className="capability-node-card card-surface glow-border"
            >
              <div className="cap-icon-wrap">{cap.icon}</div>
              <h3>{cap.title}</h3>
              <p>{cap.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
