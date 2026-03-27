import { useEffect, useState } from 'react';
import styles from './LoadingScreen.module.css';

const LOADING_STEPS = [
  'Scoring 6 business dimensions',
  'Identifying critical gaps',
  'Generating 30-day action plan',
  'Preparing your report'
];

export function LoadingScreen() {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep((prev) => {
        if (prev < LOADING_STEPS.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 900);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className={styles.loading}>
      <div className={styles.pulseRing}>
        <div className={styles.pulseDot} />
      </div>
      <div className={styles.title}>Analysing your business...</div>
      <div className={styles.subtitle}>GlowAgent is generating your personalised health report</div>
      <div className={styles.steps}>
        {LOADING_STEPS.map((step, index) => (
          <div
            key={step}
            className={`${styles.step} ${index < activeStep ? styles.done : index === activeStep ? styles.active : ''}`}
          >
            <div className={styles.stepDot} />
            <div>{step}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
