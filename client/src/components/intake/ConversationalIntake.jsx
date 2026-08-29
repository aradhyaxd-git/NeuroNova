import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HiPaperAirplane, HiSparkles, HiArrowRight, HiUser, HiBolt, HiArrowPath, HiAcademicCap, HiClock, HiDocumentDuplicate } from 'react-icons/hi2';
import { ParticlesOrb } from '../../registry/orbe/particles-orb/particles-orb';
import { OrbStatus } from '../../registry/lib/orb-status';
import { sendChatIntake } from '../../api/studyApi';

const QUICK_PROMPTS = [
  "I want to become a Full-Stack AI Engineer in 6 weeks (6 hrs/wk)",
  "I'm a beginner wanting to learn Python, LLMs, and Data Science",
  "I want to master System Design & Distributed Systems for senior engineering roles",
  "I want to build production AI applications with Gemini & React"
];

export default function ConversationalIntake({ messages, setMessages, profile, setProfile, onGenerateRoadmap, isGenerating }) {
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState(null);
  const chatEndRef = useRef(null);

  // Dynamic Orb State: 'idle' -> 'thinking' during send/generation -> 'speaking' on message arriving
  const orbState = isGenerating ? 'thinking' : sending ? 'thinking' : 'idle';

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, sending]);

  const handleSend = async (textToSend) => {
    const query = (textToSend || input).trim();
    if (!query || sending) return;

    const userMsg = { role: 'user', content: query };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput('');
    setSending(true);

    try {
      const data = await sendChatIntake(updatedMessages, profile);
      if (data.reply) {
        setMessages([...updatedMessages, { role: 'assistant', content: data.reply }]);
      }
      if (data.extractedProfile) {
        setProfile(prev => ({
          ...prev,
          ...data.extractedProfile
        }));
      }
    } catch (err) {
      console.error(err);
      setMessages([...updatedMessages, {
        role: 'assistant',
        content: "I ran into an issue connecting to the AI advisor backend. You can still generate your roadmap below!"
      }]);
    } finally {
      setSending(false);
    }
  };

  const copyToClipboard = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  return (
    <div className="intake-wrapper">
      <div className="intake-header">
        <span className="badge-pill"><HiSparkles /> PILLAR 1: CONVERSATIONAL INTAKE & PROFILE SYNTHESIS</span>
        <h2>Describe Your Goal & Target Outcome</h2>
        <p className="subtitle">NeuroNova's AI Advisor will converse with you, extract your skills, available hours, and map out your roadmap.</p>
      </div>

      <div className="intake-split-grid">
        {/* Left Column: Interactive Orb & Profile Snapshot */}
        <div className="intake-sidebar">
          {/* Interactive WebGL Particles Orb */}
          <div className="orb-display-card card-surface glow-subtle">
            <ParticlesOrb state={orbState} />
            <OrbStatus state={orbState} />
          </div>

          <div className="profile-context-card card-surface">
            <div className="sidebar-heading">
              <HiBolt />
              <h4>Extracted Learner Profile</h4>
            </div>

            <div className="profile-context-item">
              <span className="ctx-label">Target Goal</span>
              <strong className="ctx-value">{profile.goal || 'Not specified yet'}</strong>
            </div>

            <div className="profile-context-row">
              <div className="profile-context-item">
                <span className="ctx-label">Level</span>
                <span className="ctx-tag">{profile.experienceLevel || 'Intermediate'}</span>
              </div>
              <div className="profile-context-item">
                <span className="ctx-label">Weekly Hours</span>
                <span className="ctx-tag font-mono">{profile.weeklyHours || 6} hrs/wk</span>
              </div>
            </div>

            <div className="profile-context-item">
              <span className="ctx-label">Validated Focus Topics</span>
              <div className="ctx-tags-wrap">
                {(profile.interests || ['React', 'Node.js', 'System Design']).map((t, i) => (
                  <span key={i} className="ctx-chip">{t}</span>
                ))}
              </div>
            </div>

            <button
              className="btn-vibrant-primary btn-block mt-4"
              onClick={onGenerateRoadmap}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <><HiArrowPath className="spin-icon" /> Synthesizing Roadmap...</>
              ) : (
                <><HiSparkles /> Generate 3D Learning Path <HiArrowRight /></>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: Chat History & Advisor */}
        <div className="chat-container card-surface">
          <div className="messages-scroll">
            {messages.map((msg, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className={`message-bubble ${msg.role === 'user' ? 'user-bubble' : 'ai-bubble'}`}
              >
                <div className="avatar-icon">
                  {msg.role === 'user' ? <HiUser /> : <HiSparkles />}
                </div>

                <div className="bubble-content">
                  <div className="bubble-top-bar">
                    <span className="sender-label">{msg.role === 'user' ? 'You' : 'NeuroNova Advisor'}</span>
                    <button
                      className="btn-copy-msg"
                      onClick={() => copyToClipboard(msg.content, idx)}
                      title="Copy text"
                    >
                      <HiDocumentDuplicate /> {copiedIdx === idx ? 'Copied!' : ''}
                    </button>
                  </div>
                  <p>{msg.content}</p>
                </div>
              </motion.div>
            ))}

            {sending && (
              <div className="message-bubble ai-bubble">
                <div className="avatar-icon"><HiSparkles /></div>
                <div className="bubble-content thinking">
                  <p><span className="pulse-dot" /> AI Advisor is analyzing your goals...</p>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Quick Starter Prompts */}
          <div className="quick-prompts-bar">
            <span className="quick-label"><HiAcademicCap /> Starter Intent Suggestions:</span>
            <div className="prompts-grid">
              {QUICK_PROMPTS.map((promptText, i) => (
                <button
                  key={i}
                  className="prompt-chip"
                  onClick={() => handleSend(promptText)}
                  disabled={sending}
                >
                  {promptText}
                </button>
              ))}
            </div>
          </div>

          {/* Chat Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="chat-input-row"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="e.g. I want to build production AI applications in 6 weeks..."
              disabled={sending}
            />
            <button type="submit" className="btn-send" disabled={!input.trim() || sending}>
              <HiPaperAirplane />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
