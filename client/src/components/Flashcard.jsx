import { motion } from 'framer-motion';
import { HiSparkles, HiArrowPath } from 'react-icons/hi2';

export default function Flashcard({ card, flipped, onFlip }) {
  if (!card) return null;

  return (
    <div className="flashcard-scene" onClick={onFlip}>
      <motion.div
        className="flashcard-3d-card"
        initial={false}
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
      >
        {/* Front Face: Question */}
        <div className="card-face card-face-front">
          <div className="card-face-header">
            <span className="face-tag question-tag"><HiSparkles /> QUESTION</span>
            <span className="flip-hint"><HiArrowPath /> Click to reveal answer</span>
          </div>
          <div className="card-face-body">
            <h3>{card.question}</h3>
          </div>
          <div className="card-face-footer">
            <small>Active Recall Prompt</small>
          </div>
        </div>

        {/* Back Face: Answer */}
        <div className="card-face card-face-back">
          <div className="card-face-header">
            <span className="face-tag answer-tag"><HiSparkles /> ANSWER</span>
            <span className="flip-hint"><HiArrowPath /> Click to see question</span>
          </div>
          <div className="card-face-body">
            <p>{card.answer}</p>
          </div>
          <div className="card-face-footer">
            <small>Core Concept Explanation</small>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
