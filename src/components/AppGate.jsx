
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import Auth from './Auth';
import App from '../App';

export default function AppGate() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(({ data, error }) => {
      if (!mounted) return;

      if (error) {
        console.error('Session error:', error.message);
      }

      setSession(data?.session ?? null);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (mounted) {
        setSession(session);
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        background: '#fff9fc',
        color: '#98627d',
        fontFamily: 'Arial, sans-serif',
      }}>
        Loading AMIDA CARE...
      </div>
    );
  }

  return session ? <App /> : <Auth />;
}
