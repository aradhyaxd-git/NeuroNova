import { useRef } from 'react';
import { motion, useScroll } from 'framer-motion';
import { HiSparkles, HiArrowRight, HiShieldCheck, HiCheckCircle, HiArrowUp } from 'react-icons/hi2';
import { SignUpButton } from '@clerk/clerk-react';
import logoPng from '../../assets/logo.png';

import ScrollNavbar from './ScrollNavbar';
import Hero3DCanvas from './Hero3DCanvas';
import ProblemChaosVisual from './ProblemChaosVisual';
import MeetAiCoreVisual from './MeetAiCoreVisual';
import SkillGraph3DVisual from './SkillGraph3DVisual';
import WorkspaceTransitionVisual from './WorkspaceTransitionVisual';
import ActiveRecall3DCard from './ActiveRecall3DCard';
import AdaptiveLearningVisual from './AdaptiveLearningVisual';
import WhyNeuroNovaVisual from './WhyNeuroNovaVisual';
import SocialProofSection from './SocialProofSection';
import PricingSection from './PricingSection';
import FinalCtaVisual from './FinalCtaVisual';

export default function LandingPage({ onExploreDemo, dark, onToggleTheme }) {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end']
  });

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div ref={containerRef} className="landing-narrative-container">
      {/* Background Ambient Mesh Grid & Side Glow Orbs */}
      <div className="ambient-background-mesh" />
      <div className="side-glow-orb orb-left" />
      <div className="side-glow-orb orb-right" />

      {/* Scroll-Reactive Floating Capsule Navbar with Theme Toggle */}
      <ScrollNavbar dark={dark} onToggleTheme={onToggleTheme} />

      {/* 1. RECOMPOSED DENSE HERO COMPOSITION */}
      <section className="landing-hero-narrative text-center">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.18 }}
          className="hero-copy-block"
        >
          <span className="badge-pill">
            <HiSparkles /> Powered by Gemini 2.5 & WebGL Neural Engine
          </span>

          <h1 className="hero-headline">
            Stop figuring out <span className="text-gradient">what to learn next.</span>
          </h1>

          <p className="hero-subtext">
            NeuroNova turns your goals, experience, and available time into an intelligent learning path that adapts as you grow.
          </p>

          <div className="hero-cta-group justify-center">
            <SignUpButton mode="modal">
              <button className="btn-vibrant-primary btn-lg">
                <HiSparkles /> Build My Learning Path <HiArrowRight />
              </button>
            </SignUpButton>

            <button className="btn-secondary btn-lg" onClick={onExploreDemo}>
              <HiSparkles /> Explore Interactive Studio Demo
            </button>
          </div>

          <div className="hero-social-proof justify-center">
            <span className="proof-item"><HiShieldCheck className="emerald" /> No Credit Card Required</span>
            <span className="proof-item"><HiCheckCircle className="emerald" /> 100% Free Starter Tier</span>
            <span className="proof-item"><HiSparkles className="purple" /> Instant 3D Path Generation</span>
          </div>
        </motion.div>

        {/* 3D Learning Universe */}
        <Hero3DCanvas scrollProgress={scrollYProgress.get ? scrollYProgress.get() : 0} />
      </section>

      {/* CONTINUOUS CONNECTED SCROLL NARRATIVE EXPERIENCE */}
      <div id="narrative" className="continuous-narrative-flow">
        {/* 2. THE PROBLEM — CHAOS */}
        <ProblemChaosVisual />

        {/* 3 & 4. MEET THE AI & PERSONALIZATION */}
        <MeetAiCoreVisual />

        {/* 5. AI-GENERATED LEARNING PATH (3D SKILL GRAPH) */}
        <SkillGraph3DVisual />

        {/* 6. INTERACTIVE WORKSPACE */}
        <WorkspaceTransitionVisual />

        {/* 7. ACTIVE RECALL (3D FLASHCARDS) */}
        <ActiveRecall3DCard />

        {/* 8. ADAPTIVE LEARNING */}
        <AdaptiveLearningVisual />

        {/* 9. WHY NEURONOVA (6 CAPABILITY PILLARS) */}
        <div id="features">
          <WhyNeuroNovaVisual />
        </div>

        {/* 10. SOCIAL PROOF */}
        <SocialProofSection />

        {/* 11. PRICING */}
        <PricingSection />

        {/* 12. FINAL CTA */}
        <FinalCtaVisual onExploreDemo={onExploreDemo} />
      </div>

      {/* Interactive Micro-Polished Footer */}
      <footer className="landing-footer card-surface glow-border">
        <div className="footer-brand">
          <motion.img
            whileHover={{ rotate: 15, scale: 1.1 }}
            src={logoPng}
            alt="NeuroNova"
            className="dock-logo-img"
          />
          <span><strong>NeuroNova AI Inc.</strong> — Intelligent Personalized Learning Studio</span>
        </div>

        <div className="footer-actions">
          <small>© 2026 NeuroNova Inc. All rights reserved.</small>
          <motion.button
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.95 }}
            onClick={scrollToTop}
            className="back-to-top-btn btn-secondary btn-sm"
          >
            Back to Top <HiArrowUp />
          </motion.button>
        </div>
      </footer>
    </div>
  );
}
