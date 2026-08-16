import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { PageContainer } from '../../components/common/PageContainer';
import { Card } from '../../components/common/Card';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { useSupabase } from '../../hooks/useSupabase';
import { useAuth } from '../../hooks/useAuth';
import { AlertCircle } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { supabase } = useSupabase();
  const { isAuthenticated, isStaff, accountError } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const from = (location.state as any)?.from?.pathname;

  React.useEffect(() => {
    if (isAuthenticated) {
      if (isStaff) {
        navigate('/admin/dashboard', { replace: true });
      } else {
        navigate(from || '/account', { replace: true });
      }
    }
  }, [isAuthenticated, isStaff, navigate, from]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) {
      setError('System is not configured. Please contact support.');
      return;
    }

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setError('Please enter your email address.');
      return;
    }

    if (!password) {
      setError('Please enter your password.');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: trimmedEmail,
        password,
      });

      if (signInError) throw signInError;
      
      // Effect hook will handle redirect on successful login
    } catch (err: any) {
      const rawMsg = err?.message || '';
      const errorCode = err?.code || err?.error_code || '';
      
      const isEmailNotConfirmed = 
        rawMsg.toLowerCase().includes('email not confirmed') ||
        rawMsg.toLowerCase().includes('email_not_confirmed') ||
        errorCode === 'email_not_confirmed';

      const isInvalidCredentials =
        rawMsg.toLowerCase().includes('invalid login credentials') ||
        rawMsg.toLowerCase().includes('invalid credentials') ||
        errorCode === 'invalid_credentials';

      if (isEmailNotConfirmed) {
        setError('Please verify your email before signing in. Check your inbox for the verification link.');
      } else if (isInvalidCredentials) {
        setError('Invalid email or password. Please check your credentials and try again.');
      } else {
        setError(rawMsg || 'Failed to authenticate. Please check your credentials.');
      }
      setLoading(false);
    }
  };

  return (
    <PageContainer
      title="Sign In"
    >
      <div className="max-w-md mx-auto">
        <Card title="Sign In" variant="glass">
          {(error || accountError) && (
            <div className="mb-6 p-3.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-medium flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span className="leading-relaxed">{error || accountError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              label="Email Address"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="block text-xs font-semibold text-slate-300">Password</label>
                <Link to="/forgot-password" className="text-[10px] text-[#00D9FF] hover:underline">
                  Forgot Password?
                </Link>
              </div>
              <Input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button variant="primary" type="submit" className="w-full mt-2" disabled={loading}>
              {loading ? 'Signing In...' : 'Sign In'}
            </Button>
          </form>

          <div className="mt-6 text-center text-xs text-slate-400">
            Don't have an account?{' '}
            <Link to="/register" className="text-[#00D9FF] hover:underline font-semibold">
              Register
            </Link>
          </div>
        </Card>
      </div>
    </PageContainer>
  );
};
