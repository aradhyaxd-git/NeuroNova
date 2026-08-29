import { motion } from 'framer-motion';
import { HiSparkles, HiArrowRight, HiBolt } from 'react-icons/hi2';
import { SignUpButton } from '@clerk/clerk-react';

export default function FinalCtaVisual({ onExploreDemo }) {
  return (
    <section className="narrative-section final-cta-section card-surface glow-border text-center">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ duration: 0.25 }}>
        <div className="final-orb-glow-backdrop" />
        <span className="badge-pill"><HiSparkles /> CONVERGENCE</span>
        <h2 className="final-cta-title">Your next skill is closer than you think.</h2>
        <p className="final-cta-subtext">Stop figuring out what to learn next. Let NeuroNova construct your personalized 3D learning path today.</p>

        <div className="hero-cta-group justify-center margin-top-20">
          <SignUpButton mode="modal">
            <button className="btn-primary btn-lg">
              <HiBolt /> Build My Learning Path <HiArrowRight />
            </button>
          </SignUpButton>

          <button className="btn-secondary btn-lg" onClick={onExploreDemo}>
            <HiSparkles /> Launch Interactive Demo
          </button>
        </div>
      </motion.div>
    </section>
  );
}
