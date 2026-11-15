import React from 'react';
import { supabase } from '../services/supabase';

interface Props {
  supabase: any;
  onSignIn: (user: any) => void;
}

export const SignInScreen: React.FC<Props> = ({ supabase, onSignIn }) => {
  const [mode, setMode] = React.useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [name, setName] = React.useState('');
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  // Email format validation
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleSignIn = async () => {
    setLoading(true);
    setError(null);

    // Validate email format
    if (!email || !emailPattern.test(email)) {
      setError('Valid email is required (e.g., name@example.com)');
      setLoading(false);
      return;
    }

    // Validate password length
    if (!password || password.length < 8) {
      setError('Password must be at least 8 characters');
      setLoading(false);
      return;
    }

    // For signup, also validate confirm password and require name
    if (mode === 'signup') {
      if (!name || name.trim().length < 2) {
        setError('Full name is required (at least 2 characters)');
        setLoading(false);
        return;
      }
      if (!confirmPassword || confirmPassword !== password) {
        setError('Passwords do not match');
        setLoading(false);
        return;
      }
    }

    try {
      if (mode === 'signin') {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });
        if (error) {
          if (error.message?.includes('Invalid login credentials')) {
            setError('Email or password is incorrect.');
          } else {
            setError(error.message || 'Failed to sign in');
          }
        } else {
          onSignIn(data.user);
        }
      } else {
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            data: {
              name: name.trim(),
            },
          },
        });
        if (error) {
          if (error.message?.includes('User already registered')) {
            setError('An account with this email already exists. Please sign in instead.');
          } else {
            setError(error.message || 'Failed to create account');
          }
        } else {
          onSignIn(data.user);
        }
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    }

    setLoading(false);
  };

  return (
    <div className='min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 flex flex-col transition-colors pb-24 md:pb-12'>
      <div className='flex-1 relative z-10 w-full max-w-md mx-auto p-8'>
        <h2 className='text-2xl font-bold text-slate-900 dark:text-white mb-6 text-center'>{
          mode === 'signin' ? 'Sign In' : 'Create Account'
        }</h2>

        {error && (
          <div className='bg-rose-50 dark:bg-rose-950 text-rose-700 rounded-md p-3 mb-4 text-center'>
            <span className='font-medium'>{error}</span>
          </div>
        )}

        <form className='space-y-4' onSubmit={e => { e.preventDefault(); handleSignIn(); }}>
          <div>
            <label className='block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2'>
              Email address
            </label>
            <input
              type='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder='name@example.com'
              className='w-full px-3.5 py-2.5 text-base font-bold rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition'
              required
            />
            <p className='text-xs text-slate-500 dark:text-slate-400 mt-1'>{!
              email ? 'Enter your email' :
              !emailPattern.test(email) ? 'Enter a valid email address (e.g., name@example.com)'
              : ''
            }</p>
          </div>

          <div>
            <label className='block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2'>
              Password
            </label>
            <input
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder='••••••••'
              className='w-full px-3.5 py-2.5 text-base font-bold rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition'
              minLength={8}
              required
            />
            <p className='text-xs text-slate-500 dark:text-slate-400 mt-1'>{!
              password ? 'Enter your password'
              : password.length < 8 ? 'Password must be at least 8 characters'
              : ''
            }</p>
          </div>

          {mode === 'signup' && (
            <>
              <div>
                <label className='block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2'>
                  Full name
                </label>
                <input
                  type='text'
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder='Your full name'
                  className='w-full px-3.5 py-2.5 text-base font-bold rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition'
                  required
                />
                <p className='text-xs text-slate-500 dark:text-slate-400 mt-1'>{!
                  name ? 'Enter your full name'
                  : name.trim().length < 2 ? 'Full name must be at least 2 characters'
                  : ''
                }</p>
              </div>
              <div>
                <label className='block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2'>
                  Confirm password
                </label>
                <input
                  type='password'
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder='••••••••'
                  className='w-full px-3.5 py-2.5 text-base font-bold rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition'
                  required
                />
                <p className='text-xs text-slate-500 dark:text-slate-400 mt-1'>{!
                  confirmPassword ? 'Confirm your password'
                  : confirmPassword !== password ? 'Passwords do not match'
                  : ''
                }</p>
              </div>
            </>
          )}

          <div>
            <button
              type='submit'
              disabled={loading}
              className={`w-full py-2.5 px-4 text-xs font-semibold rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white transition shrink-0 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Processing...' : mode === 'signin' ? 'Sign In' : 'Create Account'}
            </button>
          </div>
        </form>

        <div className='mt-6 text-center'>
          <button
            onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
            className='text-sm font-medium text-emerald-600 dark:text-emerald-400 hover underline transition'
          >
            {mode === 'signin' ? 'Create account' : 'Sign in'}
          </button>
        </div>

        <div className='mt-6 text-sm text-slate-500 dark:text-slate-400'>
          <a href='javascript:void(0)' onClick={() => supabase.auth.resetPasswordForEmail(email.trim())}>
            Forgot password?
          </a>
          {
            mode === 'signin'
              ? ' (sent to your email)'
              : ' (after signing up)'
          }
        </div>
      </div>
    </div>
  );
};
