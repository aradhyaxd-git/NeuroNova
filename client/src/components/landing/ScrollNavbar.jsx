import { useState, useEffect } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { HiArrowRight, HiSparkles } from 'react-icons/hi2';
import { SignInButton, SignUpButton } from '@clerk/clerk-react';
import logoPng from '../../assets/logo.png';
import ThemeToggle from '../ThemeToggle';

export default function ScrollNavbar({ dark, onToggleTheme }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className={`sticky-navbar-wrapper ${isScrolled ? 'scrolled' : ''}`}>
      <motion.nav
        layout
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className={`landing-navbar ${isScrolled ? 'floating-capsule card-surface glow-border' : 'card-surface'}`}
      >
        <div className="nav-brand">
          <img src={logoPng} alt="NeuroNova Logo" className="nav-logo-img" />
          <span className="brand-name">NeuroNova</span>
          <span className="brand-tag font-mono">STUDIO AI</span>
        </div>

        <div className="nav-links font-mono">
          <a href="#narrative">Story Journey</a>
          <a href="#features">Capabilities</a>
          <a href="#pricing">Pricing</a>
        </div>

        <div className="nav-auth-actions">
          {/* Dark / Light Mode Toggle */}
          <ThemeToggle dark={dark} onToggle={onToggleTheme} />

          <SignInButton mode="modal">
            <button className="btn-secondary btn-sm navbar-signin-btn">
              Sign In
            </button>
          </SignInButton>

          <SignUpButton mode="modal">
            <button className="btn-vibrant-primary btn-sm navbar-getstarted-btn">
              <HiSparkles className="pulse-sparkle" /> Get Started Free <HiArrowRight />
            </button>
          </SignUpButton>
        </div>

        {/* Scroll Progress Line */}
        {isScrolled && (
          <motion.div className="navbar-progress-bar" style={{ scaleX }} />
        )}
      </motion.nav>
    </div>
  );
}
