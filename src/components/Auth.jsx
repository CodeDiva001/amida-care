
import { useState } from 'react';
import { supabase } from '../lib/supabase';

export default function Auth() {
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();

    setMessage('');
    setError('');
    setLoading(true);

    try {
      if (mode === 'signup') {
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
        });

        if (error) throw error;

        if (data.session) {
          setMessage('Your account has been created successfully!');
        } else {
          setMessage(
            'Account created! Please check your email to verify your account before signing in.'
          );
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

        if (error) throw error;

        setMessage('Welcome back!');
      }
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  async function handlePasswordReset() {
    setMessage('');
    setError('');

    if (!email.trim()) {
      setError('Enter your email address first.');
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(
        email.trim(),
        { redirectTo: window.location.origin }
      );

      if (error) throw error;

      setMessage('Password reset instructions have been sent to your email.');
    } catch (err) {
      setError(err.message || 'Unable to send the reset email.');
    } finally {
      setLoading(false);
    }
  }

  const isSignup = mode === 'signup';

  return (
    <main style={styles.page}>
      <section style={styles.card}>
        <div style={styles.logo}>A</div>

        <p style={styles.brand}>AMIDA CARE</p>

        <h1 style={styles.heading}>
          {isSignup ? 'Create your account' : 'Welcome back'}
        </h1>

        <p style={styles.subtitle}>
          {isSignup
            ? 'Your personal space for faith, wellness and growth.'
            : 'Your journey continues here.'}
        </p>

        <form onSubmit={handleSubmit} style={styles.form}>
          <label style={styles.label}>Email address</label>

          <input
            style={styles.input}
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />

          <label style={styles.label}>Password</label>

          <input
            style={styles.input}
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete={isSignup ? 'new-password' : 'current-password'}
            minLength={6}
            required
          />

          {mode === 'login' && (
            <button
              type="button"
              style={styles.forgot}
              onClick={handlePasswordReset}
              disabled={loading}
            >
              Forgot password?
            </button>
          )}

          {error && <p style={styles.error}>{error}</p>}
          {message && <p style={styles.success}>{message}</p>}

          <button
            type="submit"
            style={styles.submit}
            disabled={loading}
          >
            {loading
              ? 'Please wait...'
              : isSignup
                ? 'Create account'
                : 'Sign in'}
          </button>
        </form>

        <div style={styles.switch}>
          {isSignup
            ? 'Already have an account?'
            : "Don't have an account?"}

          <button
            type="button"
            style={styles.switchButton}
            onClick={() => {
              setMode(isSignup ? 'login' : 'signup');
              setMessage('');
              setError('');
            }}
          >
            {isSignup ? 'Sign in' : 'Create account'}
          </button>
        </div>

        <p style={styles.footer}>
          Nurture your faith. Invest in yourself.
        </p>
      </section>
    </main>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    background: '#fff9fc',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '24px',
    boxSizing: 'border-box',
    fontFamily: 'Arial, sans-serif',
  },

  card: {
    width: '100%',
    maxWidth: '420px',
    background: '#ffffff',
    padding: '36px 28px',
    borderRadius: '24px',
    boxShadow: '0 12px 45px rgba(117,68,94,0.09)',
    boxSizing: 'border-box',
  },

  logo: {
    width: '62px',
    height: '62px',
    borderRadius: '50%',
    background: '#f3dce7',
    color: '#98627d',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '36px',
    fontFamily: 'Georgia, serif',
    margin: '0 auto 12px',
  },

  brand: {
    textAlign: 'center',
    color: '#98627d',
    letterSpacing: '4px',
    fontSize: '12px',
    fontWeight: 'bold',
  },

  heading: {
    textAlign: 'center',
    color: '#75445e',
    fontFamily: 'Georgia, serif',
    fontSize: '27px',
    fontWeight: 'normal',
    marginBottom: '8px',
  },

  subtitle: {
    textAlign: 'center',
    color: '#927c88',
    fontSize: '14px',
    lineHeight: 1.6,
    marginBottom: '30px',
  },

  form: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    width: '100%',
    gap: '8px',
  },

  label: {
    display: 'block',
    width: '100%',
    color: '#75445e',
    fontSize: '13px',
    fontWeight: 'bold',
    marginBottom: '2px',
  },

  input: {
    display: 'block',
    width: '100%',
    minWidth: 0,
    boxSizing: 'border-box',
    padding: '14px',
    border: '1px solid #eadce4',
    borderRadius: '12px',
    background: '#fff9fc',
    color: '#75445e',
    fontSize: '15px',
    margin: '0 0 12px',
    outlineColor: '#c99ab2',
  },

  forgot: {
    display: 'block',
    alignSelf: 'flex-end',
    marginTop: '-8px',
    marginBottom: '12px',
    border: 'none',
    background: 'none',
    color: '#98627d',
    cursor: 'pointer',
    fontSize: '13px',
  },

  submit: {
    display: 'block',
    width: '100%',
    boxSizing: 'border-box',
    padding: '15px',
    border: 'none',
    borderRadius: '12px',
    background: '#98627d',
    color: '#ffffff',
    fontSize: '15px',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginTop: '8px',
  },

  error: {
    color: '#b42318',
    background: '#fff0ee',
    padding: '12px',
    borderRadius: '10px',
    fontSize: '13px',
    width: '100%',
    boxSizing: 'border-box',
  },

  success: {
    color: '#286744',
    background: '#edf8f0',
    padding: '12px',
    borderRadius: '10px',
    fontSize: '13px',
    width: '100%',
    boxSizing: 'border-box',
  },

  switch: {
    textAlign: 'center',
    marginTop: '24px',
    color: '#927c88',
    fontSize: '13px',
  },

  switchButton: {
    border: 'none',
    background: 'none',
    color: '#98627d',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginLeft: '5px',
  },

  footer: {
    textAlign: 'center',
    color: '#b29aa8',
    fontSize: '11px',
    marginTop: '32px',
  },
};
