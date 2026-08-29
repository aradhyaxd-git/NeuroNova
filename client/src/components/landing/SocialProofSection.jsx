import { HiCheckCircle, HiStar } from 'react-icons/hi2';

export default function SocialProofSection() {
  const testimonials = [
    { name: 'Alex Rivera', role: 'Staff Engineer @ Vercel', text: 'NeuroNova stripped away 6 months of redundant tutorial noise. The prerequisite skill graph is brilliant.', metrics: 'Mastered System Design in 8 Weeks' },
    { name: 'Elena Rostova', role: 'AI Researcher @ Anthropic', text: 'The 3D active recall decks integrated directly with Gemini 2.5 make technical retention almost effortless.', metrics: '100% Active Recall Score' }
  ];

  return (
    <section className="landing-section social-proof-section">
      <div className="section-header text-center">
        <span className="badge-pill"><HiCheckCircle /> VERIFIED LEARNER OUTCOMES</span>
        <h2>Built for ambitious engineers & lifelong learners</h2>
      </div>

      <div className="testimonials-grid">
        {testimonials.map((t, idx) => (
          <div key={idx} className="testimonial-card card-surface glow-border">
            <div className="stars-row">
              {[...Array(5)].map((_, i) => (
                <HiStar key={i} className="star-icon amber" />
              ))}
            </div>
            <p className="quote-text">"{t.text}"</p>
            <div className="author-row">
              <div>
                <strong>{t.name}</strong>
                <small>{t.role}</small>
              </div>
              <span className="outcome-tag emerald">{t.metrics}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
