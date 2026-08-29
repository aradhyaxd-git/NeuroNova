import { motion } from 'framer-motion';
import { HiSparkles, HiArrowUpRight, HiChatBubbleLeftRight, HiMap, HiChartBar } from 'react-icons/hi2';

export default function Hero({ onStart }) {
  const topics = [
    'Machine Learning', 'Full-Stack React', 'System Design', 'LLM Integration', 'Python Data Science'
  ];

  const pillars = [
    {
      number: '01',
      title: 'Conversational Intake',
      desc: 'Describe your learning goal naturally. Refine topics and constraints anytime.',
      icon: <HiChatBubbleLeftRight />
    },
    {
      number: '02',
      title: 'Claude-Style Artifact Roadmap',
      desc: 'Interactive visual timeline graph with stage nodes, prerequisites, and milestones.',
      icon: <HiMap />
    },
    {
      number: '03',
      title: 'Inline Explainability & Trajectory',
      desc: 'Transparent AI reasoning for every node paired with real competency growth tracking.',
      icon: <HiChartBar />
    }
  ];

  return (
    <section className="hero-section shell" id="top">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
        className="hero-editorial-card card-surface"
      >
        <div className="hero-badge">
          <HiSparkles className="badge-sparkle" /> Learn fast with AI at your side
        </div>

        <h1 className="hero-editorial-title">
          AI AS YOUR <br />
          <em>STUDY WINGMAN</em>
        </h1>

        <p className="hero-lede">
          Master in-demand skills with personalized AI-generated roadmaps, transparent inline explainability, and real skill growth trajectory.
        </p>

        <div className="topic-tags-row">
          {topics.map((t, idx) => (
            <span key={idx} className="editorial-tag-chip">
              + {t}
            </span>
          ))}
        </div>

        <div className="hero-actions">
          <button className="btn-primary btn-hero" onClick={onStart}>
            Start Conversational Intake <HiArrowUpRight />
          </button>
        </div>
      </motion.div>

      <div className="hero-pillars-grid">
        {pillars.map((pillar, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + idx * 0.08, duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
            className="pillar-preview-card card-surface"
          >
            <div className="pillar-card-top">
              <span className="pillar-num">{pillar.number}</span>
              <div className="pillar-icon">{pillar.icon}</div>
            </div>
            <h3>{pillar.title}</h3>
            <p>{pillar.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
