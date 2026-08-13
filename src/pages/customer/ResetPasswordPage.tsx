import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { PageContainer } from '../../components/common/PageContainer';
import { Card } from '../../components/common/Card';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { useSupabase } from '../../hooks/useSupabase';

export const ResetPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const { supabase } = useSupabase();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Optional: check if we actually have a session or recovery token
    const checkSession = async () => {
      if (!supabase) return;
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setError('Your password reset link is invalid or has expired.');
      }
    };
    checkSession();
  }, [supabase]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) {
      setError('System is not configured. Please contact support.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password: password
      });

      if (updateError) throw updateError;
      
      setSuccess(true);
      // Wait a moment then redirect
      setTimeout(() => {
        navigate('/login', { replace: true });
      }, 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to update password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer
      title="Create New Password"
      description="Enter your new password below to regain access to your account."
    >
      <div className="max-w-md mx-auto">
        <Card title="Password Reset" variant="glass">
          {success ? (
            <div className="text-center space-y-4 py-4">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-slate-100">Password Updated</h3>
              <p className="text-xs text-slate-400">
                Your password has been successfully reset. Redirecting to sign in...
              </p>
              <Link to="/login">
                <Button variant="primary" className="w-full mt-4">
                  Sign In Now
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

              <form onSubmit={handleUpdate} className="space-y-4">
                <Input
                  label="New Password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                />
                <Input
                  label="Confirm New Password"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={6}
                />
                
                <Button variant="primary" type="submit" className="w-full mt-2" disabled={loading || !!error}>
                  {loading ? 'Updating...' : 'Update Password'}
                </Button>
              </form>
            </>
          )}
        </Card>
      </div>
    </PageContainer>
  );
};
