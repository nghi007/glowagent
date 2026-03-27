import { useEffect, useState } from 'react';
import styles from './ResultsScreen.module.css';
import { type AnalysisResult, getTierDescription, getTierLabel } from '../utils/analysis';
import { DIM_LABELS } from '../data/questions';

interface ResultsScreenProps {
  result: AnalysisResult;
  onRestart: () => void;
}

export function ResultsScreen({ result, onRestart }: ResultsScreenProps) {
  const [scoreCount, setScoreCount] = useState(0);
  const tierLabel = getTierLabel(result.tier);
  const tierDesc = getTierDescription(result.tier);

  useEffect(() => {
    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        setScoreCount((prev) => {
          if (prev >= result.overallScore) {
            clearInterval(interval);
            return result.overallScore;
          }
          return Math.min(prev + 2, result.overallScore);
        });
      }, 20);

      return () => clearInterval(interval);
    }, 100);

    return () => clearTimeout(timer);
  }, [result.overallScore]);

  const circumference = 314;
  const offset = circumference - (result.overallScore / 100) * circumference;

  const sortedDims = Object.entries(result.dimensionScores).sort((a, b) => b[1] - a[1]);

  return (
    <div className={styles.results}>
      <div className={styles.header}>
        <div className={styles.eyebrow}>Your Business Health Report</div>
        <h1 className={styles.title}>
          Here's where<br />
          <em className={styles.highlight}>you stand.</em>
        </h1>
        <p className={styles.subtitle}>{tierDesc}</p>
      </div>

      <div className={styles.scoreSection}>
        <div className={styles.scoreCircle}>
          <svg width="120" height="120" viewBox="0 0 120 120" style={{ transform: 'rotate(-90deg)' }}>
            <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="8" />
            <circle
              cx="60"
              cy="60"
              r="50"
              fill="none"
              stroke="#f57547"
              strokeWidth="8"
              strokeDasharray="314"
              strokeDashoffset={offset}
              strokeLinecap="round"
              style={{ transition: 'stroke-dashoffset 1.2s ease 0.3s' }}
            />
          </svg>
          <div className={styles.scoreNumber}>
            <div className={styles.scoreValue}>{scoreCount}</div>
            <span>/100</span>
          </div>
        </div>
        <div className={styles.scoreInfo}>
          <h2>{tierLabel.title}</h2>
          <p>{tierLabel.description}</p>
        </div>
      </div>

      <div className={styles.dimensionsSection}>
        <div className={styles.sectionTitle}>Score by Dimension</div>
        <div className={styles.dimBars}>
          {sortedDims.map(([key, score]) => {
            const barClass = score >= 70 ? styles.high : score >= 45 ? styles.midScore : styles.low;
            return (
              <div key={key} className={styles.dimBarItem}>
                <div className={styles.dimName}>{DIM_LABELS[key]}</div>
                <div className={styles.barTrack}>
                  <div className={`${styles.barFill} ${barClass}`} style={{ width: `${score}%` }} />
                </div>
                <div className={styles.dimScore}>{score}</div>
              </div>
            );
          })}
        </div>
      </div>

      <div className={styles.analysisSection}>
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div className={styles.cardIcon}>⚠️</div>
            <div className={styles.cardTitle}>Your Top 3 Priority Gaps</div>
          </div>
          <div className={styles.cardContent}>
            {result.topGaps.map((gap, i) => (
              <div key={i} className={styles.gapItem}>
                <strong>
                  {gap.dimension} — {gap.score}/100
                </strong>
                <br />
                <span>{gap.insight}</span>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div className={styles.cardIcon}>🎯</div>
            <div className={styles.cardTitle}>Your 30-Day Action Plan</div>
          </div>
          <div className={styles.cardContent}>
            <p className={styles.actionIntro}>
              Based on your profile, here are the highest-impact actions to take in the next 30 days:
            </p>
            <ul className={styles.actionList}>
              {result.actionPlan.map((action, i) => (
                <li key={i}>
                  <div className={styles.actionNum}>{i + 1}</div>
                  <div>{action}</div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div className={styles.cardIcon}>💪</div>
            <div className={styles.cardTitle}>Your Business Strengths</div>
          </div>
          <div className={styles.cardContent}>
            {result.strengths.map((strength, i) => (
              <div key={i} className={styles.strengthItem}>
                <strong>
                  {strength.dimension} ({strength.score}/100)
                </strong>{' '}
                — {strength.insight}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.cta}>
        <h2 className={styles.ctaTitle}>Ready to fix what's holding you back?</h2>
        <p className={styles.ctaSub}>
          Unlock GlowAgent's full suite — proposal writing, financial projections, compliance guidance and more.
        </p>
        <button className={styles.ctaBtn}>Unlock Full GlowAgent — from NAD 299/mo</button>
        <br />
        <button className={styles.restartLink} onClick={onRestart}>
          ← Retake diagnostic
        </button>
      </div>
    </div>
  );
}
