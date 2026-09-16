import React, { useState } from 'react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    // সাময়িকভাবে একটি ডামি টোকেন দিয়ে লগইন সফল করা হচ্ছে
    if (email && password) {
      localStorage.setItem('token', 'authenticated-nexus-token');
      window.location.reload(); // পেজ রিফ্রেশ হলে ProtectedRoute সরাসরি ড্যাশবোর্ড দেখাবে
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 text-slate-100 p-4">
      <div className="bg-slate-800 p-8 rounded-2xl shadow-xl border border-slate-700 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-2 text-white">NexusAdmin</h2>
        <p className="text-sm text-slate-400 text-center mb-6">Enter credentials to access the control center</p>
        
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
            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-colors cursor-pointer mt-2"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}
