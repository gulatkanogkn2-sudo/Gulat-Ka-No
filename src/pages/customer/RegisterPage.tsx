import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { PageContainer } from '../../components/common/PageContainer';
import { Card } from '../../components/common/Card';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { useSupabase } from '../../hooks/useSupabase';
import { useAuth } from '../../hooks/useAuth';
import { Mail, AlertCircle } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { supabase } = useSupabase();
  const { isAuthenticated } = useAuth();
  
  // 7 Required Registration Fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [homeAddress, setHomeAddress] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [registeredEmail, setRegisteredEmail] = useState('');
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

    const trimmedFullName = fullName.trim();
    const trimmedEmail = email.trim();
    const trimmedPhone = phone.trim();
    const trimmedAddress = homeAddress.trim();

    // Validation: Check all 7 fields
    if (!trimmedFullName) {
      setError('Full Name is required.');
      return;
    }

    if (!trimmedEmail) {
      setError('Email Address is required.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      setError('Please provide a valid email address.');
      return;
    }

    if (!trimmedPhone) {
      setError('Phone Number is required.');
      return;
    }

    if (!birthDate) {
      setError('Birth Date is required.');
      return;
    }

    const parsedBirthDate = new Date(birthDate);
    if (isNaN(parsedBirthDate.getTime())) {
      setError('Please provide a valid birth date.');
      return;
    }

    const today = new Date();
    today.setHours(23, 59, 59, 999);
    if (parsedBirthDate > today) {
      setError('Birth date cannot be in the future.');
      return;
    }

    if (!trimmedAddress) {
      setError('Full Home Address is required.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      // Pass metadata matching the existing live profile trigger
      const { error: signUpError } = await supabase.auth.signUp({
        email: trimmedEmail,
        password,
        options: {
          data: {
            full_name: trimmedFullName,
            phone: trimmedPhone,
            birth_date: birthDate,
            primary_address: trimmedAddress,
          },
        },
      });

      if (signUpError) throw signUpError;
      
      setRegisteredEmail(trimmedEmail);
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
    >
      <div className="max-w-lg mx-auto">
        <Card title="Register Account" variant="glass">
          {success ? (
            <div className="text-center space-y-5 py-6">
              <div className="w-16 h-16 rounded-2xl bg-[#00D9FF]/10 border border-[#00D9FF]/30 text-[#00D9FF] flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(0,217,255,0.15)]">
                <Mail className="w-8 h-8" />
              </div>
              
              <div className="space-y-1">
                <h3 className="text-xl font-bold tracking-wider text-white uppercase font-mono">
                  CHECK YOUR EMAIL
                </h3>
                <p className="text-xs text-slate-300">
                  Your GKN account has been created.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-black/50 border border-[#00D9FF]/20 font-mono text-xs text-slate-300 space-y-1">
                <p className="text-slate-400">We sent a verification link to:</p>
                <p className="font-bold text-[#00D9FF] text-sm break-all">{registeredEmail}</p>
              </div>

              <p className="text-xs text-slate-400">
                Verify your email before signing in.
              </p>

              <Link to="/login" className="block pt-2">
                <Button variant="primary" className="w-full">
                  GO TO SIGN IN
                </Button>
              </Link>
            </div>
          ) : (
            <>
              {error && (
                <div className="mb-6 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-medium flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleRegister} className="space-y-4">
                <Input
                  label="Full Name"
                  type="text"
                  placeholder="Your full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />

                <Input
                  label="Email Address"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Phone Number"
                    type="tel"
                    placeholder="e.g. 0917 123 4567"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />

                  <Input
                    label="Birth Date"
                    type="date"
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    required
                  />
                </div>

                <Input
                  label="Full Home Address"
                  type="text"
                  placeholder="House/Unit #, Street, Barangay, City, Province, Postal Code"
                  value={homeAddress}
                  onChange={(e) => setHomeAddress(e.target.value)}
                  required
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Password"
                    type="password"
                    placeholder="At least 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                  />

                  <Input
                    label="Confirm Password"
                    type="password"
                    placeholder="Re-enter password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                </div>

                <Button variant="primary" type="submit" className="w-full mt-4" disabled={loading}>
                  {loading ? 'Registering Account...' : 'Register Account'}
                </Button>
              </form>

              <div className="mt-6 text-center text-xs text-slate-400">
                Already have an account?{' '}
                <Link to="/login" className="text-[#00D9FF] hover:underline font-semibold">
                  Sign In
                </Link>
              </div>
            </>
          )}
        </Card>
      </div>
    </PageContainer>
  );
};
