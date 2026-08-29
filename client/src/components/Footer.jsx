import { HiSparkles } from 'react-icons/hi2';

export default function Footer() {
  return (
    <footer className="footer shell">
      <div className="footer-brand">
        <span className="brand-logo compact"><HiSparkles /></span>
        <strong>NeuroNova</strong>
        <span>Personalized Learning Path Recommender</span>
      </div>
      <div className="footer-copy">
        <span>© {new Date().getFullYear()} NeuroNova AI. Designed with intention for lifelong learners.</span>
      </div>
    </footer>
  );
}
