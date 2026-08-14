import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { PageContainer } from '../../components/common/PageContainer';
import { Card } from '../../components/common/Card';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { useSupabase } from '../../hooks/useSupabase';

export const ForgotPasswordPage: React.FC = () => {
  const { supabase } = useSupabase();
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) {
      setError('System is not configured. Please contact support.');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (resetError) throw resetError;
      
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Failed to send reset link.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer
      title="Password Recovery"
      description="Enter your email to receive instructions on resetting your portal access."
    >
      <div className="max-w-md mx-auto">
        <Card title="Account Recovery" variant="glass">
          {success ? (
            <div className="text-center space-y-4 py-4">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-slate-100">Recovery Email Sent</h3>
              <p className="text-xs text-slate-400">
                If an account exists for that email, we have sent instructions to reset your password.
              </p>
              <Link to="/login">
                <Button variant="outline" className="w-full mt-4">
                  Return to Sign In
                </Button>
              </Link>
            </div>
          ) : (
            <>
              {error && (
                <div className="mb-6 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-medium">
                  {error}
                </div>
              )}

              <form onSubmit={handleReset} className="space-y-4">
                <Input
                  label="Registered Email Address"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                
                <Button variant="primary" type="submit" className="w-full mt-2" disabled={loading}>
                  {loading ? 'Processing...' : 'Send Recovery Link'}
                </Button>
              </form>

              <div className="mt-6 text-center text-xs text-slate-400">
                Remember your password?{' '}
                <Link to="/login" className="text-[#00D9FF] hover:underline font-semibold">
                  Sign In here
                </Link>
              </div>
            </>
          )}
        </Card>
      </div>
    </PageContainer>
  );
};

