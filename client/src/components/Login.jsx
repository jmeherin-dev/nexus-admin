import React, { useState, useEffect } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export default function Login() {
  const [step, setStep] = useState(1); // 1: Email/Password, 2: OTP Screen
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // লগইন পেজে ঢুকলে পুরোনো টোকেন ও ইউজার ডাটা অটো মুছে যাবে
  useEffect(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }, []);

  // Step 1: Handle Login & Request OTP
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      if (data.requireOTP) {
        setStep(2);
      } else if (data.token) {
        // OTP না লাগলে সরাসরি টোকেন ও ইউজার সেভ
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        window.location.reload();
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Handle OTP Verification
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Invalid or expired OTP');
      }

      // টোকেন ও ইউজার ডাটা সেভ
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      window.location.reload();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 text-slate-100 p-4">
      <div className="bg-slate-800 p-8 rounded-2xl shadow-xl border border-slate-700 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-2 text-white">
          Nexus<span className="text-indigo-500">Admin</span>
        </h2>
        <p className="text-sm text-slate-400 text-center mb-6">
          {step === 1 ? 'Enter credentials to access the control center' : 'Enter the 6-digit code sent to your email'}
        </p>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs text-center">
            {error}
          </div>
        )}

        {step === 1 ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-slate-300">Email</label>
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-slate-600 bg-slate-900 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="admin@nexus.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-slate-300">Password</label>
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-slate-600 bg-slate-900 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="••••••••"
              />
            </div>
            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-colors cursor-pointer mt-2 disabled:opacity-50"
            >
              {loading ? 'Sending OTP...' : 'Sign In with 2FA'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOTP} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-slate-300 text-center">6-Digit OTP</label>
              <input 
                type="text" 
                maxLength="6"
                required
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-slate-600 bg-slate-900 text-indigo-400 font-mono text-center text-2xl font-bold tracking-[0.5em] focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="000000"
              />
            </div>
            <button 
              type="submit" 
              disabled={loading || otp.length < 6}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition-colors cursor-pointer mt-2 disabled:opacity-50"
            >
              {loading ? 'Verifying...' : 'Verify & Login'}
            </button>
            <button 
              type="button" 
              onClick={() => { setStep(1); setError(''); }}
              className="w-full text-xs text-slate-400 hover:text-white transition-colors text-center block mt-2 cursor-pointer"
            >
              ← Back to Login
            </button>
          </form>
        )}
      </div>
    </div>
  );
}