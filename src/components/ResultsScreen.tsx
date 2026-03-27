import { useEffect, useState, useRef } from 'react';
import styles from './ResultsScreen.module.css';
import { type AnalysisResult, getTierDescription, getTierLabel } from '../utils/analysis';
import { DIM_LABELS } from '../data/questions';
import { exportToPDF } from '../utils/pdfExport';

interface ResultsScreenProps {
  result: AnalysisResult;
  onRestart: () => void;
}

export function ResultsScreen({ result, onRestart }: ResultsScreenProps) {
  const [scoreCount, setScoreCount] = useState(0);
  const reportRef = useRef<HTMLDivElement>(null);
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

  const handleExportPDF = async () => {
    if (!reportRef.current) return;
    try {
      await exportToPDF(reportRef.current, result);
    } catch (error) {
      console.error('Failed to export PDF:', error);
      alert('Failed to export PDF. Please try again.');
    }
  };

  return (
    <div className={styles.results} ref={reportRef}>
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

      <div className={styles.chartsSection}>
        <div className={styles.sectionTitle}>Visual Breakdown</div>
        <div className={styles.chartsGrid}>
          <div className={styles.chartCard}>
            <h3 className={styles.chartTitle}>Radar Chart</h3>
            <svg viewBox="0 0 200 200" className={styles.radarChart}>
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <circle cx="20" cy="20" r="1" fill="rgba(255,255,255,0.1)" />
                </pattern>
              </defs>

              {[0, 1, 2, 3, 4].map((level) => {
                const radius = 20 + level * 16;
                const points = Object.keys(result.dimensionScores).map((_, i) => {
                  const angle = (i * 2 * Math.PI) / 6 - Math.PI / 2;
                  const x = 100 + radius * Math.cos(angle);
                  const y = 100 + radius * Math.sin(angle);
                  return `${x},${y}`;
                }).join(' ');
                return (
                  <polygon
                    key={level}
                    points={points}
                    fill="none"
                    stroke="rgba(255,255,255,0.1)"
                    strokeWidth="0.5"
                  />
                );
              })}

              {Object.keys(result.dimensionScores).map((_, i) => {
                const angle = (i * 2 * Math.PI) / 6 - Math.PI / 2;
                const x2 = 100 + 100 * Math.cos(angle);
                const y2 = 100 + 100 * Math.sin(angle);
                return (
                  <line
                    key={i}
                    x1="100"
                    y1="100"
                    x2={x2}
                    y2={y2}
                    stroke="rgba(255,255,255,0.1)"
                    strokeWidth="0.5"
                  />
                );
              })}

              <polygon
                points={Object.entries(result.dimensionScores).map(([_, score], i) => {
                  const angle = (i * 2 * Math.PI) / 6 - Math.PI / 2;
                  const radius = 20 + (score / 100) * 80;
                  const x = 100 + radius * Math.cos(angle);
                  const y = 100 + radius * Math.sin(angle);
                  return `${x},${y}`;
                }).join(' ')}
                fill="rgba(245, 117, 71, 0.3)"
                stroke="#f57547"
                strokeWidth="2"
              />

              {Object.entries(result.dimensionScores).map(([key, score], i) => {
                const angle = (i * 2 * Math.PI) / 6 - Math.PI / 2;
                const labelRadius = 110;
                const x = 100 + labelRadius * Math.cos(angle);
                const y = 100 + labelRadius * Math.sin(angle);
                return (
                  <text
                    key={key}
                    x={x}
                    y={y}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="rgba(255,255,255,0.7)"
                    fontSize="10"
                    fontWeight="500"
                  >
                    {DIM_LABELS[key]}
                  </text>
                );
              })}
            </svg>
          </div>

          <div className={styles.chartCard}>
            <h3 className={styles.chartTitle}>Comparison to Benchmarks</h3>
            <div className={styles.benchmarkChart}>
              {sortedDims.slice(0, 3).map(([key, score]) => {
                const avgScore = 55;
                const topScore = 85;
                return (
                  <div key={key} className={styles.benchmarkItem}>
                    <div className={styles.benchmarkLabel}>{DIM_LABELS[key]}</div>
                    <div className={styles.benchmarkBars}>
                      <div className={styles.benchmarkRow}>
                        <span className={styles.benchmarkRowLabel}>You</span>
                        <div className={styles.benchmarkBarTrack}>
                          <div
                            className={styles.benchmarkBarYou}
                            style={{ width: `${score}%` }}
                          >
                            <span className={styles.benchmarkValue}>{score}</span>
                          </div>
                        </div>
                      </div>
                      <div className={styles.benchmarkRow}>
                        <span className={styles.benchmarkRowLabel}>Avg</span>
                        <div className={styles.benchmarkBarTrack}>
                          <div
                            className={styles.benchmarkBarAvg}
                            style={{ width: `${avgScore}%` }}
                          >
                            <span className={styles.benchmarkValue}>{avgScore}</span>
                          </div>
                        </div>
                      </div>
                      <div className={styles.benchmarkRow}>
                        <span className={styles.benchmarkRowLabel}>Top</span>
                        <div className={styles.benchmarkBarTrack}>
                          <div
                            className={styles.benchmarkBarTop}
                            style={{ width: `${topScore}%` }}
                          >
                            <span className={styles.benchmarkValue}>{topScore}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
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
        <div className={styles.ctaBtnGroup}>
          <button className={styles.ctaBtn}>Unlock Full GlowAgent — from NAD 299/mo</button>
          <button
            className={styles.exportBtn}
            onClick={handleExportPDF}
          >
            📥 Print / Save as PDF
          </button>
        </div>
        <br />
        <button className={styles.restartLink} onClick={onRestart}>
          ← Retake diagnostic
        </button>
      </div>
    </div>
  );
}
