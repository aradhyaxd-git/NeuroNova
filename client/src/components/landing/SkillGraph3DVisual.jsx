import { useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { HiSparkles, HiCheckCircle, HiClock, HiAcademicCap, HiWrenchScrewdriver, HiBookOpen } from 'react-icons/hi2';

export default function SkillGraph3DVisual() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start']
  });

  const [activeNode, setActiveNode] = useState(2); // Default React

  const pathNodes = [
    { title: 'JavaScript Fundamentals', type: 'Concept', time: '12h', status: 'Completed', icon: <HiAcademicCap />, why: 'Foundational language mechanics and event loop mastery.' },
    { title: 'TypeScript & Type Systems', type: 'Concept', time: '10h', status: 'Completed', icon: <HiBookOpen />, why: 'Prevents runtime crashes with compile-time type safety.' },
    { title: 'React 19 & Architecture', type: 'Course', time: '18h', status: 'Active', icon: <HiAcademicCap />, why: 'Core milestone for modern responsive UI engineering.' },
    { title: 'Node.js & Express APIs', type: 'Course', time: '20h', status: 'Next', icon: <HiWrenchScrewdriver />, why: 'Build scalable backend services and microservices.' },
    { title: 'Databases & PostgreSQL', type: 'Course', time: '15h', status: 'Next', icon: <HiWrenchScrewdriver />, why: 'Relational data modeling and transaction safety.' },
    { title: 'Redis Caching & PubSub', type: 'Course', time: '10h', status: 'Future', icon: <HiSparkles />, why: 'Sub-millisecond data retrieval and streaming queues.' },
    { title: 'Distributed System Design', type: 'Capstone', time: '24h', status: 'Future', icon: <HiWrenchScrewdriver />, why: 'Production capstone for senior engineering roles.' }
  ];

  const graphX = useTransform(scrollYProgress, [0.1, 0.9], ['0%', '-45%']);

  return (
    <div ref={ref} className="narrative-section skill-graph-section">
      <div className="section-sticky-content">
        <div className="text-center narrative-header">
          <span className="badge-pill"><HiSparkles /> STEP 2: DYNAMIC 3D GRAPH CONSTRUCTION</span>
          <h2 className="narrative-title">Your AI-Generated Skill Graph</h2>
          <p className="narrative-desc">Every prerequisite node is logically chained to guarantee zero knowledge gaps.</p>
        </div>

        <div className="graph-viewport">
          <motion.div style={{ x: graphX }} className="nodes-timeline-track">
            {pathNodes.map((node, idx) => (
              <motion.div
                key={idx}
                className={`graph-node-card card-surface ${idx === activeNode ? 'active glow-border' : ''} ${node.status.toLowerCase()}`}
                onClick={() => setActiveNode(idx)}
                whileHover={{ scale: 1.04 }}
              >
                <div className="node-badge-row">
                  <span className="node-type-pill">{node.type}</span>
                  <span className="node-time"><HiClock /> {node.time}</span>
                </div>

                <h3 className="node-title-text">{node.title}</h3>

                <div className="node-status-row">
                  {node.status === 'Completed' && <span className="status-label completed"><HiCheckCircle /> Mastered</span>}
                  {node.status === 'Active' && <span className="status-label active"><HiSparkles /> Current Focus</span>}
                  {(node.status === 'Next' || node.status === 'Future') && <span className="status-label future">Prerequisite Target</span>}
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Active Node Inspection Box */}
          <div className="node-inspection-panel card-surface glow-border">
            <div className="inspection-header">
              <HiSparkles className="purple" />
              <strong>AI Recommendation Rationale: {pathNodes[activeNode].title}</strong>
            </div>
            <p>{pathNodes[activeNode].why}</p>
            <div className="inspection-footer">
              <span>Estimated Time: <strong>{pathNodes[activeNode].time}</strong></span>
              <span>Status: <strong className="emerald">{pathNodes[activeNode].status}</strong></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
