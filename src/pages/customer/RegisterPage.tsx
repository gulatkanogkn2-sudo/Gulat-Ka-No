import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { PageContainer } from '../../components/common/PageContainer';
import { Card } from '../../components/common/Card';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { useSupabase } from '../../hooks/useSupabase';
import { useAuth } from '../../hooks/useAuth';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { supabase } = useSupabase();
  const { isAuthenticated } = useAuth();
  
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/account', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleRegister = async (e: React.FormEvent) => {
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
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role: 'customer',
          },
        },
      });

      if (signUpError) throw signUpError;
      
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Failed to register account.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer
      title="Register Account"
      description="Register for verified peptide allocations, order tracking, and research hub access."
    >
      <div className="max-w-md mx-auto">
        <Card title="New Researcher Registration" variant="glass">
          {success ? (
            <div className="text-center space-y-4 py-4">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-slate-100">Registration Successful</h3>
              <p className="text-xs text-slate-400">
                Your account has been created. Please check your email to verify your account, or sign in if email verification is disabled.
              </p>
              <Link to="/login">
                <Button variant="primary" className="w-full mt-4">
                  Proceed to Sign In
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

              <form onSubmit={handleRegister} className="space-y-4">
                <Input
                  label="Full Name / Principal Investigator"
                  type="text"
                  placeholder="Dr. Jane Doe"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
                <Input
                  label="Institutional / Research Email"
                  type="email"
                  placeholder="researcher@institution.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Input
                  label="Password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                />
                <Input
                  label="Confirm Password"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={6}
                />
                <Button variant="primary" type="submit" className="w-full mt-2" disabled={loading}>
                  {loading ? 'Registering...' : 'Register Account'}
                </Button>
              </form>

              <div className="mt-6 text-center text-xs text-slate-400">
                Already have an account?{' '}
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
