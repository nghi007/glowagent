import { useEffect, useState } from 'react';
import { supabase, type DiagnosticResult } from '../lib/supabase';
import { DIM_LABELS } from '../data/questions';
import styles from './Dashboard.module.css';

interface DashboardProps {
  user: any;
  onSignOut: () => void;
  onStartNew: () => void;
}

export function Dashboard({ user, onSignOut, onStartNew }: DashboardProps) {
  const [results, setResults] = useState<DiagnosticResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResults();
  }, [user]);

  const fetchResults = async () => {
    try {
      const { data, error } = await supabase
        .from('diagnostic_results')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setResults(data || []);
    } catch (err) {
      console.error('Error fetching results:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    onSignOut();
  };

  if (loading) {
    return (
      <div className={styles.dashboard}>
        <div className={styles.loading}>Loading your results...</div>
      </div>
    );
  }

  return (
    <div className={styles.dashboard}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Your Dashboard</h1>
          <p className={styles.subtitle}>Welcome back, {user.email}</p>
        </div>
        <button onClick={handleSignOut} className={styles.signOutBtn}>
          Sign Out
        </button>
      </div>

      <div className={styles.actions}>
        <button onClick={onStartNew} className={styles.newBtn}>
          Take New Diagnostic
        </button>
      </div>

      {results.length === 0 ? (
        <div className={styles.empty}>
          <p>You haven't taken any diagnostics yet.</p>
          <button onClick={onStartNew} className={styles.emptyBtn}>
            Take Your First Diagnostic
          </button>
        </div>
      ) : (
        <div className={styles.resultsList}>
          <h2 className={styles.resultsTitle}>Your Past Diagnostics</h2>
          {results.map((result) => (
            <div key={result.id} className={styles.resultCard}>
              <div className={styles.resultHeader}>
                <div className={styles.resultScore}>
                  <span className={styles.scoreValue}>{result.overall_score}</span>
                  <span className={styles.scoreLabel}>/100</span>
                </div>
                <div className={styles.resultMeta}>
                  <div className={styles.resultDate}>
                    {new Date(result.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </div>
                  <div className={styles.resultTier}>
                    {result.overall_score >= 70
                      ? 'Strong Foundation'
                      : result.overall_score >= 45
                      ? 'Promising but Patchy'
                      : 'Early Stage'}
                  </div>
                </div>
              </div>
              <div className={styles.dimensionsPreview}>
                {Object.entries(result.dimension_scores as Record<string, number>)
                  .sort((a, b) => b[1] - a[1])
                  .slice(0, 3)
                  .map(([key, score]) => (
                    <div key={key} className={styles.dimPreview}>
                      <span className={styles.dimLabel}>{DIM_LABELS[key]}</span>
                      <span className={styles.dimValue}>{score}</span>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
