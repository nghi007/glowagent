import { useState } from 'react';
import styles from './QuizScreen.module.css';
import { QUESTIONS } from '../data/questions';

interface QuizScreenProps {
  onComplete: (answers: Record<number, number>) => void;
}

export function QuizScreen({ onComplete }: QuizScreenProps) {
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});

  const question = QUESTIONS[currentQ];
  const totalQuestions = QUESTIONS.length;
  const progress = ((currentQ + 1) / totalQuestions) * 100;
  const isLast = currentQ === totalQuestions - 1;

  const handleSelectOption = (optionIndex: number) => {
    setAnswers({ ...answers, [currentQ]: optionIndex });
  };

  const handleNext = () => {
    if (answers[currentQ] === undefined) return;

    if (isLast) {
      onComplete(answers);
    } else {
      setCurrentQ(currentQ + 1);
    }
  };

  const handlePrev = () => {
    if (currentQ > 0) {
      setCurrentQ(currentQ - 1);
    }
  };

  return (
    <div className={styles.quiz}>
      <div className={styles.progressLabel}>
        Question {currentQ + 1} of {totalQuestions}
      </div>
      <div className={styles.progressBarWrap}>
        <div className={styles.progressBarFill} style={{ width: `${progress}%` }} />
      </div>
      <div className={styles.questionNum}>{String(question.id).padStart(2, '0')}</div>
      <div className={styles.dimensionLabel}>{question.dim}</div>
      <div className={styles.questionText}>{question.text}</div>
      <div className={styles.optionsGrid}>
        {question.options.map((option, index) => (
          <button
            key={option.letter}
            className={`${styles.optionBtn} ${answers[currentQ] === index ? styles.selected : ''}`}
            onClick={() => handleSelectOption(index)}
          >
            <div className={styles.optLetter}>{option.letter}</div>
            <div>{option.text}</div>
          </button>
        ))}
      </div>
      <div className={styles.navRow}>
        <button
          className={styles.navBtn}
          onClick={handlePrev}
          disabled={currentQ === 0}
        >
          ← Back
        </button>
        <button
          className={`${styles.navBtn} ${styles.primary}`}
          onClick={handleNext}
        >
          {isLast ? 'See My Results →' : 'Next →'}
        </button>
      </div>
    </div>
  );
}
