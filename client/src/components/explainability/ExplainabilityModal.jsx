import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiXMark, HiSparkles, HiPaperAirplane, HiLightBulb, HiBookOpen, HiLink, HiArrowTopRightOnSquare } from 'react-icons/hi2';

export function resolveDocUrl(moduleTitle = '', resourceTitle = '', resourceUrl = '', type = '') {
  if (resourceUrl && resourceUrl !== '#' && resourceUrl !== 'https://developer.mozilla.org' && resourceUrl.length > 15) {
    return resourceUrl;
  }

  const combined = `${moduleTitle} ${resourceTitle} ${type}`.toLowerCase();

  if (combined.includes('react')) return 'https://react.dev/learn';
  if (combined.includes('node') || combined.includes('express')) return 'https://nodejs.org/docs/latest/api/';
  if (combined.includes('postgres') || combined.includes('sql') || combined.includes('database')) return 'https://www.postgresql.org/docs/';
  if (combined.includes('redis')) return 'https://redis.io/docs/';
  if (combined.includes('typescript')) return 'https://www.typescriptlang.org/docs/';
  if (combined.includes('python')) return 'https://docs.python.org/3/';
  if (combined.includes('openai') || combined.includes('llm') || combined.includes('ai')) return 'https://platform.openai.com/docs/';
  if (combined.includes('docker')) return 'https://docs.docker.com/';
  if (combined.includes('system design') || combined.includes('architecture')) return 'https://roadmap.sh/system-design';
  if (combined.includes('javascript') || combined.includes('js')) return 'https://developer.mozilla.org/en-US/docs/Web/JavaScript';

  return `https://developer.mozilla.org/en-US/search?q=${encodeURIComponent(moduleTitle || 'web development')}`;
}

export default function ExplainabilityModal({ module, learnerGoal, onClose }) {
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [answer, setAnswer] = useState('');

  if (!module) return null;

  const handleAsk = async (e) => {
    e.preventDefault();
    if (!question.trim() || loading) return;
    setLoading(true);

    try {
      const res = await fetch('http://localhost:5000/api/explain-module', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          moduleTitle: module.title,
          userQuestion: question,
          learnerGoal
        })
      });
      const data = await res.json();
      setAnswer(data.answer || 'No answer generated.');
    } catch (err) {
      console.error(err);
      setAnswer("I could not generate an answer right now. Please check backend connection.");
    } finally {
      setLoading(false);
    }
  };

  const defaultResources = [
    { title: `${module.title} — Official Technical Guide`, type: 'Documentation', duration: '20 mins', url: resolveDocUrl(module.title, 'Official Technical Guide', '', 'Documentation') },
    { title: `Practical Hands-On Guide: ${module.title}`, type: 'Interactive Lab', duration: '45 mins', url: resolveDocUrl(module.title, 'Practical Hands-On Guide', '', 'Lab') },
    { title: `Production Architecture Brief for ${module.title}`, type: 'Architecture Guide', duration: '30 mins', url: resolveDocUrl(module.title, 'Architecture Brief', '', 'Architecture') }
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
      <div className="modal-backdrop" onClick={onClose}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="modal-card card-surface glow-border"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="modal-header">
            <div className="badge-pill compact"><HiSparkles /> Pillar 5: AI Explainability Mentor</div>
            <button className="btn-close" onClick={onClose}><HiXMark /></button>
          </div>

          <div className="modal-body">
            <h3 className="modal-module-title">{module.title}</h3>

            <div className="explain-box card-surface">
              <div className="explain-box-header">
                <HiLightBulb className="icon-bulb" />
                <strong>Why this is recommended for your goal</strong>
              </div>
              <p>{module.explainability?.detailedWhy || module.explainability?.topReason || 'Recommended as a core progression milestone.'}</p>
              
              {module.explainability?.skillGains && module.explainability.skillGains.length > 0 && (
                <div className="skills-tags-row">
                  <small>Target Skills:</small>
                  {module.explainability.skillGains.map((s, i) => (
                    <span key={i} className="skill-gain-pill">+{s}</span>
                  ))}
                </div>
              )}
            </div>

            <div className="resources-section">
              <h4><HiBookOpen /> Curated Learning Resources</h4>
              <div className="resources-grid">
                {resources.map((res, idx) => (
                  <a key={idx} href={res.url} target="_blank" rel="noreferrer" className="resource-item-card">
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

            <div className="mentor-qa-section">
              <h4><HiSparkles /> Ask AI Mentor a Follow-up Question</h4>
              <form onSubmit={handleAsk} className="qa-input-row">
                <input
                  type="text"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder={`Ask anything about ${module.title}...`}
                  disabled={loading}
                />
                <button type="submit" className="btn-vibrant-primary btn-ask" disabled={!question.trim() || loading}>
                  {loading ? 'Thinking...' : <><HiPaperAirplane /> Ask</>}
                </button>
              </form>

              {answer && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="ai-answer-box card-surface">
                  <div className="ai-label"><HiSparkles /> AI Mentor Advice</div>
                  <p>{answer}</p>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
