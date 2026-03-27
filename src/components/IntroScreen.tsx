import styles from './IntroScreen.module.css';
import { DIM_LABELS } from '../data/questions';

interface IntroScreenProps {
  onStart: () => void;
}

export function IntroScreen({ onStart }: IntroScreenProps) {
  return (
    <div className={styles.intro}>
      <div className={styles.eyebrow}>Free Business Diagnostic</div>
      <h1 className={styles.title}>
        Know your<br />
        <em className={styles.highlight}>business health</em><br />
        in 10 questions.
      </h1>
      <p className={styles.description}>
        Answer 10 honest questions about your business. GlowAgent's AI analyses your responses across 6 critical dimensions and gives you a personalised health score, your top 3 gaps, and a 30-day action plan — free.
      </p>
      <div className={styles.dimensions}>
        {Object.values(DIM_LABELS).map((label) => (
          <span key={label} className={styles.dimTag}>{label}</span>
        ))}
      </div>
      <button className={styles.startBtn} onClick={onStart}>
        Start Diagnostic
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
    </div>
  );
}
