import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import styles from './Header.module.css';

interface HeaderProps {
  onSignInClick?: () => void;
}

export function Header({ onSignInClick }: HeaderProps) {
  const [user, setUser] = useState<any>(null);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    const savedMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(savedMode);
    if (savedMode) {
      document.body.classList.add('dark-mode');
    }

    return () => subscription.unsubscribe();
  }, []);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('darkMode', String(newMode));
    document.body.classList.toggle('dark-mode', newMode);
  };

  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <img src="/WhatsApp_Image_2026-03-18_at_21.42.15.jpeg" alt="IRCA Glowdom" className={styles.logoImage} />
      </div>
      <div className={styles.right}>
        <button
          onClick={toggleDarkMode}
          className={styles.themeBtn}
          aria-label="Toggle dark mode"
          title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {darkMode ? '☀️' : '🌙'}
        </button>
        {!user && onSignInClick && (
          <button onClick={onSignInClick} className={styles.signInBtn}>
            Sign In
          </button>
        )}
      </div>
    </header>
  );
}
