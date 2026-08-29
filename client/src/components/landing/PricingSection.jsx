import { HiCheckCircle, HiArrowRight } from 'react-icons/hi2';
import { SignUpButton } from '@clerk/clerk-react';

export default function PricingSection() {
  return (
    <section id="pricing" className="landing-section pricing-section">
      <div className="section-header text-center">
        <span className="badge-pill">YOUR PATH STARTS HERE</span>
        <h2>Simple, transparent pricing</h2>
        <p>Start free, upgrade as you master new skills.</p>
      </div>

      <div className="pricing-grid">
        <div className="price-card card-surface">
          <div className="tier-header">
            <h3>Free Learner</h3>
            <p>For individuals starting out</p>
            <div className="price-amount">$0 <span>/ month</span></div>
          </div>
          <ul className="tier-features">
            <li><HiCheckCircle className="emerald" /> Up to 3 Active Learning Paths</li>
            <li><HiCheckCircle className="emerald" /> Unlimited AI Conversational Intake</li>
            <li><HiCheckCircle className="emerald" /> Kanban & Timeline Roadmap Views</li>
            <li><HiCheckCircle className="emerald" /> 3D Active Recall Flashcards</li>
          </ul>
          <SignUpButton mode="modal">
            <button className="btn-secondary btn-block">Get Started Free</button>
          </SignUpButton>
        </div>

        <div className="price-card card-surface featured glow-border">
          <div className="popular-tag">MOST POPULAR</div>
          <div className="tier-header">
            <h3>Pro Engineer</h3>
            <p>For career progression & senior mastery</p>
            <div className="price-amount">$19 <span>/ month</span></div>
          </div>
          <ul className="tier-features">
            <li><HiCheckCircle className="emerald" /> Unlimited Custom AI Paths</li>
            <li><HiCheckCircle className="emerald" /> Priority Gemini 2.5 Model Generation</li>
            <li><HiCheckCircle className="emerald" /> PDF & Multi-Format Ingestion Studio</li>
            <li><HiCheckCircle className="emerald" /> Direct AI Mentor Q&A Chat</li>
            <li><HiCheckCircle className="emerald" /> SQLite Cloud Synchronization</li>
          </ul>
          <SignUpButton mode="modal">
            <button className="btn-primary btn-block">Start 14-Day Free Trial <HiArrowRight /></button>
          </SignUpButton>
        </div>
      </div>
    </section>
  );
}
