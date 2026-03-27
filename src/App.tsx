import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { IntroScreen } from './components/IntroScreen';
import { QuizScreen } from './components/QuizScreen';
import { LoadingScreen } from './components/LoadingScreen';
import { ResultsScreen } from './components/ResultsScreen';
import { Dashboard } from './components/Dashboard';
import { AuthForm } from './components/AuthForm';
import { analyzeResults, type AnalysisResult } from './utils/analysis';
import { supabase } from './lib/supabase';
import './App.css';

type Screen = 'intro' | 'quiz' | 'loading' | 'results' | 'dashboard';

function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('intro');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [user, setUser] = useState<any>(null);
  const [showAuth, setShowAuth] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        setCurrentScreen('dashboard');
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleStartQuiz = () => {
    setCurrentScreen('quiz');
  };

  const handleQuizComplete = async (answers: Record<number, number>) => {
    setCurrentScreen('loading');

    const result = analyzeResults(answers);

    setTimeout(async () => {
      setAnalysisResult(result);
      setCurrentScreen('results');

      try {
        const { error } = await supabase.from('diagnostic_results').insert({
          user_id: user?.id || null,
          overall_score: result.overallScore,
          dimension_scores: result.dimensionScores,
          answers,
          top_gaps: result.topGaps,
          action_plan: result.actionPlan,
        });

        if (error) {
          console.error('Error saving diagnostic result:', error);
        }
      } catch (err) {
        console.error('Failed to save results:', err);
      }
    }, 4200);
  };

  const handleRestart = () => {
    setCurrentScreen('intro');
    setAnalysisResult(null);
  };

  const handleAuthSuccess = () => {
    setShowAuth(false);
    setCurrentScreen('dashboard');
  };

  const handleSignOut = () => {
    setCurrentScreen('intro');
  };

  return (
    <>
      <Header onSignInClick={() => setShowAuth(true)} />
      <main style={{ maxWidth: '760px', margin: '0 auto', padding: '48px 24px 80px' }}>
        {currentScreen === 'intro' && <IntroScreen onStart={handleStartQuiz} />}
        {currentScreen === 'quiz' && <QuizScreen onComplete={handleQuizComplete} />}
        {currentScreen === 'loading' && <LoadingScreen />}
        {currentScreen === 'results' && analysisResult && (
          <ResultsScreen result={analysisResult} onRestart={handleRestart} />
        )}
        {currentScreen === 'dashboard' && user && (
          <Dashboard user={user} onSignOut={handleSignOut} onStartNew={handleStartQuiz} />
        )}
      </main>
      {showAuth && <AuthForm onSuccess={handleAuthSuccess} onCancel={() => setShowAuth(false)} />}
    </>
  );
}

export default App;
