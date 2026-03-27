import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import styles from './Header.module.css';

interface HeaderProps {
  onSignInClick?: () => void;
}

export function Header({ onSignInClick }: HeaderProps) {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <img src="/WhatsApp_Image_2026-03-18_at_21.42.15.jpeg" alt="IRCA Glowdom" className={styles.logoImage} />
      </div>
      <div className={styles.right}>
        <div className={styles.powered}>Powered by Claude AI · Glowdom Technologies</div>
        {!user && onSignInClick && (
          <button onClick={onSignInClick} className={styles.signInBtn}>
            Sign In
          </button>
        )}
      </div>
    </header>
  );
}
