import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { HiSparkles, HiAcademicCap, HiArrowPath, HiCheckCircle } from 'react-icons/hi2';

export default function ActiveRecall3DCard() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start']
  });

  const cardRotateY = useTransform(scrollYProgress, [0.25, 0.65], [0, 180]);

  return (
    <div ref={ref} className="narrative-section active-recall-section">
      <div className="section-sticky-content">
        <div className="text-center narrative-header">
          <span className="badge-pill"><HiSparkles /> STEP 4: ACTIVE RECALL ENGINE</span>
          <h2 className="narrative-title">3D Active Recall & Long-Term Memory</h2>
          <p className="narrative-desc">Convert study notes or generated path modules into 3D flashcards designed for maximum long-term memory retention.</p>
        </div>

        <div className="active-recall-scene">
          <div className="narrative-flow-pills">
            <span className="flow-pill">LEARN</span>
            <HiArrowPath className="flow-arrow" />
            <span className="flow-pill active">RECALL</span>
            <HiArrowPath className="flow-arrow" />
            <span className="flow-pill emerald">RETAIN</span>
          </div>

          <div className="flashcard-3d-scene-wrap">
            <motion.div
              style={{ rotateY: cardRotateY }}
              className="flashcard-3d-card-inner card-surface glow-border"
            >
              {/* Question Side (Front) */}
              <div className="card-face-front-3d">
                <div className="face-header-row">
                  <span className="badge-cat"><HiAcademicCap /> ACTIVE RECALL QUESTION</span>
                  <span className="font-mono text-muted">Card 1 of 8</span>
                </div>
                <h3>What is Redis and why is it used in high-concurrency applications?</h3>
                <p className="flip-hint-text"><HiArrowPath /> Scroll down to flip card and verify answer</p>
              </div>

              {/* Answer Side (Back) */}
              <div className="card-face-back-3d">
                <div className="face-header-row">
                  <span className="badge-cat emerald"><HiCheckCircle /> VERIFIED AI ANSWER</span>
                  <span className="font-mono text-emerald">100% Retained</span>
                </div>
                <p>
                  Redis is an in-memory data store supporting data structures like strings, hashes, and lists. It is used for sub-millisecond caching, session storage, and rate-limiting.
                </p>
                <div className="answer-footer">
                  <span className="difficulty-badge">Difficulty: Intermediate</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
