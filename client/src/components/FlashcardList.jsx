import { useEffect, useState } from 'react';
import { HiChevronLeft, HiChevronRight, HiSparkles } from 'react-icons/hi2';
import Flashcard from './Flashcard';

export default function FlashcardList({ cards = [], flashcards = [] }) {
  const activeCards = (cards && cards.length > 0) ? cards : (flashcards || []);
  const [current, setCurrent] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const changeCard = (next) => {
    if (!activeCards.length) return;
    setCurrent((next + activeCards.length) % activeCards.length);
    setFlipped(false);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.matches('textarea, input, button, select')) return;
      if (e.key === 'ArrowLeft') changeCard(current - 1);
      if (e.key === 'ArrowRight') changeCard(current + 1);
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        setFlipped(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [current, activeCards.length]);

  if (!activeCards.length) {
    return (
      <div className="empty-state text-center p-8">
        <HiSparkles className="empty-icon" />
        <p>No active recall flashcards generated for this module yet.</p>
      </div>
    );
  }

  return (
    <div className="deck-container">
      <div className="deck-header">
        <div>
          <span className="deck-eyebrow">ACTIVE RECALL MODE</span>
          <h3>Module Flashcard Deck</h3>
        </div>
        <span className="deck-counter-badge">Card {current + 1} of {activeCards.length}</span>
      </div>

      <Flashcard
        card={activeCards[current]}
        flipped={flipped}
        onFlip={() => setFlipped(!flipped)}
      />

      <div className="deck-controls">
        <button
          className="btn-control"
          onClick={() => changeCard(current - 1)}
          aria-label="Previous flashcard"
        >
          <HiChevronLeft /> Prev
        </button>

        <div className="progress-bar-wrap">
          <div className="progress-track-custom">
            <div
              className="progress-fill-custom"
              style={{ width: `${((current + 1) / activeCards.length) * 100}%` }}
            />
          </div>
        </div>

        <button
          className="btn-control"
          onClick={() => changeCard(current + 1)}
          aria-label="Next flashcard"
        >
          Next <HiChevronRight />
        </button>
      </div>

      <p className="keyboard-hint">
        Use <kbd>←</kbd> <kbd>→</kbd> to navigate · <kbd>Space</kbd> to flip card
      </p>
    </div>
  );
}
