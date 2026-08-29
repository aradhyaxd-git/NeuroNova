import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HiPaperAirplane, HiSparkles, HiArrowRight, HiUser, HiBolt, HiArrowPath, HiAcademicCap, HiClock, HiDocumentDuplicate } from 'react-icons/hi2';
import { ParticlesOrb } from '../../registry/orbe/particles-orb/particles-orb';
import { OrbStatus } from '../../registry/lib/orb-status';

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
      const res = await fetch('http://localhost:5000/api/chat-intake', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: updatedMessages, currentProfile: profile })
      });
      const data = await res.json();
      if (data.reply) {
        setMessages([...updatedMessages, { role: 'assistant', content: data.reply }]);
      }
      if (data.extractedProfile) {
        setProfile(data.extractedProfile);
      }
    } catch (err) {
      console.error(err);
      setMessages([
        ...updatedMessages,
        { role: 'assistant', content: "I've logged your learning goal! Click 'Generate Path Roadmap' to generate your custom curriculum." }
      ]);
    } finally {
      setSending(false);
    }
  };

  const copyMessage = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  return (
    <div className="intake-wrapper">
      <div className="intake-header">
        <span className="badge-pill">
          <HiSparkles /> AI ADVISOR & INTAKE
        </span>
        <h2>Tell NeuroNova what you want to learn</h2>
        <p className="subtitle">
          Describe your career goal, preferred tech stack, or weekly availability.
        </p>
      </div>

      <div className="intake-split-grid">
        {/* Left Column: AI Assistant Orb & Profile Context */}
        <div className="intake-sidebar card-surface">
          <div className="orb-display-card">
            <ParticlesOrb
              state={orbState}
              size={160}
              speed={1}
              colorFrom="#6366f1"
              colorTo="#a855f7"
              label="NeuroNova Assistant Orb"
            />
            <div className="orb-status-row">
              <span className="orb-status-indicator" />
              <OrbStatus state={orbState} className="orb-status-text" />
            </div>
          </div>

          <div className="sidebar-heading">
            <HiSparkles />
            <h4>Extracted Profile</h4>
          </div>

          <div className="profile-context-item">
            <span className="ctx-label">Target Objective</span>
            <strong className="ctx-value">{profile.goal || 'Not specified yet'}</strong>
          </div>

          <div className="profile-context-row">
            <div className="profile-context-item">
              <span className="ctx-label"><HiAcademicCap /> Level</span>
              <span className="ctx-tag">{profile.experienceLevel || 'Intermediate'}</span>
            </div>

            <div className="profile-context-item">
              <span className="ctx-label"><HiClock /> Commitment</span>
              <span className="ctx-tag">{profile.weeklyHours || 6} hrs / wk</span>
            </div>
          </div>

          <div className="profile-context-item">
            <span className="ctx-label">Focus Topics</span>
            <div className="ctx-tags-wrap">
              {(profile.interests || ['Tech Foundations']).map((tag, i) => (
                <span key={i} className="ctx-chip">{tag}</span>
              ))}
            </div>
          </div>

          {profile.goal && (
            <div className="sidebar-cta">
              <button className="btn-primary btn-block" onClick={onGenerateRoadmap} disabled={isGenerating}>
                {isGenerating ? (
                  <><HiArrowPath className="spin-icon" /> Generating Roadmap...</>
                ) : (
                  <><HiSparkles /> Generate Path Roadmap <HiArrowRight /></>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Right Column: Clean Chat Workspace */}
        <div className="chat-container card-surface">
          <div className="messages-scroll">
            {messages.map((msg, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.16 }}
                className={`message-bubble ${msg.role === 'user' ? 'user-bubble' : 'ai-bubble'}`}
              >
                <div className="avatar-icon">
                  {msg.role === 'user' ? <HiUser /> : <HiSparkles />}
                </div>
                <div className="bubble-content">
                  <div className="bubble-top-bar">
                    <span className="sender-label">{msg.role === 'user' ? 'You' : 'NeuroNova AI Advisor'}</span>
                    <button className="btn-copy-msg" onClick={() => copyMessage(msg.content, idx)} title="Copy message">
                      <HiDocumentDuplicate /> {copiedIdx === idx ? 'Copied' : ''}
                    </button>
                  </div>
                  <p>{msg.content}</p>
                </div>
              </motion.div>
            ))}

            {sending && (
              <div className="message-bubble ai-bubble loading-bubble">
                <div className="avatar-icon"><HiSparkles /></div>
                <div className="bubble-content">
                  <span className="sender-label">NeuroNova AI Advisor</span>
                  <div className="typing-indicator">
                    <span /><span /><span />
                  </div>
                </div>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {messages.length <= 2 && (
            <div className="quick-prompts-bar">
              <span className="quick-label"><HiBolt /> Quick Inspiration:</span>
              <div className="prompts-grid">
                {QUICK_PROMPTS.map((p, i) => (
                  <button key={i} className="prompt-chip" onClick={() => handleSend(p)}>
                    {p}
                  </button>
                ))}
              </div>
            </div>
          )}

          <form className="chat-input-row" onSubmit={(e) => { e.preventDefault(); handleSend(); }}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="e.g. I want to learn React, Node.js and Gemini AI apps in 6 weeks..."
              disabled={sending || isGenerating}
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
